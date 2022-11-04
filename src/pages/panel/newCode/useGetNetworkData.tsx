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
    if (chrome.storage) {
      chrome.storage.local.get(["filters"], (storage) => {
        const storedFilters = storage["filters"];
        if (storedFilters) {
          setFilters(storedFilters);
        }
      });
    } else {
      console.error("chrome.storage.local is undefined");
    }

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

  useEffect(() => {
    scrollToBottom(tableRef.current);
  }, [filteredRequests]);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.set({ filters });
    } else {
      console.error("chrome.storage.local is undefined");
    }
  }, [filters]);

  useEffect(() => {
    setFilteredRequests(
      requests.filter(
        (request) =>
          filters.every((filter) => {
            if (filter[0] === "-") {
              return !request.request.truncatedUrl.includes(filter.slice(1));
            }
            return request.request.truncatedUrl.includes(filter);
          }) && request.request.method !== "OPTIONS"
      )
    );
  }, [requests, filters]);

  const onRequestFinishedListener = (request: NetworkRequest) => {
    // do not show requests to chrome extension resources
    const newRequest = getEnhancedRequest(request);

    setRequests((requests) => {
      return requests.concat(newRequest);
    });
  };

  const onNavigatedListener = (url: string) => {
    console.log("onNavigatedListener: url", url);
    // setRequests([]);
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

  function clearFilters() {
    setRequests([]);
  }

  function loadPreviousRequests() {
    chrome.devtools.network.getHAR((harLog) => {
      setRequests((requests) => {
        if (!requests.length) {
          return harLog.entries.map(getEnhancedRequest);
        }
        return requests;
      });
    });
  }

  function updateResponseContent(requestToUpdate: NetworkRequestEnhanced) {
    setRequests((requests) =>
      requests.map((request) => {
        if (request.uuid === requestToUpdate.uuid) {
          request.response.responseContent =
            requestToUpdate.response.responseContent;
        }
        return request;
      })
    );
  }

  return {
    filteredRequests,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContent,
    filters,
    tableRef,
    searchRef,
  };
}

function scrollToBottom(element: HTMLDivElement) {
  element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}

function getEnhancedRequest(request: NetworkRequest): NetworkRequestEnhanced {
  if (request.request.url.startsWith("chrome-extension://")) {
    return;
  }
  let requestContent = { no: "request found" };
  try {
    requestContent = JSON.parse(request.request.postData.text);
  } catch {}

  const newRequest = request as NetworkRequestEnhanced;

  newRequest.request.requestContent = requestContent;
  newRequest.request.truncatedUrl = request.request.url
    .split("/")
    .slice(-2)
    .join("/");
  newRequest.uuid = uuidv4();

  return newRequest;
}
