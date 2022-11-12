import { useContext } from "react";
import { ErrorrableTd } from "./ErrorrableTd";
import { getNetworkRequestWithContent } from "./getNetworkRequestWithContent";
import { NetworkRequestsToolbar } from "./NetworkRequestsToolbar";
import { NetworkRequestEnhanced, RequestContext } from "./Panel";
import { useGetNetworkData } from "./useGetNetworkData";

type NetworkRequestsProps = {
  onRequestClick: (request: NetworkRequestEnhanced) => void;
};

export function NetworkRequests({ onRequestClick }: NetworkRequestsProps) {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);
  const {
    filteredRequests,
    filters,
    ignoreFilters,
    searchRef,
    tableRef,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContentInRequests,
  } = useGetNetworkData();

  const handleOnRequestClick = async (request: NetworkRequestEnhanced) => {
    const requestWithContent = await getNetworkRequestWithContent(request);
    updateResponseContentInRequests(requestWithContent);
    onRequestClick(requestWithContent);
  };

  return (
    <section>
      <NetworkRequestsToolbar
        filteredRequests={filteredRequests}
        filters={filters}
        ignoreFilters={ignoreFilters}
        searchRef={searchRef}
        addFilter={addFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        loadPreviousRequests={loadPreviousRequests}
      ></NetworkRequestsToolbar>

      <div
        ref={tableRef}
        style={{ maxHeight: "400px" }}
        className="overflow-auto"
      >
        <table
          className={`table table-striped table-sm custom-table ${
            isDarkModeEnabled ? "table-dark" : ""
          }`}
        >
          <thead>
            <tr
              className="sticky-top"
              style={{ boxShadow: "inset 0px -1px 0 0" }}
            >
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Method</th>
              <th scope="col">Duration</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => {
              const isError = request.response.status >= 400;
              return (
                <tr
                  key={request.uuid}
                  onClick={() => handleOnRequestClick(request)}
                  className={`clickable ${
                    selectedRequest?.uuid === request.uuid ? "selected" : ""
                  } ${isError ? "request-error" : ""}`}
                >
                  <ErrorrableTd isError={isError} value={index} />
                  <ErrorrableTd
                    isError={isError}
                    title={request.request.url}
                    value={request.request.truncatedUrl}
                  />
                  <ErrorrableTd
                    isError={isError}
                    value={request.response.status}
                  />
                  <ErrorrableTd
                    isError={isError}
                    value={request.request.method}
                  />
                  <ErrorrableTd
                    isError={isError}
                    value={request.time.toPrecision(2) + " ms"}
                  />
                  <ErrorrableTd
                    isError={isError}
                    value={request.response.type}
                  />
                </tr>
              );
            })}
            {filteredRequests.length === 0 && (
              <tr>
                <td scope="row">
                  {filters.length > 0 &&
                    "No query found with these search terms."}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
