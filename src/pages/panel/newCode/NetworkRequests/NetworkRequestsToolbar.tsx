import { MutableRefObject } from "react";
import { FiSearch, FiSlash } from "react-icons/fi";
import { ThemeIconProvider } from "../../utils/ThemeIconProvider";
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
  return (
    <>
      <div className="d-flex flex-wrap align-items-center mt-1 ms-2">
        <label htmlFor="searchInput">
          <ThemeIconProvider>
            <FiSearch />
          </ThemeIconProvider>
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
        <span
          onClick={() => clearFilters()}
          className="me-1 icon-btn"
          title="Clear"
        >
          <ThemeIconProvider>
            <FiSlash />
          </ThemeIconProvider>
        </span>

        <div className="form-check me-1">
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

        {(!filters.length || ignoreFilters.length === filters.length) &&
          !filteredRequests.length && (
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
