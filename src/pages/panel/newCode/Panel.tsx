import React, { createContext, useState } from "react";
import { NetworkRequests } from "./NetworkRequests";
import { NetworkDetails } from "./NetworkDetails";
import "./Panel.scss";

export type NetworkRequest = chrome.devtools.network.Request;
export type NetworkRequestEnhanced = NetworkRequest & {
  request: {
    truncatedUrl: string;
  };
  uuid: string;
};

export const RequestContext = createContext<NetworkRequestEnhanced | null>(
  null
);

export function Panel() {
  const [selectedRequest, setSelectedRequest] =
    useState<NetworkRequestEnhanced | null>(null);
  return (
    <div>
      <RequestContext.Provider value={selectedRequest}>
        <NetworkRequests
          onRequestClick={(request) => setSelectedRequest(request)}
        />
        <NetworkDetails />
      </RequestContext.Provider>
    </div>
  );
}
