import React from "react";
import { Toolbar } from "./Toolbar";
import { useOldCode } from "./useOldCode";
import "./Panel.css";
import "./panel.scss";

export const Panel: React.FC = () => {
  const { onClear, onDonwload, onToggleJsonParse,filterRequests,
    toggleSearchType,
    customSearch,
    addSearchTerm,
    removeSearchTerm,
    deleteSearchTerm,
    setActive,
    getClass,
    titleIfSeparator,
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
    currentDetailTab,
    showIncomingRequests,
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
    requestJsonEditor  } = useOldCode();

  return (
    <>
      <div className="container">

        
    <section className="wrapper">
      <section className="request">
        <div className="search">
          <input
            type="text"
            placeholder="Add search term then ENTER"
            title='prefix with "-" to remove from search results'
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                customSearch()
            }}
          />
          <div className="filtering">
            <span className="label">Filtering for:</span>
            {searchTerms.map(term => (
                <span >
                    <span
                    title="Click to remove"
                    className="searchterm"
                    ng-class="{ neg: term[0] == '-'}"
                    ng-click="removeSearchTerm($index)"
                    >{term}</span
                    >
                    <span
                    className="operator"
                    ng-hide="$last"
                    ng-click="toggleSearchType()"
                    >{ andFilter && 'and' || 'or' }</span
                    >
              </span>
            ))}
          </div>
          <div className="recent-searches">
            <span className="label">Recent searches:</span>
            <span
              ng-repeat="term in oldSearchTerms"
              title="Click to Search, right click to permanently remove from history"
              className="recents"
              ng-class="{ neg: term[0] == '-'}"
              ng-click="addSearchTerm($index)"
              ng-right-click="deleteSearchTerm($index)"
              >{term}</span
            >
          </div>
        </div>
        <div className="requests">
          <table
            className="header styled"
            id="requests-header"
            resizable-columns
            data-resizable-columns-sync="#requests"
          >
            <thead>
              <tr>
                <th className="request">Path</th>
                <th className="apextype">Apex Type</th>
                <th className="apexmethod">Apex Method</th>
                <th className="method">Method</th>
                <th className="status">Status</th>
                <th className="time">Time</th>
                <th className="datetime">Started</th>
              </tr>
            </thead>
          </table>
          <div className="data-container">
            <table
              id="requests"
              className="styled"
              resizable-columns
              data-resizable-columns-sync="#requests-header"
            >
              <tr className="sizing">
                <td className="request"></td>
                <td className="apextype"></td>
                <td className="apexmethod"></td>
                <td className="method"></td>
                <td className="status"></td>
                <td className="time"></td>
                <td className="datetime"></td>
              </tr>
              <tr
                className="data clickable"
                ng-repeat="request in filteredRequests | orderBy:'id'"
                scroll-to-new
                ng-click="!request.separator && setActive(request.id)"
                ng-class="getClass(request.id, request.separator)"
              >
                <td
                  className="request"
                  title="{{request.request_url || titleIfSeparator(request.separator) }}"
                >
                  {request.request_url}
                </td>
                <td
                  className="apextype"
                  title="{{request.request_apex_type || titleIfSeparator(request.separator) }}"
                >
                  {request.request_apex_type}
                </td>
                <td
                  className="apexmethod"
                  title="{{request.request_apex_method || titleIfSeparator(request.separator) }}"
                >
                  {request.request_apex_method}
                </td>
                <td
                  className="method"
                  title="{{request.request_method || titleIfSeparator(request.separator) }}"
                >
                  {request.request_method}
                </td>
                <td
                  className="status"
                  title="{{request.response_status || titleIfSeparator(request.separator) }}"
                >
                {request.response_status}
                </td>
                <td
                  className="time"
                  title="{{request.time || titleIfSeparator(request.separator) }}"
                >
                  { request.time / 1000 | number : 2 } s
                </td>
                <td
                  className="datetime"
                  title="{{request.startedDateTime || titleIfSeparator(request.separator) }}"
                >
                  { request.startedDateTime | date: "mediumTime" }
                </td>
              </tr>
            </table>
          </div>
        </div>
      </section>

      <section className="response">
        <div id="tabs" className="tabbed-pane">
          <div className="tabbed-pane-header">
            <div className="tabbed-pane-header-contents">
              <ul className="tabbed-pane-header-tabs">
                <li className="tabbed-pane-header-tab">
                  <a
                    href="#tab-response"
                    className="tabbed-pane-header-tab-title"
                    ng-click="selectDetailTab('tab-response')"
                  >
                    <span ng-show="showOriginal">Raw</span>
                    <span ng-hide="showOriginal">Formatted</span>
                    Response</a
                  >
                </li>
                <li className="tabbed-pane-header-tab">
                  <a
                    href="#tab-request"
                    className="tabbed-pane-header-tab-title"
                    ng-click="selectDetailTab('tab-request')"
                  >
                    <span ng-show="showOriginal">Raw</span>
                    <span ng-hide="showOriginal">Formatted</span>
                    Request</a
                  >
                </li>
                <li className="tabbed-pane-header-tab">
                  <a
                    href="#tab-request-stats"
                    className="tabbed-pane-header-tab-title"
                    ng-click="selectDetailTab('tab-request-stats')"
                    >Request</a
                  >
                </li>
                <li className="tabbed-pane-header-tab">
                  <a
                    href="#tab-response-stats"
                    className="tabbed-pane-header-tab-title"
                    ng-click="selectDetailTab('tab-response-stats')"
                    >Response</a
                  >
                </li>
                <li className="tabbed-pane-header-tab">
                  <a
                    href="#tab-settings"
                    className="tabbed-pane-header-tab-title"
                    ng-click="selectDetailTab('tab-settings')"
                    >Panel Settings</a
                  >
                </li>
              </ul>
            </div>

            <div className="toolbar"></div>
          </div>

          <div className="tabbed-pane-content data-grid data-grid-details">
            <div id="tab-request-stats">
              <table
                id="postData"
                className="styled"
                ng-show="activePostData.length"
                title="Click to open Request preview tab"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Request POST Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    ng-repeat="param in activePostData"
                    ng-click="selectDetailTab('tab-request', true)"
                  >
                    <td className="key">{param.name}</td>
                    <td>
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                id="request-data"
                className="styled"
                ng-show="activeRequest.length"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Request Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeRequest">
                    <td className="key">{param.name}</td>
                    <td className="value">
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table id="headers" className="styled" ng-show="activeHeaders.length">
                <thead>
                  <tr>
                    <th colSpan={2}>Request Headers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeHeaders">
                    <td className="key">{param.name}</td>
                    <td className="value">
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                id="request-cookies"
                className="styled"
                ng-show="activeResponseCookies.length"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Request Cookies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeCookies">
                    <td className="key">{param.name}</td>
                    <td>
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="tab-response-stats">
              <table
                id="response-data"
                className="styled"
                ng-show="activeResponseData.length"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Response Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeResponseData">
                    <td className="key">{param.name}</td>
                    <td className="value">
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                id="response-headers"
                className="styled"
                ng-show="activeResponseHeaders.length"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Response Headers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeResponseHeaders">
                    <td className="key">{param.name}</td>
                    <td className="value">
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                id="response-cookies"
                className="styled"
                ng-show="activeResponseCookies.length"
              >
                <thead>
                  <tr>
                    <th colSpan={2}>Response Cookies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="param in activeResponseCookies">
                    <td className="key">{param.name}</td>
                    <td>
                      {/* <pretty-print data="param.value" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="tab-response">
              <div id="response-jsoneditor"></div>
            </div>

            <div id="tab-request">
              <div id="request-jsoneditor"></div>
            </div>

            <div id="tab-settings">
              <h3>Settings</h3>
              <div className="form-group">
                <label htmlFor="scroll-to-new">Auto Scroll Network Log</label>
                <input
                  type="checkbox"
                  name="scroll-to-new"
                  id="scroll-to-new"
                  value={showIncomingRequests}
                  onChange={(e) => setShowIncomingRequests(e.target.value)}
                />
              </div>
              <h3>Coming Soon</h3>
              <div className="form-group" title="Not implemented yet">
                <label htmlFor="clear-on-refresh"
                  >Clear Network Log on Page Refresh</label
                >
                <input
                  disabled={disabled}
                  type="checkbox"
                  name="clear-on-refresh"
                  id="clear-on-refresh"
                  value={clearOnRefresh}
                  onChange={(e) => setClearOnRefresh(e.target.value)}
                />
              </div>
              <div className="form-group" title="Not implemented yet">
                <label htmlFor="auto-json-parse-depth-response"
                  >Auto JSON Parse Depth (Response)</label
                >
                <input
                  disabled={disabled}
                  type="number"
                  name="auto-json-parse-depth-response"
                  id="auto-json-parse-depth-response"
                  value={autoJSONParseDepthRes}
                  onChange={(e) => setAutoJSONParseDepthRes(e.target.value)}
                />
              </div>
              <div className="form-group" title="Not implemented yet">
                <label htmlFor="auto-json-parse-depth-request"
                  >Auto JSON Parse Depth (Request)</label
                >
                <input
                  disabled={disabled}
                  type="number"
                  name="auto-json-parse-depth-request"
                  id="auto-json-parse-depth-request"
                  value={autoJSONParseDepthReq}
                  onChange={(e) => setAutoJSONParseDepthReq(e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </section>

        <Toolbar
          onToggleJsonParse={onToggleJsonParse}
          onDonwload={onDonwload}
          onClear={onClear}
        />
      </div>
    </>
  );
};
