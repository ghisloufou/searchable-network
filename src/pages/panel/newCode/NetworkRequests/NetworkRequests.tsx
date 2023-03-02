import { useContext } from "react";
import { ErrorrableTd } from "./ErrorrableTd";
import { getNetworkRequestWithContent } from "./getNetworkRequestWithContent";
import { NetworkRequestsToolbar } from "./NetworkRequestsToolbar";
import { NetworkRequestEnhanced, RequestContext } from "../Panel";
import { useGetNetworkData } from "./useGetNetworkData";
import { FixedSizeList } from "react-window";

type NetworkRequestsProps = {
  onRequestChange: (request: NetworkRequestEnhanced) => void;
};

export function NetworkRequests({ onRequestChange }: NetworkRequestsProps) {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);
  const {
    filteredRequests,
    filters,
    ignoreFilters,
    searchRef,
    tableRef,
    isFilterXhrEnabled,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContentInRequests,
    setIsFilterXhrEnabled,
  } = useGetNetworkData();

  const handleOnRequestClick = async (request: NetworkRequestEnhanced) => {
    const requestWithContent = await getNetworkRequestWithContent(request);
    updateResponseContentInRequests(requestWithContent);
    onRequestChange(requestWithContent);
  };

  const Row = ({ index }) => {
    const request = filteredRequests[index];
    const isError = request.response.status >= 400;
    return (
      <tr
        key={request.id}
        onClick={() => handleOnRequestClick(request)}
        className={`clickable ${
          selectedRequest?.id === request.id ? "selected" : ""
        } ${isError ? "request-error" : ""}`}
      >
        <ErrorrableTd isError={isError} value={index} />
        <ErrorrableTd
          isError={isError}
          title={request.request.url}
          value={request.request.truncatedUrl}
        />
        <ErrorrableTd isError={isError} value={request.response.status} />
        <ErrorrableTd isError={isError} value={request.request.method} />
        <ErrorrableTd isError={isError} value={request.response.type} />
      </tr>
    );
  };

  return (
    <section>
      <NetworkRequestsToolbar
        isFilterXhrEnabled={isFilterXhrEnabled}
        filteredRequests={filteredRequests}
        filters={filters}
        ignoreFilters={ignoreFilters}
        searchRef={searchRef}
        addFilter={addFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
        loadPreviousRequests={loadPreviousRequests}
        setIsFilterXhrEnabled={setIsFilterXhrEnabled}
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
              <th scope="col">Type</th>
            </tr>
          </thead>
          {/* <FixedSizeList
            className="List"
            height={400}
            itemCount={filteredRequests.length}
            itemSize={22.5}
            width={"100%"}
            children={Row}
          /> */}
          <tbody>
            {filteredRequests.map((request, index) => {
              const isError = request.response.status >= 400;
              return (
                <tr
                  key={request.id}
                  onClick={() => handleOnRequestClick(request)}
                  className={`clickable ${
                    selectedRequest?.id === request.id ? "selected" : ""
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
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
