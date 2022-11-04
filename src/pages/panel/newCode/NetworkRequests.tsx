import { useContext } from "react";
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
    searchRef,
    tableRef,
    addFilter,
    removeFilter,
    clearFilters,
  } = useGetNetworkData();

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center">
        <button onClick={() => clearFilters()} className="btn">
          Clear
        </button>
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
                key={
                  String(index) + request.request.url + request.startedDateTime
                }
                onClick={() => onRequestClick(request)}
                className={`clickable ${
                  selectedRequest?.uuid === request.uuid ? "selected" : ""
                }`}
              >
                <td scope="row">{index}</td>
                <td title={request.request.url}>
                  {request.request.truncatedUrl}
                </td>
                <td>{request.response.status}</td>
                <td>{request.request.method}</td>
                <td>{request.time.toPrecision(2)} ms</td>
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
