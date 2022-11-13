import { MutableRefObject, useContext } from "react";
import { NetworkRequestEnhanced, RequestContext } from "./Panel";

type NetworkRequestsToolbarProps = {
  searchRef: MutableRefObject<HTMLInputElement>;
  filters: string[];
  isFilterXhrEnabled: boolean;
  ignoreFilters: string[];
  filteredRequests: NetworkRequestEnhanced[];
  removeFilter: (index: number) => void;
  addFilter: (value: string) => void;
  clearFilters: () => void;
  loadPreviousRequests: () => void;
  setIsFilterXhrEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NetworkRequestsToolbar({
  searchRef,
  filters,
  ignoreFilters,
  filteredRequests,
  isFilterXhrEnabled,
  clearFilters,
  removeFilter,
  addFilter,
  loadPreviousRequests,
  setIsFilterXhrEnabled,
}: NetworkRequestsToolbarProps) {
  const { isDarkModeEnabled } = useContext(RequestContext);
  return (
    <>
      <div className="d-flex flex-wrap align-items-center mt-1">
        <label htmlFor="searchInput" className="ms-2 fs-6">
          Search
        </label>
        
        <input
          className="form-control form-control-sm mx-2"
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
        {!!filters.length && (
          <span className="ms-1 me-1 fs-6">
            Filters:
          </span>
        )}
        {filters.map((searchTerm, index) => (
          <span key={searchTerm} className="d-flex align-items-center">
            {index > 0 && <span className="ms-1">&</span>}
            <span
              className="btn badge badge-sm text-bg-secondary ms-1 hover-bg-red"
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
          className={`btn btn-sm btn-${isDarkModeEnabled ? "dark" : "light"} fs-6`}
        >
          Clear
        </button>
        {(!filters.length || ignoreFilters.length === filters.length) &&
          !filteredRequests.length && (
            <button
              onClick={() => loadPreviousRequests()}
              className={`btn btn-sm btn-${
                isDarkModeEnabled ? "dark" : "light"
              } fs-6`}
            >
              Load previous data
            </button>
          )}

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="filter-xhr"
            checked={isFilterXhrEnabled}
            onChange={() => setIsFilterXhrEnabled((value) => !value)}
          />
          <label className="form-check-label fs-6" htmlFor="filter-xhr">
            Only fetch/xhr
          </label>
        </div>
      </div>
    </>
  );
}
