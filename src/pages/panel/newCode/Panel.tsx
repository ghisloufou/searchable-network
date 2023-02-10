import React, { createContext, useEffect, useState } from "react";
import { NetworkRequests } from "./NetworkRequests/NetworkRequests";
import { NetworkDetails } from "./NetworkDetails/NetworkDetails";
import "./Panel.scss";
import { ErrorBoundary } from "./ErrorBoundary";

export type NetworkRequest = chrome.devtools.network.Request;
export type NetworkRequestEnhanced = NetworkRequest & {
  request: {
    truncatedUrl: string;
    requestContent: any;
  };
  id: string;
  response: {
    responseContent?: any;
    type?: string;
  };
};

export const RequestContext = createContext<{
  selectedRequest?: NetworkRequestEnhanced;
  isDarkModeEnabled: boolean;
}>({
  isDarkModeEnabled: false,
});
const darkThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

export function Panel() {
  const [selectedRequest, setSelectedRequest] =
    useState<NetworkRequestEnhanced | null>(null);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(true);

  const darkThemeEventListener = (event) => {
    setIsDarkModeEnabled(event.matches);
  };

  useEffect(() => {
    darkThemeMedia.addEventListener("change", darkThemeEventListener);

    return () => {
      darkThemeMedia.removeEventListener("change", darkThemeEventListener);
    };
  }, []);

  return (
    <div>
      <RequestContext.Provider value={{ selectedRequest, isDarkModeEnabled }}>
        <ErrorBoundary selectedRequest={selectedRequest}>
          <NetworkRequests
            onRequestClick={(request) => setSelectedRequest(request)}
          />
          <NetworkDetails />
        </ErrorBoundary>
      </RequestContext.Provider>
    </div>
  );
}
