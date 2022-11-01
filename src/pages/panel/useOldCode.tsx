import { useEffect, useState } from "react";
import JSONEditor, { JSONEditorOptions, EditableNode } from "jsoneditor";

export type Tab =
  | "tab-response"
  | "tab-request"
  | "tab-response-stats"
  | "tab-request-stats"
  | "tab-settings";

export function useOldCode() {
  const [activeTab, setActiveTab] = useState<Tab>("tab-response");
  const [search, setSearch] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [showIncomingRequests, setShowIncomingRequests] = useState(true);
  const [searchTerms, setSearchTerms] = useState([]);
  const [oldSearchTerms, setOldSearchTerms] = useState([]);
  const [andFilter, setAndFilter] = useState(true);
  const [uniqueId, setUniqueId] = useState(100000);
  const [activeId, setActiveId] = useState(null);
  const [requests, setRequests] = useState({});
  const [masterRequests, setMasterRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [responseJsonEditor, setResponseJsonEditor] = useState<JSONEditor>();
  const [requestJsonEditor, setRequestJsonEditor] = useState<JSONEditor>();

  const [activeCookies, setActiveCookies] = useState([]);
  const [activeHeaders, setActiveHeaders] = useState([]);
  const [activePostData, setActivePostData] = useState([]);
  const [activeRequest, setActiveRequest] = useState([]);
  const [activeResponseData, setActiveResponseData] = useState([]);
  const [activeResponseCookies, setActiveResponseCookies] = useState([]);
  const [activeResponseHeaders, setActiveResponseHeaders] = useState([]);
  const [activeCode, setActiveCode] = useState(null);

  const LOCALSTORAGE = window.localStorage;
  const MAXBODYSIZE = 20000;
  const DEFAULTJSON = {
    default: {
      json: "example",
    },
  };
  const limitNetworkRequests = true;
  const showAll = true;
  const autoJSONParseDepthRes = 3;
  const autoJSONParseDepthReq = 6;
  const filter = "";
  const editor = null;

  const onToggleJsonParse = () => {
    setShowOriginal(!showOriginal);
    selectDetailTab(activeTab);
  };

  const onClear = () => {
    clear();
  };

  useEffect(() => {
    if (responseJsonEditor) {
      responseJsonEditor.update(DEFAULTJSON);
      responseJsonEditor.expandAll();
    }
  }, [responseJsonEditor]);

  useEffect(() => {
    if (activeCode === null && responseJsonEditor && requestJsonEditor) {
      responseJsonEditor.update(null);
      requestJsonEditor.update(null);
    }
    displayCode(responseJsonEditor, activeCode, autoJSONParseDepthRes, true);
    displayCode(
      requestJsonEditor,
      activePostData,
      autoJSONParseDepthReq,
      false
    );
  }, [activeCode]);

  useEffect(() => {
    _setLocalStorage();
  }, [showIncomingRequests]);

  useEffect(() => {
    init();
  }, []);

  function init() {
    initChrome();

    const responseTarget = document.getElementById("response-jsoneditor");
    const requestTarget = document.getElementById("request-jsoneditor");

    const options: JSONEditorOptions = {
      mode: "view",
      modes: ["code", "view"],
      onEditable: (node) => {
        if (!(node as EditableNode).path) {
          // In modes code and text, node is empty: no path, field, or value
          // returning false makes the text area read-only
          return false;
        }
        return true;
      },
    };

    // responseJsonEditor = new JSONEditor({
    //   target: responseTarget,
    //   props: {
    //     content: {
    //       json: {
    //         test: CHANGELOG,
    //       },
    //     },
    //     readOnly: true,
    //   },
    // });

    setResponseJsonEditor(new JSONEditor(responseTarget, options));
    setRequestJsonEditor(new JSONEditor(requestTarget, options));
  }

  const getLSItem = (key: string) => {
    return JSON.parse(LOCALSTORAGE.getItem(key));
  };

  function initChrome() {
    try {
      setOldSearchTerms(getLSItem("bnp-oldsearchterms") || []);
    } catch (e) {
      setOldSearchTerms([]);
    }

    try {
      setSearchTerms(getLSItem("bnp-searchterms") || []);
    } catch (e) {
      setSearchTerms([]);
    }

    try {
      setAndFilter(getLSItem("bnp-andfilter") || false);
    } catch (e) {
      setAndFilter(false);
    }

    try {
      setShowIncomingRequests(!!getLSItem("bnp-scrollToNew"));
    } catch (e) {
      setShowIncomingRequests(true);
    }

    console.debug("Retrieving Settings from Local Storage");

    chrome.devtools.network.onRequestFinished.addListener((request) => {
      // do not show requests to chrome extension resources
      if (request.request.url.startsWith("chrome-extension://")) {
        return;
      }
      handleRequest(request);
    });

    chrome.devtools.network.onNavigated.addListener((event) => {
      // display a line break in the network logs to show page reloaded
      setMasterRequests((masterRequests) =>
        masterRequests.concat({
          id: uniqueId,
          separator: true,
          event: event,
        })
      );
      setUniqueId((uniqueId) => uniqueId++);
      cleanRequests();
    });
  }

  function filterRequests() {
    if (!searchTerms || searchTerms.length === 0) {
      setFilteredRequests(masterRequests);
      return;
    }
    console.log("Filtering for: ", searchTerms);

    const negTerms = [];
    const posTerms = [];
    for (let term of searchTerms) {
      term = term.toLowerCase();
      if (term && term[0] === "-") {
        negTerms.push(term.substring(1));
      } else {
        posTerms.push(term);
      }
    }

    const newFilteredRequests = masterRequests.filter((x) => {
      if (x.separator) {
        return true;
      }
      for (const term of negTerms) {
        // if neg
        if (x && x.searchIndex && x.searchIndex.includes(term)) {
          return false;
        }
      }

      if (andFilter) {
        // AND condition
        for (const term of posTerms) {
          // if pos
          if (x && x.searchIndex && !x.searchIndex.includes(term)) {
            return false;
          }
        }
        return true;
      } else {
        // OR condition
        for (const term of posTerms) {
          // if pos
          if (x && x.searchIndex && x.searchIndex.includes(term)) {
            return true;
          }
        }
        return false;
      }
    });

    setFilteredRequests(newFilteredRequests);
  }

  function toggleSearchType() {
    setAndFilter((andFilter) => !andFilter);
    _setLocalStorage();
    filterRequests();
  }

  function customSearch() {
    if (!searchTerms.includes(search)) {
      setSearchTerms((st) => st.concat(search));
      setSearch("");
      _setLocalStorage();
      filterRequests();
    }
  }

  function _setLocalStorage() {
    // do some sort of comparison to searchTerms and oldSearchTerms to make sure there is only one.
    // although, now that I think about it... this comparison shouldn't be necessary... /shrug
    LOCALSTORAGE.setItem(
      "bnp-scrollToNew",
      JSON.stringify(showIncomingRequests)
    );
    LOCALSTORAGE.setItem("bnp-andfilter", JSON.stringify(andFilter));
    LOCALSTORAGE.setItem("bnp-searchterms", JSON.stringify(searchTerms));
    LOCALSTORAGE.setItem("bnp-oldsearchterms", JSON.stringify(oldSearchTerms));
  }

  function addSearchTerm(index: number) {
    setSearchTerms((searchTerm) => searchTerm.concat(oldSearchTerms[index]));
    setOldSearchTerms((oldSearchTerm) =>
      oldSearchTerm.filter((_, i) => i !== index)
    );
    _setLocalStorage();
    filterRequests();
  }

  function removeSearchTerm(index: number) {
    setOldSearchTerms((oldSearchTerm) =>
      oldSearchTerm.concat(searchTerms[index])
    );
    setSearchTerms((searchTerm) => searchTerm.filter((_, i) => i !== index));
    _setLocalStorage();
    filterRequests();
  }

  function deleteSearchTerm(index: number) {
    setOldSearchTerms(oldSearchTerms.filter((_, i) => i !== index));
    _setLocalStorage();
  }

  function handleRequest(har_entry: chrome.devtools.network.Request) {
    addRequest(
      har_entry,
      har_entry.request.method,
      har_entry.request.url,
      har_entry.response.status
    );
  }

  function addRequest(
    data, // data: chrome.devtools.network.Request
    request_method: string,
    request_url: string | string[],
    response_status: number
  ) {
    const requestId = data.id || uniqueId;
    setUniqueId((uniqueId) => uniqueId++);

    if (data.request != null) {
      data["request_data"] = createKeypairs(data.request);
      if (data.request.cookies != null) {
        data.cookies = createKeypairsDeep(data.request.cookies);
      }
      if (data.request.headers != null) {
        data.headers = createKeypairsDeep(data.request.headers);
      }
      if (data.request.postData != null) {
        data.postData = createKeypairs(data.request.postData);
      }
    }
    if (data.response != null) {
      data["response_data"] = createKeypairs(data.response);
      data.response_data.response_body = "Loading " + requestId;
      if (data.response.cookies != null) {
        data["response_cookies"] = createKeypairsDeep(data.response.cookies);
      }
      if (data.response.headers != null) {
        data["response_headers"] = createKeypairsDeep(data.response.headers);
      }
    }

    data["request_method"] = request_method;
    if (request_url.includes("apexremote")) {
      try {
        const text =
          data &&
          data.request &&
          data.request.postData &&
          data.request.postData.text
            ? JSON.parse(data.request.postData.text)
            : "";
        data["request_apex_type"] =
          text.data && typeof text.data[1] === "string"
            ? text.data[1]
            : JSON.stringify(text.data);
        data["request_apex_method"] = text.method || "";
      } catch (e) {
        console.debug("Error", e);
      }
    }
    data.request_url = request_url;
    data.response_status = response_status;
    data["id"] = requestId;
    const ctObj = data.response_headers.find((x) => x.name == "Content-Type");
    data.content_type = (ctObj && ctObj.value) || null;

    setRequests((requests) => {
      requests[requestId] = data;
      return requests;
    });

    data.searchIndex = JSON.stringify(data.request).toLowerCase();
    setMasterRequests((masterRequests) => masterRequests.concat(data));

    data.getContent((content, encoding) => {
      setRequests((requests) => {
        requests[requestId].response_data.response_body = content;
        return requests;
      });
    });

    cleanRequests();
  }

  function cleanRequests() {
    if (limitNetworkRequests === true) {
      if (masterRequests.length >= 500) {
        setMasterRequests((masterRequests) => masterRequests.shift());
      }
      const keys = Object.keys(requests).reverse().slice(500);
      keys.forEach(function (key) {
        if (requests[key]) {
          setRequests((requests) => {
            delete requests[key];
            return requests;
          });
        }
      });
    }
    filterRequests();
  }

  function clear() {
    setRequests({});
    setActiveId(null);
    setMasterRequests([]);
    setFilteredRequests([]);

    setActiveCookies([]);
    setActiveHeaders([]);
    setActivePostData([]);
    setActiveRequest([]);
    setActiveResponseData([]);
    // activeResponseDataPreview = "";
    setActiveResponseCookies([]);
    setActiveResponseHeaders([]);
    setActiveCode(null);
  }

  function setActive(requestId: string) {
    if (!requests[requestId]) {
      return;
    }
    setActiveId(requestId);

    setActiveCookies(requests[requestId].cookies);
    setActiveHeaders(requests[requestId].headers);
    setActivePostData(requests[requestId].postData);
    setActiveRequest(requests[requestId].request_data);
    setActiveResponseData(requests[requestId].response_data);
    // activeResponseDataPreview = requests[requestId].response_data.response_body;
    setActiveResponseCookies(requests[requestId].response_cookies);
    setActiveResponseHeaders(requests[requestId].response_headers);
    setActiveCode(requests[requestId].response_data.response_body);
  }

  function getClass(requestId, separator) {
    if (separator) return "separator";
    if (requestId === activeId) {
      return "selected";
    } else {
      return "";
    }
  }

  function titleIfSeparator(separator) {
    if (separator) return "Page reloaded here";
    return "";
  }

  function createKeypairs(data) {
    const keypairs = [];
    if (!(data instanceof Object)) {
      return keypairs;
    }

    data.forEach((key, value) => {
      if (!(value instanceof Object)) {
        keypairs.push({
          name: key,
          value: value,
        });
      }
    });

    return keypairs;
  }

  function createKeypairsDeep(data) {
    const keypairs = [];

    if (!(data instanceof Object)) {
      return keypairs;
    }

    data.forEach((key, value) => {
      keypairs.push({
        name: value.name,
        value: value.value,
      });
    });

    return keypairs;
  }

  function selectDetailTab(tabId: Tab) {
    setActiveTab(tabId);
    if (tabId === "tab-response") {
      displayCode(responseJsonEditor, activeCode, 3, true);
    }
    if (tabId === "tab-request") {
      displayCode(requestJsonEditor, activePostData, 6, false);
    }
  }

  function parse(input: unknown, level: number, depthOverride: number) {
    const depth = depthOverride || 3;
    if (level > depth) return input;

    if (!input || typeof input === "number" || typeof input === "boolean") {
      return input;
    }

    if (Array.isArray(input)) {
      // loop and parse each node
      for (let i = 0; i < input.length; i++) {
        input[i] = parse(input[i], level ? level + 1 : 1, depth);
      }
      return input;
    }

    if (typeof input === "string") {
      try {
        input = parse(JSON.parse(input), level ? level + 1 : 1, depth);
        return input;
      } catch (e) {
        // not a stringified node
        return input;
      }
    } else if (typeof input === "object") {
      Object.keys(input).forEach(function (item) {
        input[item] = parse(input[item], level ? level + 1 : 1, depth);
        return item;
      });
    } else {
      // unless there is a datatype I'm not checking for....
      // console.log('shouldnt get here')
    }

    return input;
  }

  function displayCode(
    jsonEditor: JSONEditor,
    input,
    depth,
    isResponse: boolean
  ) {
    if (!jsonEditor) {
      return;
    }
    if (input) {
      let content;
      if (showOriginal) {
        content = parse(input, 0, 1);
      } else {
        content = parse(input, 0, depth);
      }

      if (typeof input === "object" || Array.isArray(input)) {
        // JSON
        jsonEditor.setMode("view");
        jsonEditor.update(content);
      } else {
        // Something else
        try {
          const json = JSON.parse(input);
          jsonEditor.setMode("view");
          jsonEditor.update(json);
        } catch (e) {
          jsonEditor.setMode("code");
          jsonEditor.update(content);
        }
      }

      if (isResponse) {
        const bodySize = activeResponseData.find((x) => x.name === "bodySize");
        if (bodySize && bodySize.value < MAXBODYSIZE) {
          // an arbitrary number that I picked so there is HUGE lag
          if (
            jsonEditor.getMode() === "tree" ||
            jsonEditor.getMode() === "view"
          )
            jsonEditor.expandAll();
        }
      } else {
        const bodySize = activeRequest.find((x) => x.name === "bodySize");
        if (bodySize && bodySize.value < MAXBODYSIZE) {
          if (
            jsonEditor.getMode() === "tree" ||
            jsonEditor.getMode() === "view"
          )
            jsonEditor.expandAll();
        }
      }
    } else {
      jsonEditor.update(null);
      jsonEditor.expandAll();
    }
  }

  return {
    // new func
    onToggleJsonParse,
    onClear,
    activeTab,
    // Old func
    filterRequests,
    toggleSearchType,
    customSearch,
    addSearchTerm,
    removeSearchTerm,
    deleteSearchTerm,
    setActive,
    getClass,
    titleIfSeparator,
    selectDetailTab,
    // Old data
    search,
    setSearch,
    searchTerms,
    oldSearchTerms,
    andFilter,
    uniqueId,
    activeId,
    requests,
    masterRequests,
    filteredRequests,
    showAll,
    limitNetworkRequests,
    showIncomingRequests,
    setShowIncomingRequests,
    autoJSONParseDepthRes,
    autoJSONParseDepthReq,
    filter,
    editor,
    activeCookies,
    activeHeaders,
    activePostData,
    activeRequest,
    activeResponseData,
    activeResponseCookies,
    activeResponseHeaders,
    activeCode,
    responseJsonEditor,
    requestJsonEditor,
    showOriginal,
  };
}
