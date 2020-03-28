chrome.runtime.requestUpdateCheck(function(status) {
  if (status == "update_available") {
    console.log("update pending...");
    chrome.runtime.reload();
  }
});
