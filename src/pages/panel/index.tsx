import "@pages/panel/index.scss";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { Panel } from "./newCode/Panel";

refreshOnUpdate("pages/panel");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }

  const root = createRoot(appContainer);
  root.render(<Panel />);
}

init();
