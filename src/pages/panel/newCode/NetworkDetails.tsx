import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "./Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";
import { getDiff } from "json-difference";

export function NetworkDetails() {
  const { selectedRequest } = useContext(RequestContext);

  useEffect(() => {
    // Get JsonDiff delta
    if (
      selectedRequest?.request?.requestContent &&
      selectedRequest?.response?.responseContent
    ) {
      const diff = getDiff(
        selectedRequest.request.requestContent,
        selectedRequest.response.responseContent,
        true
      );

      console.log("diff", diff);
    }
  }, [selectedRequest]);

  const [isResponseDisplayed, setIsResponseDisplayed] =
    useState<boolean>(false);

  return (
    <section>
      {selectedRequest && (
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
      )}
      <ReactJSONEditor
        content={{
          json: (isResponseDisplayed
            ? selectedRequest?.response?.responseContent
            : selectedRequest?.request?.requestContent) ?? {
            Please: "Select a query to watch it's content",
          },
        }}
      />
    </section>
  );
}
