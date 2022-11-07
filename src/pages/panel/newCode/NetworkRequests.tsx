import { useContext } from "react";
import { NetworkRequestEnhanced, RequestContext } from "./Panel";
import { useGetNetworkData } from "./useGetNetworkData";

type NetworkRequestsProps = {
  onRequestClick: (request: NetworkRequestEnhanced) => void;
};

function ErrorrableTd({
  isError,
  value,
  title,
}: {
  isError: boolean;
  value: string | number;
  title?: string;
}) {
  return (
    <td title={title} className={isError ? "text-danger" : ""}>
      {value}
    </td>
  );
}

export function NetworkRequests({ onRequestClick }: NetworkRequestsProps) {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);
  const {
    filteredRequests,
    filters,
    searchRef,
    tableRef,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContent,
  } = useGetNetworkData();

  const handleOnRequestClick = (request: NetworkRequestEnhanced) => {
    if (!request.response.responseContent) {
      request.getContent((responseContentUnparsed) => {
        let responseContent = { no: "response found" };
        try {
          responseContent = JSON.parse(responseContentUnparsed);
        } catch {}
        const requestWithResponseContent = {
          ...request,
          response: {
            ...request.response,
            responseContent,
          },
        };
        onRequestClick(requestWithResponseContent);
        updateResponseContent(requestWithResponseContent);
      });
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center">
        <label htmlFor="searchInput">Search</label>
        <input
          className="form-control form-control-sm mx-2"
          style={{ maxWidth: "300px", minWidth: "230px" }}
          id="searchInput"
          ref={searchRef}
          type="text"
          placeholder="Add search term then press Enter"
          onKeyUp={(e) => {
            if (e.key === "Enter" && searchRef.current.value !== "") {
              addFilter(searchRef.current.value);
              searchRef.current.value = "";
            }
          }}
        />
        <span className="me-1">Filters:</span>
        {filters.map((searchTerm, index) => (
          <span key={searchTerm} className="d-flex align-items-center">
            {index > 0 && <span className="ms-1">&</span>}
            <span
              className="btn badge text-bg-secondary ms-1 hover-bg-red"
              onClick={(e) => {
                removeFilter(index);
                e.stopPropagation();
              }}
              title="Click to delete"
            >
              {searchTerm}
            </span>
          </span>
        ))}
      </div>

      <div className="d-flex flex-wrap align-items-center">
        <button
          onClick={() => clearFilters()}
          className={`btn btn-${isDarkModeEnabled ? "dark" : "light"}`}
        >
          Clear
        </button>
        {!filters.length && !filteredRequests.length && (
          <button
            onClick={() => loadPreviousRequests()}
            className={`btn btn-${isDarkModeEnabled ? "dark" : "light"}`}
          >
            Load previous data
          </button>
        )}
      </div>

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
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr
                key={request.uuid}
                onClick={() => handleOnRequestClick(request)}
                className={`clickable ${
                  selectedRequest?.uuid === request.uuid ? "selected" : ""
                }`}
              >
                <ErrorrableTd
                  isError={request.response.status >= 400}
                  value={index}
                ></ErrorrableTd>
                <ErrorrableTd
                  title={request.request.url}
                  isError={request.response.status >= 400}
                  value={request.request.truncatedUrl}
                ></ErrorrableTd>
                <ErrorrableTd
                  isError={request.response.status >= 400}
                  value={request.response.status}
                ></ErrorrableTd>
                <ErrorrableTd
                  isError={request.response.status >= 400}
                  value={request.request.method}
                ></ErrorrableTd>
                <ErrorrableTd
                  isError={request.response.status >= 400}
                  value={request.time.toPrecision(2) + " ms"}
                ></ErrorrableTd>
              </tr>
            ))}
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
