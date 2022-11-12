import React, { useEffect, useRef, useState } from "react";
import { NetworkRequest, NetworkRequestEnhanced } from "./Panel";
import { v4 as uuidv4 } from "uuid";

export function useGetNetworkData() {
  const [requests, setRequests] = useState<NetworkRequestEnhanced[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    NetworkRequestEnhanced[]
  >([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [ignoreFilters, setIgnoreFilters] = useState<string[]>([]);
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

  // useEffect(() => {
  //   console.log("tableRef.current.scrollHeight", tableRef.current.scrollHeight);
  //   scrollToBottom(tableRef.current);
  // }, [filteredRequests]);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.set({ filters });
    } else {
      console.error("chrome.storage.local is undefined");
    }
    setIgnoreFilters(filters.filter((filter) => filter[0] === "-"));
  }, [filters]);

  useEffect(() => {
    setFilteredRequests(
      requests.filter(
        (request) =>
          !!request &&
          filters.every((filter) => {
            if (filter[0] === "-") {
              return !request.request.truncatedUrl.includes(filter.slice(1));
            }
            return request.request.truncatedUrl.includes(filter);
          }) &&
          request.request.method !== "OPTIONS"
      )
    );
  }, [requests, filters]);

  const onRequestFinishedListener = (request: NetworkRequest) => {
    if (!request) {
      console.error("Error with this request:", request);
      return;
    }

    if (request.request.url.startsWith("chrome-extension://")) {
      return;
    }

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
      if (harLog.entries.some((e) => e === undefined)) {
        console.warn("Some previous entries are undefined");
      }
      setRequests(
        harLog.entries
          .slice(-200)
          .filter(
            (entry) =>
              !!entry && !entry.request.url.startsWith("chrome-extension://")
          )
          .map((entry) => {
            const res = getEnhancedRequest(entry as NetworkRequest);
            if (!res) {
              return null;
            }
            return res;
          })
          .filter((res) => !!res)
      );
    });
  }

  function updateResponseContentInRequests(
    requestToUpdate: NetworkRequestEnhanced
  ) {
    setRequests((requests) => {
      const index = requests.findIndex(
        (rq) => rq.uuid === requestToUpdate.uuid
      );
      requests[index] = requestToUpdate;
      return requests;
    });
  }

  return {
    filteredRequests,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContentInRequests,
    filters,
    ignoreFilters,
    tableRef,
    searchRef,
  };
}

function scrollToBottom(element: HTMLDivElement) {
  element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}

function getEnhancedRequest(request: NetworkRequest): NetworkRequestEnhanced {
  let requestContent = { Request: "not found" };
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
  newRequest.response.type =
    Object.entries(newRequest).find(([key]) => key === "_resourceType")[1] ??
    "n/a";

  return newRequest;
}
