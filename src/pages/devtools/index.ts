try {
  chrome.devtools.panels.create(
    "Searchable Network",
    "icon-34.png",
    "src/pages/panel/index.html"
  );
} catch (e) {
  console.error("[Searchable Network] Dev tools loading fail", e);
}
