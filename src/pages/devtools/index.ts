try {
  chrome.devtools.panels.create(
    "Searchable Network",
    "icon-34.png",
    "src/pages/panel/index.html",
    (panel) => {
      console.log("panel test");
      panel.onShown.addListener(() => console.log("panel opened"));
    }
  );
} catch (e) {
  console.error("[Searchable Network] Dev tools loading fail", e);
}