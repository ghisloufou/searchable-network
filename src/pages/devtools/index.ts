try {
  chrome.devtools.panels.create(
    "Better Network",
    "icon-34.png",
    "src/pages/panel/index.html",
    (panel) => {
      console.log("panel test");
      panel.onShown.addListener(() => console.log("panel opened"));
    }
  );
} catch (e) {
  console.error("[Better Network] Dev tools loading fail", e);
}