import React, { useEffect, useState } from "react";

type NetworkRequest = chrome.devtools.network.Request;

export function useGetNetworkData() {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener(
      onRequestFinishedListener
    );

    chrome.devtools.network.onNavigated.addListener(onNavigatedListener);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(
        onRequestFinishedListener
      );
      chrome.devtools.network.onNavigated.removeListener(onNavigatedListener);
    };
  }, []);

  const onRequestFinishedListener = (request: NetworkRequest) => {
    // do not show requests to chrome extension resources
    if (request.request.url.startsWith("chrome-extension://")) {
      return;
    }
    console.log("onRequestFinishedListener: request", request);
    setRequests((requests) => requests.concat(request));
  };

  const onNavigatedListener = (url: string) => {
    console.log("onNavigatedListener: url", url);
    //   // display a line break in the network logs to show page reloaded
    //   setMasterRequests((masterRequests) =>
    //     masterRequests.concat({
    //       id: uuidv4(),
    //       separator: true,
    //       event: url,
    //     })
    //   );
    //   cleanRequests();
  };

  return { requests };
}
