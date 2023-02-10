import { MutableRefObject } from "react";
import { NetworkRequestEnhanced } from "../Panel";

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
  const isLoadPreviousDataButtonDisplayed =
    (!filters.length || ignoreFilters.length === filters.length) &&
    !filteredRequests.length;

  return (
    <>
      <div className="d-flex flex-wrap align-items-center mt-1 ms-2">
        <label htmlFor="searchInput">Search</label>

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
        {!!filters.length && <span className="ms-1 me-1">Filters:</span>}
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

      <div className="d-flex flex-wrap align-items-center my-1 ms-1">
        <button
          onClick={() => clearFilters()}
          className="btn btn-sm btn-secondary me-1"
        >
          Clear
        </button>

        <div className="form-check form-switch me-1">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="filter-xhr"
            checked={isFilterXhrEnabled}
            onChange={() => setIsFilterXhrEnabled((value) => !value)}
          />
          <label className="form-check-label" htmlFor="filter-xhr">
            Only fetch/xhr
          </label>
        </div>

        {isLoadPreviousDataButtonDisplayed && (
          <button
            onClick={() => loadPreviousRequests()}
            className="btn btn-sm btn-secondary"
          >
            Load previous data
          </button>
        )}
      </div>
    </>
  );
}
