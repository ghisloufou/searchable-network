import { Content, JSONEditor } from "vanilla-jsoneditor";
import { useContext, useEffect, useRef, useState } from "react";
import { RequestContext } from "./Panel";
import ReactJson from "react-json-view";

type ReactJSONEditorProps = {
  content: Content;
};

export function ReactJSONEditor({ content }: ReactJSONEditorProps) {
  const { isDarkModeEnabled } = useContext(RequestContext);
  const refContainer = useRef(null);
  const refEditor = useRef<JSONEditor>(null);
  const jsonSearchRef = useRef<HTMLInputElement>(null);
  const [jsonSearchTerm, setJsonSearchTerm] = useState("");

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        readOnly: true,
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

  return (
    <>
      <input
        type="text"
        ref={jsonSearchRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setJsonSearchTerm(jsonSearchRef.current.value);
          }
        }}
      />
      <div
        style={{ display: "flex", flex: 1 }}
        className={isDarkModeEnabled && "jse-theme-dark"}
        ref={refContainer}
      ></div>
      <ReactJson
        src={content}
        theme={isDarkModeEnabled ? "monokai" : "rjv-default"}
        shouldCollapse={(field) =>
          jsonSearchTerm && !field.name.includes(jsonSearchTerm)
        }
        enableClipboard={false}
        displayDataTypes={false}
        displayObjectSize={false}
      />
    </>
  );
}
