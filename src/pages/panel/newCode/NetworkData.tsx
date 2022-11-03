import React, { useEffect, useRef, useState } from "react";
import { useGetNetworkData } from "./useGetNetworkData";

type NetworkDataProps = {};

export function NetworkData({}: NetworkDataProps) {
  const { requests } = useGetNetworkData();
  const [filters, setFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(tableRef.current);
  }, [requests]);

  function addFilter(value: string) {
    if (!filters.includes(value)) {
      setFilters((s) => s.concat(value));
    }
  }

  function removeFilter(index: number) {
    setFilters((filters) => filters.filter((_, i) => i !== index));
  }

  return (
    <section>
      <div>
        <label>
          Search
          <input
            className="form-control form-control-sm mx-2"
            ref={searchRef}
            type="text"
            placeholder="Add search term then press Enter"
            onKeyUp={(e) => {
              if (e.key === "Enter" && searchRef.current.value !== "") {
                addFilter(searchRef.current.value);
                searchRef.current.value = "";
              }
            }}
          />
        </label>
        <span>Filters:</span>
        {filters.map((searchTerm, index) => (
          <>
            {index > 0 && "&"}
            <span
              className="btn badge text-bg-secondary ml-2"
              onClick={(e) => {
                removeFilter(index);
                e.stopPropagation();
              }}
            >
              {searchTerm}
            </span>
          </>
        ))}
      </div>

      <div
        ref={tableRef}
        style={{ maxHeight: "400px" }}
        className="overflow-auto"
      >
        <table className="table table-dark table-striped table-sm">
          <thead>
            <tr
              className="sticky-top"
              style={{ boxShadow: "inset 0px -1px 0 0" }}
            >
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Method</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => {
              const date = new Date(request.time);
              return (
                <tr>
                  <td scope="row">{index}</td>
                  <td title={request.request.url}>
                    {request.request.url.split("/").slice(-2).join("/")}
                  </td>
                  <td>{request.response.status}</td>
                  <td>{request.request.method}</td>
                  <td>{request.time.toPrecision(2)} ms</td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td scope="row"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function scrollToBottom(element: HTMLDivElement) {
  element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}
