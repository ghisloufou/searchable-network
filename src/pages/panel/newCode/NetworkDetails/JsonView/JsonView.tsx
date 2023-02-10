import { useContext, useRef, useState } from "react";
import { RequestContext } from "../../Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";

export function JsonView() {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);
  const searchRef = useRef<HTMLInputElement>(null);

  const [isResponseDisplayed, setIsResponseDisplayed] =
    useState<boolean>(false);

  const [searchedValue, setSearchedValue] = useState<string>("");

  return (
    <section>
      <label htmlFor="searchElementInput" className="ms-2 fs-6">
        Search element
      </label>
      <input
        className="form-control form-control-sm mx-2"
        id="searchElementInput"
        ref={searchRef}
        type="text"
        placeholder={`Search in the ${
          isResponseDisplayed ? "response" : "request"
        }`}
        onKeyUp={(e) => {
          if (e.key === "Enter" && searchRef.current.value !== "") {
            setSearchedValue(searchRef.current.value);
            searchRef.current.value = "";
          }
        }}
      />

      <div>Searched value: {searchedValue}</div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link text-white ${
              isResponseDisplayed ? "" : "active"
            }`}
            onClick={() => setIsResponseDisplayed(false)}
          >
            Request content
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link text-white ${
              isResponseDisplayed ? "active" : ""
            }`}
            onClick={() => setIsResponseDisplayed(true)}
          >
            Response content
          </button>
        </li>
      </ul>

      <ReactJSONEditor
        content={{
          json: (isResponseDisplayed
            ? selectedRequest?.response?.responseContent
            : selectedRequest?.request?.requestContent) ?? {
            Error: "content not found",
          },
        }}
        isDarkModeEnabled={isDarkModeEnabled}
        searchedValue={searchedValue}
      />
    </section>
  );
}
