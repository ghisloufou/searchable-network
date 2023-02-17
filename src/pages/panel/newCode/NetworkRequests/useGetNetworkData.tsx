import React, { useEffect, useRef, useState } from "react";
import { NetworkRequest, NetworkRequestEnhanced } from "../Panel";
import { ulid } from "ulid";

export function useGetNetworkData() {
  const [requests, setRequests] = useState<NetworkRequestEnhanced[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    NetworkRequestEnhanced[]
  >([]);
  const [isFilterXhrEnabled, setIsFilterXhrEnabled] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [isAutoScrollEnabled, setAutoScroll] = useState<boolean>(true);
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
      chrome.storage.local.get(["isFilterXhrEnabled"], (storage) => {
        const storedFilters = storage["isFilterXhrEnabled"];
        setIsFilterXhrEnabled(!!storedFilters);
      });
    } else {
      console.error("chrome.storage.local is undefined");
    }

    chrome.devtools.network.onRequestFinished.addListener(
      onRequestFinishedListener
    );

    chrome.devtools.network.onNavigated.addListener(onNavigatedListener);

    tableRef.current.addEventListener("scroll", scrollListener);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(
        onRequestFinishedListener
      );
      chrome.devtools.network.onNavigated.removeListener(onNavigatedListener);
      tableRef.current.removeEventListener("scroll", scrollListener);
    };
  }, []);

  useEffect(() => {
    if (isAutoScrollEnabled) {
      tableRef.current.scroll({
        top: tableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [filteredRequests]);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.set({ filters });
    } else {
      console.info("chrome.storage.local is undefined");
    }
    setIgnoreFilters(filters.filter((filter) => filter[0] === "-"));
  }, [filters]);

  useEffect(() => {
    if (chrome.storage) {
      chrome.storage.local.set({ isFilterXhrEnabled });
    } else {
      console.info("chrome.storage.local is undefined");
    }
  }, [isFilterXhrEnabled]);

  useEffect(() => {
    setFilteredRequests(
      requests.filter((request) => {
        const resourceType = Object.entries(request).find(
          ([key]) => key === "_resourceType"
        );

        const isXhrFiltered =
          (isFilterXhrEnabled &&
            resourceType &&
            (resourceType[1] == "xhr" || resourceType[1] == "fetch")) ||
          !isFilterXhrEnabled;

        const isRequestInFilters = filters.every((filter) => {
          if (filter[0] === "-") {
            return !request.request.truncatedUrl.includes(filter.slice(1));
          }
          return request.request.truncatedUrl.includes(filter);
        });

        return (
          !!request &&
          isRequestInFilters &&
          request.request.method !== "OPTIONS" &&
          isXhrFiltered
        );
      })
    );
  }, [requests, filters, isFilterXhrEnabled]);

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

  const scrollListener = () => {
    const element = tableRef.current;
    const isScrollNearBottomOfElement =
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) <= 5.0;
    setAutoScroll(isScrollNearBottomOfElement);
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
    setRequests((oldRequests) => {
      const index = oldRequests.findIndex(
        (oldRequest) => oldRequest.id === requestToUpdate.id
      );
      oldRequests[index] = requestToUpdate;
      return oldRequests;
    });
  }

  return {
    filteredRequests,
    addFilter,
    removeFilter,
    clearFilters,
    loadPreviousRequests,
    updateResponseContentInRequests,
    setIsFilterXhrEnabled,
    filters,
    ignoreFilters,
    tableRef,
    searchRef,
    isFilterXhrEnabled,
  };
}

function getEnhancedRequest(request: NetworkRequest): NetworkRequestEnhanced {
  let requestContent = { "Request content": "not found" };
  try {
    requestContent = JSON.parse(request.request.postData.text);
  } catch {}

  const newRequest = request as NetworkRequestEnhanced;
  newRequest.request.requestContent = requestContent;
  newRequest.request.truncatedUrl = request.request.url
    .split("/")
    .slice(-2)
    .join("/");
  newRequest.id = ulid();
  newRequest.response.type = newRequest["_resourceType"] as string;

  return newRequest;
}
