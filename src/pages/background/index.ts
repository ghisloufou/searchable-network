import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

console.log("background loaded");

const tab_log = function (json_args) {
  const args = JSON.parse(json_args);
  console[args[0]](...args);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponseParam) => {
  if (request.command == "scrub") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { command: request.command },
        function (response) {
          console.log(response);
        }
      );
    });
  } else if (request.command == "sendToConsole") {
    chrome.tabs.executeScript(request.tabId, {
      code: "(" + tab_log + ")('" + request.args + "');",
    });
  }
});
