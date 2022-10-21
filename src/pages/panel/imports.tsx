import { useEffect } from "react";

function Console() {}

Console.Type = {
  LOG: "log",
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  GROUP: "group",
  GROUP_COLLAPSED: "groupCollapsed",
  GROUP_END: "groupEnd",
};

Console.addMessage = function (type, format, ...args) {
  chrome.runtime.sendMessage({
    command: "sendToConsole",
    tabId: chrome.devtools.inspectedWindow.tabId,
    args: JSON.stringify(args),
  });
};

// Generate Console output methods, i.e. Console.log(), Console.debug() etc.
(function () {
  const console_types = Object.getOwnPropertyNames(Console.Type);
  for (let type = 0; type < console_types.length; ++type) {
    const method_name = Console.Type[console_types[type]];
    Console[method_name] = Console.addMessage.bind(Console, method_name);
  }
})();

function PanelController() {
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
  const showOriginal = false;
  let currentDetailTab = "tab-response";
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
  let responseJsonEditor;
  let requestJsonEditor;

  function init(type) {
    $("#tabs").tabs();

    initChrome();

    createToolbar();

    const options = {
      mode: "view",
      modes: ["code", "view"],
      onEditable: function (node) {
        if (!node.path) {
          // In modes code and text, node is empty: no path, field, or value
          // returning false makes the text area read-only
          return false;
        }
        return true;
      },
    };
    const response = document.getElementById("response-jsoneditor");
    const request = document.getElementById("request-jsoneditor");
    responseJsonEditor = new JSONEditor(response, options);
    requestJsonEditor = new JSONEditor(request, options);

    $timeout(() => {
      responseJsonEditor.set(CHANGELOG);
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

  function createToolbar() {
    toolbar.createToggleButton(
      "embed",
      "Toggle JSON Parsing (See Panel Settings)",
      false,
      function () {
        // ga('send', 'event', 'button', 'click', 'Toggle JSON Parsing');
        $apply(function () {
          showOriginal = !showOriginal;
          selectDetailTab(currentDetailTab);
          // displayCode();
        });
      },
      true
    );

    toolbar.createButton("download3", "Download", false, function () {
      // ga('send', 'event', 'button', 'click', 'Download');
      $apply(function () {
        const panel = currentDetailTab;
        if (panel === "tab-response") {
          var blob = new Blob(
            [JSON.parse(JSON.stringify(activeCode, null, 4))],
            { type: "application/json;charset=utf-8" }
          );
          saveAs(blob, "export_response.json");
        } else {
          try {
            var blob = new Blob([JSON.stringify(activePostData)], {
              type: "application/json;charset=utf-8",
            });
            saveAs(blob, "export_request.json");
          } catch (e) {
            console.log(e);
          }
        }
      });
    });

    toolbar.createButton("blocked", "Clear", false, function () {
      // ga('send', 'event', 'button', 'click', 'Clear');
      clear();
    });

    $(".toolbar").replaceWith(toolbar.render());
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
    activeResponseDataPreview = "";
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
    activeResponseDataPreview = requests[requestId].response_data.response_body;
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

    $.each(data, function (key, value) {
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
    displayCode("responseJsonEditor", activeCode, autoJSONParseDepthRes);
    displayCode("requestJsonEditor", activePostData, autoJSONParseDepthReq);
  }, [activeCode]);

  useEffect(() => {
    _setLocalStorage();
  }, [showIncomingRequests]);

  function selectDetailTab(tabId, external) {
    currentDetailTab = tabId;
    if (external) {
      $("#tabs a[href='#" + tabId + "']").trigger("click");
    }
    if (tabId === "tab-response") {
      displayCode("responseJsonEditor", activeCode, 3);
    }
    if (tabId === "tab-request") {
      displayCode("requestJsonEditor", activePostData, 6);
    }
  }

  function displayCode(elementId, input, depth) {
    if (input) {
      let content;
      if (showOriginal) {
        content = parse(input, 0, 1);
      } else {
        content = parse(input, 0, depth);
      }

      if (typeof input === "object" || Array.isArray(input)) {
        // JSON
        $scope[elementId].setMode("view");
        $scope[elementId].set(content);
      } else {
        // Something else
        try {
          const json = JSON.parse(input);
          $scope[elementId].setMode("view");
          $scope[elementId].set(content);
        } catch (e) {
          $scope[elementId].setMode("code");
          $scope[elementId].set(content);
        }
      }

      if (elementId === "responseJsonEditor") {
        var bodySize = activeResponseData.find((x) => x.name === "bodySize");
        if (bodySize && bodySize.value < MAXBODYSIZE) {
          // an arbitrary number that I picked so there is HUGE lag
          if (
            $scope[elementId].getMode() === "tree" ||
            $scope[elementId].getMode() === "view"
          )
            $scope[elementId].expandAll();
        }
      } else if (elementId === "requestJsonEditor") {
        var bodySize = activeRequest.find((x) => x.name === "bodySize");
        if (bodySize && bodySize.value < MAXBODYSIZE) {
          if (
            $scope[elementId].getMode() === "tree" ||
            $scope[elementId].getMode() === "view"
          )
            $scope[elementId].expandAll();
        }
      }
    } else {
      $scope[elementId].set(null);
      $scope[elementId].expandAll();
    }
  }
}
