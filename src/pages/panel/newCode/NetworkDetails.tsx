import React, { useContext, useState } from "react";
import { RequestContext } from "./Panel";
import { ReactJSONEditor } from "./ReactJSONEditor";

export function NetworkDetails() {
  const {selectedRequest} = useContext(RequestContext);

  const [isResponseDisplayed, setIsResponseDisplayed] =
    useState<boolean>(false);

  return (
    <section>
      <label htmlFor="isReponseDisplayed">
        Switch to {isResponseDisplayed ? "Request" : "Response"}
      </label>
      <input
        type="checkbox"
        id="isResponseDisplayed"
        checked={isResponseDisplayed}
        onChange={() => setIsResponseDisplayed((value) => !value)}
      />
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
