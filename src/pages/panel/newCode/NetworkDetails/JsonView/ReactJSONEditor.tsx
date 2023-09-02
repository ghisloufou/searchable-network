import * as jsonPath from "jsonpath";
import { useEffect, useRef, useState } from "react";
import {
  Content,
  JSONEditor,
  JSONEditorPropsOptional,
  JSONEditorSelection,
  SelectionType,
} from "vanilla-jsoneditor";
import "./ReactJSONEditor.scss";
import {
  PathSearchInput,
  PathSearchResponse,
  SERVICE_WORKER_PORT_NAME,
} from "@src/serviceWorker";

type ReactJSONEditorProps = {
  content: Content;
  isDarkModeEnabled: boolean;
  searchValue: string;
  expandAll: boolean | null;
  setSelectedElement: (element: string) => void;
};

const defaultJsonEditorProps: JSONEditorPropsOptional = {
  readOnly: true,
  indentation: 2,
  mainMenuBar: false,
};

export function ReactJSONEditor({
  content,
  isDarkModeEnabled,
  searchValue,
  expandAll,
  setSelectedElement,
}: ReactJSONEditorProps) {
  const refContainer = useRef(null);
  const serviceWorker = useRef<chrome.runtime.Port | null>(null);
  const refEditor = useRef<JSONEditor>(null);
  const [foundPaths, setFoundPaths] = useState<jsonPath.PathComponent[][]>([]);
  const [elementsFoundCount, setElementsFoundCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const onSelect = (selection: JSONEditorSelection) => {
    switch (selection.type) {
      case SelectionType.key:
        setSelectedElement(String(selection.path[selection.path.length - 1]));
        break;
      case SelectionType.value:
        try {
          const value = jsonPath.value(
            content,
            `$..${selection.path.map((entry) => `['${entry}']`).join("")}`
          );

          setSelectedElement(typeof value === "object" ? "" : String(value));
        } catch (error) {
          console.warn(error);
          setSelectedElement("");
        }
        break;
    }
  };

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchValue, foundPaths),
        onSelect,
      },
    });
    const port = chrome.runtime.connect({ name: SERVICE_WORKER_PORT_NAME });
    serviceWorker.current = port;

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
      serviceWorker.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.update(content);
      refEditor.current.updateProps({
        onChange: () => {
          highlightSearchedValue();
        },
        onSelect,
      } as JSONEditorPropsOptional);
    }
  }, [content]);

  useEffect(() => {
    if (refEditor.current && expandAll !== null) {
      refEditor.current.expand((path) => (expandAll ? true : path.length < 1));
    }
  }, [expandAll]);

  useEffect(() => {
    setIsLoadingSearch(true);
    refEditor.current.expand((path) => path.length < 1);
    highlightSearchedValue();
  }, [searchValue]);

  function highlightSearchedValue() {
    const searchInput: PathSearchInput = {
      searchValue,
      content,
    };
    console.log("Sending message:", searchInput);
    serviceWorker.current.postMessage(searchInput);

    const messageListener = (response: PathSearchResponse) => {
      console.log(
        "🚀 ~ file: ReactJSONEditor.tsx:121 ~ highlightSearchedValue ~ response:",
        response
      );
      if (response) {
        const { pathsFound, pathsToOpen } = response;
        setIsLoadingSearch(false);

        refEditor.current.updateProps({
          onClassName: createOnClassName(searchValue, pathsFound),
          onSelect,
        } as JSONEditorPropsOptional);

        setFoundPaths(pathsFound);
        setElementsFoundCount(pathsFound.length);
        pathsToOpen.forEach((path) => {
          refEditor.current.scrollTo(path);
        });
      } else {
        console.error(
          "An error has occured while communicating with the service worker"
        );
      }
      serviceWorker.current.onMessage.removeListener(messageListener);
    };

    serviceWorker.current.onMessage.addListener(messageListener);
  }

  return (
    <>
      {elementsFoundCount > 0 && !isLoadingSearch && (
        <span className="ms-2 mb-1">
          {elementsFoundCount} result{elementsFoundCount > 1 && "(s)"}
        </span>
      )}
      {isLoadingSearch && (
        <div className="d-flex align-items-center gap-1 ms-2">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading search results...
        </div>
      )}
      <div
        className={`${isDarkModeEnabled ? "jse-theme-dark" : ""} ${
          isLoadingSearch ? "loading-json-editor" : ""
        } d-flex flex-fill`}
        ref={refContainer}
      ></div>
    </>
  );
}

function createOnClassName(
  searchedValue: string,
  foundPaths: jsonpath.PathComponent[][]
) {
  return (path: string[], value: unknown) => {
    if (searchedValue === "") {
      return;
    }
    if (String(value) === searchedValue) {
      return "green-background";
    }
    if (
      foundPaths.some(
        (foundPath) => JSON.stringify(path) === JSON.stringify(foundPath)
      )
    ) {
      return "red-background";
    }
  };
}
