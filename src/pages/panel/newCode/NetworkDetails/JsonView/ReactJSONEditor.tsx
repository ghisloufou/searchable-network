import * as jsonPath from "jsonpath";
import { useEffect, useRef, useState } from "react";
import {
  Content,
  JSONEditor,
  JSONEditorPropsOptional,
  JSONPath,
  OnRenderValue,
  renderValue,
} from "vanilla-jsoneditor";
import "./ReactJSONEditor.scss";

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
  const refEditor = useRef<JSONEditor>(null);
  const [foundPaths, setFoundPaths] = useState<JSONPath[]>([]);
  const [elementsFoundCount, setElementsFoundCount] = useState<number>(0);

  const onRenderValue: OnRenderValue = (props) => {
    if (
      props.isSelected &&
      (typeof props.value === "string" ||
        typeof props.value === "number" ||
        typeof props.value === "boolean")
    ) {
      const selectedElement =
        props.selection.type === "value"
          ? String(props.value)
          : props.path[props.path.length - 1];
      setSelectedElement(selectedElement);
    }
    return renderValue(props);
  };

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        ...defaultJsonEditorProps,
        onClassName: createOnClassName(searchValue, foundPaths),
        onRenderValue,
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
      refEditor.current.update(content);
      refEditor.current.updateProps({
        onChange: () => {
          highlightSearchedValue();
        },
        onRenderValue,
      });
    }
  }, [content]);

  useEffect(() => {
    if (refEditor.current && expandAll !== null) {
      refEditor.current.expand((path) => (expandAll ? true : path.length < 1));
    }
  }, [expandAll]);

  useEffect(() => {
    highlightSearchedValue();
  }, [searchValue]);

  function highlightSearchedValue() {
    try {
      const foundStringValuePaths =
        searchValue !== ""
          ? jsonPath.paths(content, `$..[?(/^${searchValue}$/i.test(@))]`)
          : [];

      const foundOtherValuePaths =
        searchValue !== ""
          ? jsonPath.paths(content, `$..[?(@ === ${searchValue})]`)
          : [];

      const foundPropertyPaths =
        searchValue !== "" ? jsonPath.paths(content, `$..${searchValue}`) : [];

      const rawFoundPaths = foundStringValuePaths.concat(
        foundOtherValuePaths,
        foundPropertyPaths,
      );
      const foundPaths = rawFoundPaths.map(transformPath);

      setFoundPaths(foundPaths);
      setElementsFoundCount(foundPaths.length);

      refEditor.current.expand((path) => path.length < 1);

      if (foundPaths.length) {
        foundPaths.forEach((foundPath, index) => {
          const rawPath = rawFoundPaths[index];

          const rawChildPaths = jsonPath.paths(
            content,
            jsonPath.stringify(rawPath) + ".*",
          );
          const childPaths = rawChildPaths.map(transformPath);

          if (childPaths.length) {
            childPaths.forEach((childPath, childIndex) => {
              const rawChildPath = rawChildPaths[childIndex];
              if (typeof rawChildPath[rawChildPath.length - 1] === "number") {
                const grandChildPaths = jsonPath
                  .paths(content, jsonPath.stringify(rawChildPath) + ".*")
                  .map(transformPath);

                if (grandChildPaths.length) {
                  grandChildPaths.forEach((grandChildPath) => {
                    refEditor.current.scrollTo(grandChildPath);
                  });
                }
              } else {
                refEditor.current.scrollTo(childPath);
              }
            });
          } else {
            refEditor.current.scrollTo(foundPath);
          }
        });

        refEditor.current.scrollTo(foundPaths[0]);
      }

      refEditor.current.updateProps({
        onClassName: createOnClassName(searchValue, foundPaths),
        onRenderValue,
      });
    } catch (e) {
      console.error("An error ocurred while searching in the json", e);
    }
  }

  return (
    <>
      {elementsFoundCount > 0 && <span>{elementsFoundCount} result(s)</span>}
      <div
        style={{ display: "flex", flex: 1 }}
        className={isDarkModeEnabled ? "jse-theme-dark" : ""}
        ref={refContainer}
      ></div>
    </>
  );
}

function createOnClassName(searchedValue: string, foundPaths: JSONPath[]) {
  return (path: JSONPath, value: unknown) => {
    if (searchedValue === "") {
      return;
    }
    if (String(value) === searchedValue) {
      return "green-background";
    }
    if (
      foundPaths.some(
        (foundPath) => JSON.stringify(path) === JSON.stringify(foundPath),
      )
    ) {
      return "red-background";
    }
  };
}

function transformPath(path: jsonPath.PathComponent[]): string[] {
  return path.slice(2).map((element) => String(element));
}
