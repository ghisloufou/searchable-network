"use strict";
exports.__esModule = true;
var react_1 = require("react");
var vanilla_jsoneditor_1 = require("vanilla-jsoneditor");
var _a = (0, react_1.useState)(""), activeTab = _a[0], setActiveTab = _a[1];
function PanelController() {
    var LOCALSTORAGE = window.localStorage;
    var MAXBODYSIZE = 20000;
    var HOST = "https://leviolson.com"; // "http://localhost:3000"
    var CHANGELOG = {
        "What's New": {
            "v1.0.1:": {
                "Panel Settings": HOST + "/posts/bnp-changelog#panel-settings",
                Bugs: "squashed"
            },
            "v1.0.0:": {
                "Improved Search": HOST + "/posts/bnp-changelog#improved-search",
                "JSON Editor BUILT IN": HOST + "/posts/bnp-changelog#json-editor-built-in",
                "Vertical Chrome Panel": HOST + "/posts/bnp-changelog#vertical-chrome-panel",
                "Download JSON": HOST + "/posts/bnp-changelog#download-json"
            }
        }
    };
    var search = "";
    var searchTerms = [];
    var oldSearchTerms = [];
    var andFilter = true;
    var uniqueId = 100000;
    var activeId = null;
    var requests = {};
    var masterRequests = [];
    var filteredRequests = [];
    var showAll = true;
    var limitNetworkRequests = false;
    var showOriginal = false;
    var currentDetailTab = "tab-response";
    var showIncomingRequests = true;
    var autoJSONParseDepthRes = 3;
    var autoJSONParseDepthReq = 6;
    var filter = "";
    var editor = null;
    var activeCookies = [];
    var activeHeaders = [];
    var activePostData = [];
    var activeRequest = [];
    var activeResponseData = [];
    var activeResponseCookies = [];
    var activeResponseHeaders = [];
    var activeCode = null;
    var responseJsonEditor;
    var requestJsonEditor;
    function init(type) {
        initChrome();
        var responseTarget = document.getElementById("response-jsoneditor");
        var requestTarget = document.getElementById("request-jsoneditor");
        responseJsonEditor = new vanilla_jsoneditor_1.JSONEditor({
            target: responseTarget,
            props: {
                content: {
                    json: {
                        test: "response json yo"
                    }
                },
                readOnly: true
            }
        });
        requestJsonEditor = new vanilla_jsoneditor_1.JSONEditor({
            target: requestTarget,
            props: {
                content: {
                    text: "text yo"
                }
            }
        });
        setTimeout(function () {
            responseJsonEditor.set({
                json: CHANGELOG
            });
            responseJsonEditor.expandAll();
        });
    }
    var getLSItem = function (key) {
        return JSON.parse(LOCALSTORAGE.getItem(key));
    };
    function initChrome() {
        try {
            oldSearchTerms = getLSItem("bnp-oldsearchterms") || [];
        }
        catch (e) {
            oldSearchTerms = [];
        }
        try {
            searchTerms = getLSItem("bnp-searchterms") || [];
        }
        catch (e) {
            searchTerms = [];
        }
        try {
            andFilter = getLSItem("bnp-andfilter") || false;
        }
        catch (e) {
            andFilter = false;
        }
        try {
            showIncomingRequests = !!getLSItem("bnp-scrollToNew");
        }
        catch (e) {
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
                event: event
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
        var negTerms = [];
        var posTerms = [];
        for (var _i = 0, searchTerms_1 = searchTerms; _i < searchTerms_1.length; _i++) {
            var term = searchTerms_1[_i];
            term = term.toLowerCase();
            if (term && term[0] === "-")
                negTerms.push(term.substring(1));
            else
                posTerms.push(term);
        }
        filteredRequests = masterRequests.filter(function (x) {
            if (x.separator)
                return true;
            for (var _i = 0, negTerms_1 = negTerms; _i < negTerms_1.length; _i++) {
                var term = negTerms_1[_i];
                // if neg
                if (x && x.searchIndex && x.searchIndex.includes(term))
                    return false;
            }
            if (andFilter) {
                // AND condition
                for (var _a = 0, posTerms_1 = posTerms; _a < posTerms_1.length; _a++) {
                    var term = posTerms_1[_a];
                    // if pos
                    if (x && x.searchIndex && !x.searchIndex.includes(term)) {
                        return false;
                    }
                }
                return true;
            }
            else {
                // OR condition
                for (var _b = 0, posTerms_2 = posTerms; _b < posTerms_2.length; _b++) {
                    var term = posTerms_2[_b];
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
        LOCALSTORAGE.setItem("bnp-scrollToNew", JSON.stringify(showIncomingRequests));
        LOCALSTORAGE.setItem("bnp-andfilter", JSON.stringify(andFilter));
        LOCALSTORAGE.setItem("bnp-searchterms", JSON.stringify(searchTerms));
        LOCALSTORAGE.setItem("bnp-oldsearchterms", JSON.stringify(oldSearchTerms));
        console.debug("Saving", showIncomingRequests, andFilter, searchTerms, oldSearchTerms);
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
        addRequest(har_entry, har_entry.request.method, har_entry.request.url, har_entry.response.status);
    }
    function addRequest(data, request_method, request_url, response_status) {
        var requestId = data.id || uniqueId;
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
                var text = data &&
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
            }
            catch (e) {
                console.debug("Error", e);
            }
        }
        data.request_url = request_url;
        data.response_status = response_status;
        data["id"] = requestId;
        var ctObj = data.response_headers.find(function (x) { return x.name == "Content-Type"; });
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
            if (masterRequests.length >= 500)
                masterRequests.shift();
            var keys = Object.keys(requests).reverse().slice(500);
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
        if (separator)
            return "separator";
        if (requestId === activeId) {
            return "selected";
        }
        else {
            return "";
        }
    }
    function titleIfSeparator(separator) {
        if (separator)
            return "Page reloaded here";
        return "";
    }
    function createKeypairs(data) {
        var keypairs = [];
        if (!(data instanceof Object)) {
            return keypairs;
        }
        data.forEach(function (key, value) {
            if (!(value instanceof Object)) {
                keypairs.push({
                    name: key,
                    value: value
                });
            }
        });
        return keypairs;
    }
    function createKeypairsDeep(data) {
        var keypairs = [];
        if (!(data instanceof Object)) {
            return keypairs;
        }
        data.forEach(function (key, value) {
            keypairs.push({
                name: value.name,
                value: value.value
            });
        });
        return keypairs;
    }
    (0, react_1.useEffect)(function () {
        if (activeCode === null) {
            responseJsonEditor.set(null);
            requestJsonEditor.set(null);
        }
        displayCode(responseJsonEditor, activeCode, autoJSONParseDepthRes, true);
        displayCode(requestJsonEditor, activePostData, autoJSONParseDepthReq, false);
    }, [activeCode]);
    (0, react_1.useEffect)(function () {
        _setLocalStorage();
    }, [showIncomingRequests]);
    function selectDetailTab(tabId, external) {
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
    function parse(input, level, depthOverride) {
        var depth = depthOverride || 3;
        if (level > depth)
            return input;
        if (!input || typeof input === "number" || typeof input === "boolean") {
            return input;
        }
        if (Array.isArray(input)) {
            // loop and parse each node
            for (var i = 0; i < input.length; i++) {
                input[i] = parse(input[i], level ? level + 1 : 1, depth);
            }
            return input;
        }
        if (typeof input === "string") {
            try {
                input = parse(JSON.parse(input), level ? level + 1 : 1, depth);
                return input;
            }
            catch (e) {
                // not a stringified node
                return input;
            }
        }
        else if (typeof input === "object") {
            Object.keys(input).forEach(function (item) {
                input[item] = parse(input[item], level ? level + 1 : 1, depth);
                return item;
            });
        }
        else {
            // unless there is a datatype I'm not checking for....
            // console.log('shouldnt get here')
        }
        return input;
    }
    function displayCode(jsonEditor, input, depth, isResponse) {
        if (input) {
            var content = void 0;
            if (showOriginal) {
                content = parse(input, 0, 1);
            }
            else {
                content = parse(input, 0, depth);
            }
            if (typeof input === "object" || Array.isArray(input)) {
                // JSON
                jsonEditor.updateProps({ mode: "view" });
                jsonEditor.update({ text: content });
            }
            else {
                // Something else
                try {
                    var json = JSON.parse(input);
                    jsonEditor.updateProps({ mode: "view" });
                    jsonEditor.update({
                        text: content
                    });
                }
                catch (e) {
                    jsonEditor.updateProps({ mode: "code" });
                    jsonEditor.update({ text: content });
                }
            }
            if (isResponse) {
                var bodySize = activeResponseData.find(function (x) { return x.name === "bodySize"; });
                if (bodySize && bodySize.value < MAXBODYSIZE) {
                    // an arbitrary number that I picked so there is HUGE lag
                    if (jsonEditor.getMode() === "tree" ||
                        jsonEditor.getMode() === "view")
                        jsonEditor.expandAll();
                }
            }
            else {
                var bodySize = activeRequest.find(function (x) { return x.name === "bodySize"; });
                if (bodySize && bodySize.value < MAXBODYSIZE) {
                    if (jsonEditor.getMode() === "tree" ||
                        jsonEditor.getMode() === "view")
                        jsonEditor.expandAll();
                }
            }
        }
        else {
            jsonEditor.update(null);
            jsonEditor.expandAll();
        }
    }
}
