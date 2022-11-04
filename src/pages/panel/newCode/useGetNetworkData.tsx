import React, { useEffect, useRef, useState } from "react";
import { NetworkRequest, NetworkRequestEnhanced } from "./Panel";
import { v4 as uuidv4 } from "uuid";

export function useGetNetworkData() {
  const [requests, setRequests] = useState<NetworkRequestEnhanced[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    NetworkRequestEnhanced[]
  >([]);
  const [filters, setFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(tableRef.current);
  }, [filteredRequests]);

  useEffect(() => {
    setFilteredRequests(
      requests.filter((request) =>
        filters.every((filter) => request.request.truncatedUrl.includes(filter))
      )
    );
  }, [requests, filters]);

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

  const onRequestFinishedListener = (
    request: NetworkRequest
  ): NetworkRequestEnhanced => {
    // do not show requests to chrome extension resources
    if (request.request.url.startsWith("chrome-extension://")) {
      return;
    }
    const newRequest: NetworkRequestEnhanced = {
      ...request,
      uuid: uuidv4(),
      request: {
        ...request.request,
        truncatedUrl: request.request.url.split("/").slice(-2).join("/"),
      },
    };
    setRequests((requests) => requests.concat(newRequest));
  };

  const onNavigatedListener = (url: string) => {
    console.log("onNavigatedListener: url", url);
    setRequests([]);
    //  todo?: display a line break in the network logs to show page reloaded
  };

  function addFilter(value: string) {
    if (!filters.includes(value)) {
      setFilters((s) => s.concat(value));
    }
  }

  function removeFilter(index: number) {
    setFilters((filters) => filters.filter((_, i) => i !== index));
  }

  return {
    filteredRequests,
    addFilter,
    removeFilter,
    filters,
    tableRef,
    searchRef,
  };
}

function scrollToBottom(element: HTMLDivElement) {
  element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}
