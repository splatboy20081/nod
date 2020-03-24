let url;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete" && tab.active) {
    if (tab.url != url) {
      chrome.tabs.sendMessage(tabId, { message: "init" });
      url = tab.url;
    }
  }
});
