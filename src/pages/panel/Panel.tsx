import React from "react";
import { Toolbar } from "./Toolbar";
import { Tab, useOldCode } from "./useOldCode";
import "./panel.scss";
import { NetworkSearch } from "./NetworkSearch";

export const Panel: React.FC = () => {
  const {
    onClear,
    onToggleJsonParse,
    toggleSearchType,
    customSearch,
    addSearchTerm,
    removeSearchTerm,
    deleteSearchTerm,
    setActive,
    getClass,
    titleIfSeparator,
    selectDetailTab,
    search,
    setSearch,
    searchTerms,
    oldSearchTerms,
    andFilter,
    filteredRequests,
    showIncomingRequests,
    setShowIncomingRequests,
    activeCookies,
    activeHeaders,
    activePostData,
    activeRequest,
    activeResponseData,
    activeResponseCookies,
    activeResponseHeaders,
    showOriginal,
    activeTab,
  } = useOldCode();

  const handleOldSearchClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    if (e.type === "click") {
      addSearchTerm(index);
    } else if (e.type === "contextmenu") {
      deleteSearchTerm(index);
    }
  };

  type TableIdk = {
    data: any[];
    id: string;
    title?: string;
    headerText: string;
    tab?: Tab;
  }[];

  const tabRequestStats: TableIdk = [
    {
      data: activePostData,
      id: "postData",
      title: "Click to open Request preview tab",
      headerText: "Request POST Data",
      tab: "tab-request",
    },
    {
      data: activeRequest,
      id: "request-data",
      headerText: "Request Data",
    },
    {
      data: activeHeaders,
      id: "headers",
      headerText: "Request Headers",
    },
    {
      data: activeCookies,
      id: "request-cookies",
      headerText: "Request Cookies",
    },
  ];

  const tabResponseStats: TableIdk = [
    {
      data: activeResponseData,
      id: "response-data",
      headerText: "Response Data",
    },
    {
      data: activeResponseHeaders,
      id: "response-headers",
      headerText: "Response Headers",
    },
    {
      data: activeResponseCookies,
      id: "response-cookies",
      headerText: "Response Cookies",
    },
  ];

  return (
    <>
      <div className="container">
        <section className="wrapper">
          <section className="request">
            <NetworkSearch
              toggleSearchType={toggleSearchType}
              customSearch={customSearch}
              removeSearchTerm={removeSearchTerm}
              search={search}
              setSearch={setSearch}
              searchTerms={searchTerms}
              oldSearchTerms={oldSearchTerms}
              andFilter={andFilter}
              handleOldSearchClick={handleOldSearchClick}
            ></NetworkSearch>

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
                  {filteredRequests.map((request) => (
                    <tr
                      scroll-to-new
                      onClick={() =>
                        !request.separator && setActive(request.id)
                      }
                      className={`data clickable ${getClass(
                        request.id,
                        request.separator
                      )}`}
                      key={request.id}
                    >
                      <td
                        className="request"
                        title={
                          request.request_url ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {request.request_url}
                      </td>
                      <td
                        className="apextype"
                        title={
                          request.request_apex_type ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {request.request_apex_type}
                      </td>
                      <td
                        className="apexmethod"
                        title={
                          request.request_apex_method ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {request.request_apex_method}
                      </td>
                      <td
                        className="method"
                        title={
                          request.request_method ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {request.request_method}
                      </td>
                      <td
                        className="status"
                        title={
                          request.response_status ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {request.response_status}
                      </td>
                      <td
                        className="time"
                        title={
                          request.time || titleIfSeparator(request.separator)
                        }
                      >
                        {/* { request.time / 1000 | number : 2 } s */}
                        {(request.time / 1000).toFixed(2)} s
                      </td>
                      <td
                        className="datetime"
                        title={
                          request.startedDateTime ||
                          titleIfSeparator(request.separator)
                        }
                      >
                        {/* { request.startedDateTime | date: "mediumTime" } */}
                        {request.startedDateTime}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </section>

          <section className="response">
            <div id="tabs" className="tabbed-pane">
              <div className="tabbed-pane-header">
                <div className="tabbed-pane-header-contents">
                  <ul className="tabbed-pane-header-tabs">
                    <Toolbar
                      onToggleJsonParse={onToggleJsonParse}
                      onClear={onClear}
                    />
                    <li className="tabbed-pane-header-tab">
                      <a
                        href="#tab-response"
                        className="tabbed-pane-header-tab-title"
                        onClick={() => selectDetailTab("tab-response")}
                      >
                        <span>
                          {showOriginal ? "Raw" : "Formatted"} Response
                        </span>
                      </a>
                    </li>
                    <li className="tabbed-pane-header-tab">
                      <a
                        href="#tab-request"
                        className="tabbed-pane-header-tab-title"
                        onClick={() => selectDetailTab("tab-request")}
                      >
                        <span>
                          {showOriginal ? "Raw" : "Formatted"} Request
                        </span>
                      </a>
                    </li>
                    <li className="tabbed-pane-header-tab">
                      <a
                        href="#tab-request-stats"
                        className="tabbed-pane-header-tab-title"
                        onClick={() => selectDetailTab("tab-request-stats")}
                      >
                        Request
                      </a>
                    </li>
                    <li className="tabbed-pane-header-tab">
                      <a
                        href="#tab-response-stats"
                        className="tabbed-pane-header-tab-title"
                        onClick={() => selectDetailTab("tab-response-stats")}
                      >
                        Response
                      </a>
                    </li>
                    <li className="tabbed-pane-header-tab">
                      <a
                        href="#tab-settings"
                        className="tabbed-pane-header-tab-title"
                        onClick={() => selectDetailTab("tab-settings")}
                      >
                        Panel Settings
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="toolbar"></div>
              </div>

              <div className="tabbed-pane-content data-grid data-grid-details">
                <div
                  id="tab-request-stats"
                  style={{
                    display: activeTab === "tab-request-stats" ? "" : "none",
                  }}
                >
                  {tabRequestStats
                    .filter(({ data }) => data && data.length)
                    .map(({ data, headerText, id, tab, title }) => (
                      <table id={id} className="styled" title={title} key={id}>
                        <thead>
                          <tr>
                            <th colSpan={2}>{headerText}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((param) => (
                            <tr
                              onClick={() => tab && selectDetailTab(tab)}
                              key={param.name}
                            >
                              <td className="key">{param.name}</td>
                              {/* <td><pretty-print data="param.value" /></td> */}
                              <td className="value">
                                {JSON.stringify(param.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))}
                </div>

                <div
                  id="tab-response-stats"
                  style={{
                    display: activeTab === "tab-response-stats" ? "" : "none",
                  }}
                >
                  {tabResponseStats
                    .filter(({ data }) => data.length)
                    .map(({ data, headerText, id, tab, title }) => (
                      <table id={id} className="styled" title={title} key={id}>
                        <thead>
                          <tr>
                            <th colSpan={2}>{headerText}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((param) => (
                            <tr
                              onClick={() => tab && selectDetailTab(tab)}
                              key={param.name}
                            >
                              <td className="key">{param.name}</td>
                              {/* <td><pretty-print data="param.value" /></td> */}
                              <td className="value">
                                {JSON.stringify(param.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))}
                </div>

                <div
                  id="tab-response"
                  style={{
                    display: activeTab === "tab-response" ? "" : "none",
                  }}
                >
                  <div id="response-jsoneditor"></div>
                </div>

                <div
                  id="tab-request"
                  style={{
                    display: activeTab === "tab-request" ? "" : "none",
                  }}
                >
                  <div id="request-jsoneditor"></div>
                </div>

                <div
                  id="tab-settings"
                  style={{
                    display: activeTab === "tab-settings" ? "" : "none",
                  }}
                >
                  <h3>Settings</h3>
                  <div className="form-group">
                    <label htmlFor="scroll-to-new">
                      Auto Scroll Network Log
                    </label>
                    <input
                      type="checkbox"
                      name="scroll-to-new"
                      id="scroll-to-new"
                      checked={showIncomingRequests}
                      onChange={() =>
                        setShowIncomingRequests((value) => !value)
                      }
                    />
                  </div>

                  {/* <h3>Coming Soon</h3> */}
                  {/* <div className="form-group" title="Not implemented yet">
                    <label htmlFor="clear-on-refresh">
                      Clear Network Log on Page Refresh
                    </label>
                    <input
                      disabled
                      type="checkbox"
                      name="clear-on-refresh"
                      id="clear-on-refresh"
                      checked={clearOnRefresh}
                      onChange={() => setClearOnRefresh((value) => !value)}
                    />
                  </div> */}

                  {/* <div className="form-group" title="Not implemented yet">
                    <label htmlFor="auto-json-parse-depth-response">
                      Auto JSON Parse Depth (Response)
                    </label>
                    <input
                      disabled
                      type="number"
                      name="auto-json-parse-depth-response"
                      id="auto-json-parse-depth-response"
                      value={autoJSONParseDepthRes}
                      onChange={(e) => setAutoJSONParseDepthRes(e.target.value)}
                    />
                  </div> */}

                  {/* <div className="form-group" title="Not implemented yet">
                    <label htmlFor="auto-json-parse-depth-request">
                      Auto JSON Parse Depth (Request)
                    </label>
                    <input
                      disabled
                      type="number"
                      name="auto-json-parse-depth-request"
                      id="auto-json-parse-depth-request"
                      value={autoJSONParseDepthReq}
                      onChange={(e) => setAutoJSONParseDepthReq(e.target.value)}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};
