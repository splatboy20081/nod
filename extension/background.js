chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { message: "init" });
  }
});

chrome.runtime.onUpdateAvailable.addListener(() => {
  chrome.runtime.reload();
});

chrome.runtime.requestUpdateCheck(function(status) {
  if (status == "update_available") {
    console.log("update pending...");
  }
});
