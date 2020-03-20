// chrome.browserAction.onClicked.addListener(function(tab) {
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      const url = new URL(activeTab.url).pathname.split("/");
      const id = url[url.length - 1];
      chrome.tabs.sendMessage(activeTab.id, { message: "init_action", id: id });
    });
  }
});
