try {
  chrome.devtools.panels.create(
    "Second better network panel",
    "icon-34.png",
    "src/pages/panel/index.html",
    (panel) => {
      console.log("panel test");
      panel.onShown.addListener(() => console.log("panel opened"));
    }
  );
} catch (e) {
  console.error("[Second better network panel] Dev tools loading fail", e);
}