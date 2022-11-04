import React, { useContext, useState } from "react";
import { RequestContext } from "./Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";

export function NetworkDetails() {
  const { selectedRequest } = useContext(RequestContext);

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
              Request
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${
                isResponseDisplayed ? "active" : ""
              }`}
              onClick={() => setIsResponseDisplayed(true)}
            >
              Response
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
