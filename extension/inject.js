const injectScript = (file_path, text = "") => {
  var node = document.getElementsByTagName("html")[0];
  var script = document.createElement("script");
  if (text == "") {
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file_path);
  } else {
    script.setAttribute("type", "application/json");
    script.setAttribute("id", "nodAssetData");
    script.innerHTML = text;
  }
  node.appendChild(script);
};

(async () => {
  // Wait until in call
  while (document.querySelector(".d7iDfe") !== null) {
    await new Promise(r => setTimeout(r, 500));
  }

  // Create wrapper for Vue App
  const app = document.createElement("DIV");
  app.setAttribute("id", "app");
  document.body.prepend(app);

  // Inject script into page
  injectScript(chrome.runtime.getURL("dist/app.js"));
  injectScript(chrome.runtime.getURL("dist/chunk-vendors.js"));

  injectScript(
    null,
    `{
          "thumb" : "${chrome.runtime.getURL("img/thumb.png")}",
          "confused" : "${chrome.runtime.getURL("img/confused.gif")}",
          "clap" : "${chrome.runtime.getURL("img/clap.gif")}",
          "laugh" : "${chrome.runtime.getURL("img/laugh.gif")}",
          "love" : "${chrome.runtime.getURL("img/love.gif")}",
          "hand" : "${chrome.runtime.getURL("img/hand.gif")}",
          "down" : "${chrome.runtime.getURL("img/down.png")}",
          "handStatic" : "${chrome.runtime.getURL("img/hand.png")}"
        }`
  );
})();
