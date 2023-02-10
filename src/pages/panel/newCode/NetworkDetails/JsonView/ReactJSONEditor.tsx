import { useEffect, useRef, useState } from "react";
import {
  Content,
  JSONEditor,
  JSONEditorPropsOptional,
  JSONPath,
} from "vanilla-jsoneditor";
import * as jsonPath from "jsonpath";
import "./ReactJSONEditor.scss";

type ReactJSONEditorProps = {
  content: Content;
  isDarkModeEnabled: boolean;
  searchValue: string;
  expandAll: boolean;
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
}: ReactJSONEditorProps) {
  const refContainer = useRef(null);
  const refEditor = useRef<JSONEditor>(null);
  const [foundPaths, setFoundPaths] = useState<JSONPath[]>([]);
  const [elementsFoundCount, setElementsFoundCount] = useState<number>(0);

  function createOnClassName(searchedValue: string, foundPaths: JSONPath[]) {
    return (path: JSONPath, value: unknown) => {
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

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchValue, foundPaths),
      },
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.expand((path) => (expandAll ? true : path.length < 2));
    }
  }, [expandAll]);

  // update editor content
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.update(content);
    }
  }, [content]);

  useEffect(() => {
    hightLightSearchedValue();
  }, [searchValue, content]);

  function hightLightSearchedValue() {
    if (searchValue === "") {
      return;
    }
    try {
      const foundStringValuePaths = jsonPath
        .paths(content, `$..[?(/^${searchValue}$/i.test(@))]`)
        .map(transformPath);

      const foundOtherValuePaths = jsonPath
        .paths(content, `$..[?(@ === ${searchValue})]`)
        .map(transformPath);

      const foundValuePaths =
        foundStringValuePaths.concat(foundOtherValuePaths);

      const foundPropertyPaths = jsonPath
        .paths(content, `$..${searchValue}`)
        .map(transformPath);

      console.log("foundPaths", foundValuePaths);
      console.log("foundPropertyPaths", foundPropertyPaths);
      const foundPaths = foundValuePaths.concat(foundPropertyPaths);

      setFoundPaths(foundPaths);
      setElementsFoundCount(foundPaths.length);
      refEditor.current.expand((path) => path.length < 1);

      if (foundPaths.length) {
        foundPaths.forEach((foundPath) =>
          refEditor.current.scrollTo(foundPath)
        );
        refEditor.current.scrollTo(foundPaths[0]);
      }

      refEditor.current.updateProps({
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchValue, foundPaths),
      });
    } catch (e) {
      console.error(e);
    }

    function transformPath(path: jsonPath.PathComponent[]): string[] {
      return path.slice(2).map((element) => String(element));
    }
  }

  return (
    <>
      {elementsFoundCount > 0 && (
        <span>Found {elementsFoundCount} elements.</span>
      )}
      <div
        style={{ display: "flex", flex: 1 }}
        className={isDarkModeEnabled ? "jse-theme-dark" : ""}
        ref={refContainer}
      ></div>
    </>
  );
}
