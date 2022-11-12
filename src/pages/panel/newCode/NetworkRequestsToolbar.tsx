import { MutableRefObject, useContext } from "react";
import { NetworkRequestEnhanced, RequestContext } from "./Panel";

type NetworkRequestsToolbarProps = {
  searchRef: MutableRefObject<HTMLInputElement>;
  filters: string[];
  ignoreFilters: string[];
  filteredRequests: NetworkRequestEnhanced[];
  removeFilter: (index: number) => void;
  addFilter: (value: string) => void;
  clearFilters: () => void;
  loadPreviousRequests: () => void;
};

export function NetworkRequestsToolbar({
  searchRef,
  filters,
  ignoreFilters,
  filteredRequests,
  clearFilters,
  removeFilter,
  addFilter,
  loadPreviousRequests,
}: NetworkRequestsToolbarProps) {
  const { isDarkModeEnabled } = useContext(RequestContext);
  return (
    <>
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
    </>
  );
}
