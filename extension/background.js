chrome.runtime.onUpdateAvailable.addListener(function(details) {
  console.log("updating to version " + details.version);
  chrome.runtime.reload();
});

chrome.runtime.onMessageExternal.addListener(function(
  request,
  sender,
  sendResponse = () => {
    return { success: true };
  }
) {
  if (request.reload) {
    chrome.runtime.requestUpdateCheck(function(status) {
      if (status == "update_available") {
        console.log("update pending...");
      } else if (status == "no_update") {
        console.log("no update found");
      } else if (status == "throttled") {
        console.log("Oops, I'm asking too frequently - I need to back off.");
      }
    });
  }
});
