import { ThemeIconProvider } from "@src/pages/panel/utils/ThemeIconProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { MdOutlineCompress, MdOutlineExpand } from "react-icons/md";
import { RequestContext } from "../../Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";

const HISTORY_MAX_LENGTH = 12;

export function JsonView() {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);
  const searchRef = useRef<HTMLInputElement>(null);

  const [isResponseDisplayed, setIsResponseDisplayed] =
    useState<boolean>(false);

  const [searchedValue, setSearchedValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const [selectedElement, setSelectedElement] = useState<string>("");

  function addSearchTerm(searchTerm: string) {
    setSearchedValue(searchTerm);
    setSearchHistory((oldHistory) =>
      [searchTerm].concat(
        oldHistory.filter(
          (oldSearchTerm, index) =>
            oldSearchTerm !== searchTerm && index <= HISTORY_MAX_LENGTH
        )
      )
    );
  }

  function removeSearchTerm(searchTerm: string) {
    setSearchHistory((oldHistory) =>
      oldHistory.filter((oldSearchTerm) => oldSearchTerm !== searchTerm)
    );
  }

  function clearSearchTerm() {
    addSearchTerm("");
  }

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.get(["searchHistory"], (storage) => {
        const storedHistory = storage["searchHistory"];
        if (storedHistory) {
          setSearchHistory(storedHistory);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.set({ searchHistory });
    }
  }, [searchHistory]);

  useEffect(() => {
    setExpandAll(null);
  }, [isResponseDisplayed, searchedValue]);

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center my-1 ms-2">
        <label htmlFor="searchElementInput">
          <ThemeIconProvider>
            <FiSearch />
          </ThemeIconProvider>
        </label>
        <input
          className="form-control form-control-sm mx-2"
          id="searchElementInput"
          style={{ width: "fit-content" }}
          ref={searchRef}
          type="text"
          placeholder={`Search in the ${
            isResponseDisplayed ? "response" : "request"
          }`}
          onKeyUp={(e) => {
            if (e.key === "Enter" && searchRef.current.value !== "") {
              addSearchTerm(searchRef.current.value);
              searchRef.current.value = "";
            }
          }}
        />
        {searchedValue !== "" && (
          <span className="ms-1 me-1">
            Current:{" "}
            <span
              className="btn badge badge-sm text-bg-primary ms-1 hover-bg-red fw-normal"
              title="Click to clear, Mousewheel click to delete"
              onClick={() => clearSearchTerm()}
              onMouseDown={(event) => {
                // On mouse middle click
                if (event.button === 1) {
                  removeSearchTerm(searchedValue);
                  clearSearchTerm();
                  event.stopPropagation();
                }
              }}
            >
              {searchedValue}
            </span>
          </span>
        )}
        {searchHistory.length > 1 && (
          <span className="ms-1 me-1">History:</span>
        )}
        {searchHistory
          .filter((_, index) => (searchedValue !== "" ? index > 0 : true))
          .map((searchTerm) => (
            <span key={searchTerm} className="d-flex align-items-center">
              <span
                className="btn badge badge-sm text-bg-secondary ms-1 hover-bg-primary fw-normal"
                onClick={(event) => {
                  addSearchTerm(searchTerm);
                  event.stopPropagation();
                }}
                onMouseDown={(event) => {
                  // On mouse middle click
                  if (event.button === 1) {
                    removeSearchTerm(searchTerm);
                    event.stopPropagation();
                  }
                }}
                title="Click to search, Mousewheel click to delete"
              >
                {searchTerm}
              </span>
            </span>
          ))}
      </div>

      <section className="mb-1 ms-1">
        <div
          className="btn-group me-1"
          role="group"
          aria-label="Json viewer body selector"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            checked={!isResponseDisplayed}
            onClick={() => setIsResponseDisplayed(false)}
          />
          <label
            className="btn btn-outline-secondary btn-sm"
            htmlFor="btnradio1"
          >
            Request
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            checked={isResponseDisplayed}
            onClick={() => setIsResponseDisplayed(true)}
          />
          <label
            className="btn btn-outline-secondary btn-sm"
            htmlFor="btnradio2"
          >
            Response
          </label>
        </div>

        <button
          onClick={() => setExpandAll(false)}
          className="btn btn-secondary btn-sm me-1 icon-btn"
          title="Collapse all"
        >
          <MdOutlineCompress />
        </button>
        <button
          onClick={() => setExpandAll(true)}
          className="btn btn-secondary btn-sm me-1 icon-btn"
          title="Expand all"
        >
          <MdOutlineExpand />
        </button>
        {selectedElement !== "" && (
          <span>
            Selected:
            <div
              className="input-group ms-2"
              style={{ display: "inline-flex", maxWidth: "250px" }}
            >
              <input
                type="text"
                readOnly
                className="form-control form-control-sm"
                value={selectedElement}
                aria-label={selectedElement}
                aria-describedby="basic-addon2"
                style={{ textOverflow: "ellipsis" }}
              />
              <button
                className="input-group-text btn btn btn-sm btn-secondary icon-btn"
                id="basic-addon2"
                onClick={() => addSearchTerm(selectedElement)}
                title="Click to search for the selected element"
              >
                <ThemeIconProvider>
                  <FiPlus />
                </ThemeIconProvider>
              </button>
            </div>
          </span>
        )}
      </section>

      <ReactJSONEditor
        content={{
          json: (isResponseDisplayed
            ? selectedRequest?.response?.responseContent
            : selectedRequest?.request?.requestContent) ?? {
            Error: "content not found",
          },
        }}
        isDarkModeEnabled={isDarkModeEnabled}
        searchValue={searchedValue}
        expandAll={expandAll}
        setSelectedElement={setSelectedElement}
      />
    </section>
  );
}
