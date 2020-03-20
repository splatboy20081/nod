// chrome.browserAction.onClicked.addListener(function(tab) {
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      let url = new URL(activeTab.url);
      chrome.tabs.sendMessage(activeTab.id, { message: "init_action", url: url.pathname.replace("/", "") });
    });
  }
});
