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
    <div
      style={{ display: "flex", flex: 1 }}
      className={isDarkModeEnabled && "jse-theme-dark"}
      ref={refContainer}
    ></div>
  );
}
