import { useEffect, useState } from "react";
import { JSONEditor, Mode } from "vanilla-jsoneditor";

type Tab =
  | "tab-response"
  | "tab-request"
  | "tab-response-stats"
  | "tab-request-stats"
  | "tab-settings";

export function useOldCode() {
  const [activeTab, setActiveTab] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);

  const onClear = () => {
    console.log("onClear");
    clear();
  };

  const onDonwload = () => {
    console.log("onDonwload");
    const panel = currentDetailTab;
    if (panel === "tab-response") {
      var blob = new Blob([JSON.parse(JSON.stringify(activeCode, null, 4))], {
        type: "application/json;charset=utf-8",
      });
      // saveAs(blob, "export_response.json");
    } else {
      try {
        var blob = new Blob([JSON.stringify(activePostData)], {
          type: "application/json;charset=utf-8",
        });
        // saveAs(blob, "export_request.json");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onToggleJsonParse = () => {
    console.log("onToggleJsonParse");
    setShowOriginal(!showOriginal);
    selectDetailTab(currentDetailTab);
  };

  const LOCALSTORAGE = window.localStorage;
  const MAXBODYSIZE = 20000;
  const HOST = "https://leviolson.com"; // "http://localhost:3000"
  const CHANGELOG = {
    "What's New": {
      "v1.0.1:": {
        "Panel Settings": HOST + "/posts/bnp-changelog#panel-settings",
        Bugs: "squashed",
      },
      "v1.0.0:": {
        "Improved Search": HOST + "/posts/bnp-changelog#improved-search",
        "JSON Editor BUILT IN":
          HOST + "/posts/bnp-changelog#json-editor-built-in",
        "Vertical Chrome Panel":
          HOST + "/posts/bnp-changelog#vertical-chrome-panel",
        "Download JSON": HOST + "/posts/bnp-changelog#download-json",
      },
    },
  };

  let search = "";
  let searchTerms = [];
  let oldSearchTerms = [];
  let andFilter = true;
  let uniqueId = 100000;
  let activeId = null;
  let requests = {};
  let masterRequests = [];
  let filteredRequests = [];
  const showAll = true;
  let limitNetworkRequests = false;
  let currentDetailTab: Tab = "tab-response";
  let showIncomingRequests = true;
  const autoJSONParseDepthRes = 3;
  const autoJSONParseDepthReq = 6;
  const filter = "";
  const editor = null;
  let activeCookies = [];
  let activeHeaders = [];
  let activePostData = [];
  let activeRequest = [];
  let activeResponseData = [];
  let activeResponseCookies = [];
  let activeResponseHeaders = [];
  let activeCode = null;
  let responseJsonEditor: JSONEditor;
  let requestJsonEditor: JSONEditor;

  function init(type) {
    initChrome();

    const responseTarget = document.getElementById("response-jsoneditor");
    const requestTarget = document.getElementById("request-jsoneditor");
    responseJsonEditor = new JSONEditor({
      target: responseTarget,
      props: {
        content: {
          json: {
            test: "response json yo",
          },
        },
        readOnly: true,
      },
    });
    requestJsonEditor = new JSONEditor({
      target: requestTarget,
      props: {
        content: {
          text: "text yo",
        },
      },
    });

    setTimeout(() => {
      responseJsonEditor.set({
        json: CHANGELOG,
      });
      responseJsonEditor.expandAll();
    });
  }

  const getLSItem = (key: string) => {
    return JSON.parse(LOCALSTORAGE.getItem(key));
  };

  function initChrome() {
    try {
      oldSearchTerms = getLSItem("bnp-oldsearchterms") || [];
    } catch (e) {
      oldSearchTerms = [];
    }

    try {
      searchTerms = getLSItem("bnp-searchterms") || [];
    } catch (e) {
      searchTerms = [];
    }

    try {
      andFilter = getLSItem("bnp-andfilter") || false;
    } catch (e) {
      andFilter = false;
    }

    try {
      showIncomingRequests = !!getLSItem("bnp-scrollToNew");
    } catch (e) {
      showIncomingRequests = true;
    }

    console.debug("Retrieving Settings from Local Storage");

    chrome.devtools.network.onRequestFinished.addListener(function (request) {
      // do not show requests to chrome extension resources
      if (request.request.url.startsWith("chrome-extension://")) {
        return;
      }
      handleRequest(request);
    });

    chrome.devtools.network.onNavigated.addListener(function (event) {
      // display a line break in the network logs to show page reloaded
      masterRequests.push({
        id: uniqueId,
        separator: true,
        event: event,
      });
      uniqueId++;
      cleanRequests();
    });
  }

  function filterRequests() {
    if (!searchTerms || searchTerms.length === 0) {
      filteredRequests = masterRequests;
      return;
    }
    // console.log("Filtering for: ", searchTerms);

    const negTerms = [];
    const posTerms = [];
    for (let term of searchTerms) {
      term = term.toLowerCase();
      if (term && term[0] === "-") negTerms.push(term.substring(1));
      else posTerms.push(term);
    }

    filteredRequests = masterRequests.filter(function (x) {
      if (x.separator) return true;
      for (const term of negTerms) {
        // if neg
        if (x && x.searchIndex && x.searchIndex.includes(term)) return false;
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
  }

  function toggleSearchType() {
    andFilter = !andFilter;
    _setLocalStorage();
    filterRequests();
  }

  function customSearch() {
    if (!searchTerms.includes(search)) {
      searchTerms.push(search);
      search = "";
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
    console.debug(
      "Saving",
      showIncomingRequests,
      andFilter,
      searchTerms,
      oldSearchTerms
    );
  }

  function addSearchTerm(index) {
    searchTerms.push(oldSearchTerms.splice(index, 1)[0]);
    _setLocalStorage();
    filterRequests();
  }

  function removeSearchTerm(index) {
    oldSearchTerms.push(searchTerms.splice(index, 1)[0]);
    _setLocalStorage();
    filterRequests();
  }

  function deleteSearchTerm(index) {
    oldSearchTerms.splice(index, 1);
    _setLocalStorage();
  }

  function handleRequest(har_entry) {
    addRequest(
      har_entry,
      har_entry.request.method,
      har_entry.request.url,
      har_entry.response.status
    );
  }

  function addRequest(data, request_method, request_url, response_status) {
    const requestId = data.id || uniqueId;
    uniqueId++;

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

    requests[requestId] = data; // master
    data.searchIndex = JSON.stringify(data.request).toLowerCase();
    masterRequests.push(data);

    data.getContent(function (content, encoding) {
      requests[requestId].response_data.response_body = content;
    });

    cleanRequests();
  }

  function cleanRequests() {
    if (limitNetworkRequests === true) {
      if (masterRequests.length >= 500) masterRequests.shift();
      const keys = Object.keys(requests).reverse().slice(500);
      keys.forEach(function (key) {
        if (requests[key]) {
          delete requests[key];
        }
      });
    }
    filterRequests();
  }

  function clear() {
    requests = {};
    activeId = null;
    masterRequests = [];
    filteredRequests = [];

    activeCookies = [];
    activeHeaders = [];
    activePostData = [];
    activeRequest = [];
    activeResponseData = [];
    // activeResponseDataPreview = "";
    activeResponseCookies = [];
    activeResponseHeaders = [];
    activeCode = null;
  }

  function setActive(requestId) {
    if (!requests[requestId]) {
      return;
    }
    activeId = requestId;

    activeCookies = requests[requestId].cookies;
    activeHeaders = requests[requestId].headers;
    activePostData = requests[requestId].postData;
    activeRequest = requests[requestId].request_data;
    activeResponseData = requests[requestId].response_data;
    // activeResponseDataPreview = requests[requestId].response_data.response_body;
    activeResponseCookies = requests[requestId].response_cookies;
    activeResponseHeaders = requests[requestId].response_headers;
    activeCode = requests[requestId].response_data.response_body;
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

  useEffect(() => {
    if (activeCode === null) {
      responseJsonEditor.set(null);
      requestJsonEditor.set(null);
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

  function selectDetailTab(tabId: Tab, external = false) {
    currentDetailTab = tabId;
    if (external) {
      setActiveTab(tabId);
    }
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
    if (input) {
      let content;
      if (showOriginal) {
        content = parse(input, 0, 1);
      } else {
        content = parse(input, 0, depth);
      }

      if (typeof input === "object" || Array.isArray(input)) {
        // JSON
        jsonEditor.updateProps({ mode: "view" as Mode });
        jsonEditor.update({ text: content });
      } else {
        // Something else
        try {
          const json = JSON.parse(input);
          jsonEditor.updateProps({ mode: "view" as Mode });
          jsonEditor.update({
            text: content,
          });
        } catch (e) {
          jsonEditor.updateProps({ mode: "code" as Mode });
          jsonEditor.update({ text: content });
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

  return { onClear, onDonwload, onToggleJsonParse };
}
