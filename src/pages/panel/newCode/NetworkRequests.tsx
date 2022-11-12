import { useContext } from "react";
import { NetworkRequestEnhanced, RequestContext } from "./Panel";
import { useGetNetworkData } from "./useGetNetworkData";

type NetworkRequestsProps = {
  onRequestClick: (request: NetworkRequestEnhanced) => void;
};

function ErrorrableTd({
  value,
  title,
  isError,
}: {
  value: string | number;
  title?: string;
  isError: boolean;
}) {
  return (
    <td
      title={title}
      className={`${isError ? "text-danger" : ""} text-truncate`}
    >
      {value}
    </td>
  );
}

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
        {!!filters.length && <span className="me-1">Filters:</span>}
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
        {(!filters.length || ignoreFilters.length === filters.length) &&
          !filteredRequests.length && (
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
                  } ${
                    isError ? "request-error" : ""
                  }`}
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

async function getNetworkRequestWithContent(
  request: NetworkRequestEnhanced
): Promise<NetworkRequestEnhanced> {
  let requestWithResponseContent = request;
  await getResponseContent(request).then((responseContent) => {
    requestWithResponseContent = {
      ...request,
      response: {
        ...request.response,
        responseContent,
      },
    };
  });
  return requestWithResponseContent;
}

const getResponseContent = (request: NetworkRequestEnhanced) =>
  new Promise((resolve) => {
    if (!request.getContent) {
      resolve({ Error: "Cannot get response." });
    }
    request.getContent((res) => {
      let responseContent = {} as any;
      try {
        responseContent = JSON.parse(res);
      } catch {
        responseContent = { Response: "not found" };
      }
      resolve(responseContent);
    });
  });
