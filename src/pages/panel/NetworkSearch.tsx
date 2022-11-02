import React from "react";

type NetworkSearchProps = {
  search: string;
  setSearch: (value: string) => void;
  customSearch: (value: string) => void;
  searchTerms: string[];
  oldSearchTerms: string[];
  removeSearchTerm: (index: number) => void;
  toggleSearchType: () => void;
  andFilter: boolean;
  handleOldSearchClick: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => void;
};

export function NetworkSearch({
  search,
  setSearch,
  customSearch,
  searchTerms,
  removeSearchTerm,
  toggleSearchType,
  andFilter,
  oldSearchTerms,
  handleOldSearchClick,
}: NetworkSearchProps) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Add search term then ENTER"
        title='prefix with "-" to remove from search results'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            customSearch(search);
          }
        }}
      />
      <div className="filtering">
        <span className="label">Filtering for:</span>
        {searchTerms.map((term, index) => (
          <span>
            <span
              title="Click to remove"
              className={`searchterm ${term[0] === "-" ? "neg" : ""}`}
              onClick={() => removeSearchTerm(index)}
            >
              {term}
            </span>
            {index !== searchTerms.length && (
              <span className="operator" onClick={() => toggleSearchType()}>
                AndFilter: {andFilter ? "&" : "|"}
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="recent-searches">
        <span className="label">Recent searches:</span>
        {oldSearchTerms.map((term, index) => (
          <span
            title="Click to Search, right click to permanently remove from history"
            className={`recents ${term[0] === "-" ? "neg" : ""}`}
            onClick={(e) => handleOldSearchClick(e, index)}
            onContextMenu={(e) => handleOldSearchClick(e, index)}
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
