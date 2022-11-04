import { Content, JSONEditor } from "vanilla-jsoneditor";
import { useContext, useEffect, useRef } from "react";
import { RequestContext } from "./Panel";

type ReactJSONEditorProps = {
  content: Content;
};

export function ReactJSONEditor({ content }: ReactJSONEditorProps) {
  const { isDarkModeEnabled } = useContext(RequestContext);
  const refContainer = useRef(null);
  const refEditor = useRef<JSONEditor>(null);

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {
        readOnly: true,
      },
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update editor content
  useEffect(() => {
    if (refEditor.current) {
      console.log("update content", content);
      refEditor.current.update(content);
      console.log("refEditor.current", refEditor.current);
    }
  }, [content]);

  return (
    <div
      style={{ display: "flex", flex: 1 }}
      className={isDarkModeEnabled && "jse-theme-dark"}
      ref={refContainer}
    ></div>
  );
}
