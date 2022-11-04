import React, { useContext } from "react";
import { RequestContext } from "./Panel";

export function NetworkDetails() {
  const selectedRequest = useContext(RequestContext);
  /* json editor */
  return <section>{selectedRequest?.request.truncatedUrl}</section>;
}
