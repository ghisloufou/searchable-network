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
  searchedValue: string;
};

const defaultJsonEditorProps: JSONEditorPropsOptional = {
  readOnly: true,
  indentation: 2,
  mainMenuBar: false,
};

export function ReactJSONEditor({
  content,
  isDarkModeEnabled,
  searchedValue,
}: ReactJSONEditorProps) {
  const refContainer = useRef(null);
  const refEditor = useRef<JSONEditor>(null);
  const [foundPaths, setFoundPaths] = useState<JSONPath[]>([]);

  function createOnClassName(searchedValue: string, foundPaths: JSONPath[]) {
    return (path: JSONPath, value: unknown) => {
      if (value === searchedValue) {
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

  function onCollapseAll() {
    refEditor.current.expand(() => false);
  }

  function onExpandAll() {
    refEditor.current.expand(() => true);
  }

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchedValue, foundPaths),
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

  // update editor content
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.update(content);
    }
  }, [content]);

  useEffect(() => {
    hightLightSearchedValue();
  }, [searchedValue]);

  function hightLightSearchedValue() {
    if (searchedValue === "") {
      return;
    }
    try {
      const foundStringValuePaths = jsonPath
        .paths(content, `$..[?(@ === "${searchedValue}")]`)
        .map(transformPath);
      const foundOtherValuePaths = jsonPath
        .paths(content, `$..[?(@ === ${searchedValue})]`)
        .map(transformPath);

      const foundValuePaths =
        foundStringValuePaths.concat(foundOtherValuePaths);

      const foundPropertyPaths = jsonPath
        .paths(content, `$..${searchedValue}`)
        .map(transformPath);

      console.log("foundPaths", foundValuePaths);
      console.log("foundPropertyPaths", foundPropertyPaths);
      const foundPaths = foundValuePaths.concat(foundPropertyPaths);

      setFoundPaths(foundPaths);
      refEditor.current.expand((path) => path.length < 2);

      if (foundPaths.length) {
        foundPaths.forEach((foundPath) =>
          refEditor.current.scrollTo(foundPath)
        );
        refEditor.current.scrollTo(foundPaths[0]);
      }

      refEditor.current.updateProps({
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchedValue, foundPaths),
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
      <button onClick={onExpandAll}>Expand all</button>
      <button onClick={onCollapseAll}>Collapse all</button>
      <div
        style={{ display: "flex", flex: 1 }}
        className={isDarkModeEnabled ? "jse-theme-dark" : ""}
        ref={refContainer}
      ></div>
    </>
  );
}
