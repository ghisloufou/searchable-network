import { createContext, useEffect, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { NetworkDetails } from "./NetworkDetails/NetworkDetails";
import { NetworkRequests } from "./NetworkRequests/NetworkRequests";
import "./Panel.scss";

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

  const darkThemeEventListener = (event: MediaQueryListEvent) => {
    // setIsDarkModeEnabled(event.matches); // DISABLED while light mode isn't implemented
  };

  useEffect(() => {
    darkThemeMedia.addEventListener("change", darkThemeEventListener);

    return () => {
      darkThemeMedia.removeEventListener("change", darkThemeEventListener);
    };
  }, []);

  return (
    <div>
      {/* DISABLED while light mode isn't implemented */}
      {/* <button
        className="btn btn-sm"
        onClick={() => setIsDarkModeEnabled((value) => !value)}
        style={{ position: "absolute", top: "0", right: "0" }}
        title={`Switch to ${isDarkModeEnabled ? "light" : "dark"} mode`}
      >
        {isDarkModeEnabled ? <FiSun /> : <FiMoon />}
      </button> */}
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
