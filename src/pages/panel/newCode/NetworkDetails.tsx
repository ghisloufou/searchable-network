import React, { useContext, useState } from "react";
import { RequestContext } from "./Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

export function NetworkDetails() {
  const { selectedRequest, isDarkModeEnabled } = useContext(RequestContext);

  const [isResponseDisplayed, setIsResponseDisplayed] =
    useState<boolean>(false);
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);

  const newStyles = {
    variables: {
      dark: {
        highlightBackground: "#fefed5",
        highlightGutterBackground: "#ffcd3c",
      },
    },
    line: {
      padding: "10px 2px",
      "&:hover": {
        background: "#a26ea1",
      },
    },
  };

  if (!selectedRequest) {
    return null;
  }

  return (
    <section>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link text-white ${
              isComparisonMode ? "" : "active"
            }`}
            onClick={() => setIsComparisonMode(false)}
          >
            View mode
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white ${
              isComparisonMode ? "active" : ""
            }`}
            onClick={() => setIsComparisonMode(true)}
          >
            Compare mode
          </button>
        </li>
      </ul>

      {isComparisonMode ? (
        <ReactDiffViewer
          oldValue={selectedRequest?.request?.requestContent}
          newValue={selectedRequest?.response?.responseContent}
          splitView={true}
          useDarkTheme={isDarkModeEnabled}
          compareMethod={DiffMethod.JSON}
          leftTitle="Request content"
          rightTitle="Response content"
          styles={newStyles}
          disableWordDiff={true}
        />
      ) : (
        <>
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
          />
        </>
      )}
    </section>
  );
}
