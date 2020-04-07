const injectScript = (file_path, type = "script", tag = "html", text = "") => {
  var node = document.getElementsByTagName(tag)[0];
  var tag_type = type == "link" ? "link" : "script";
  var script = document.createElement(tag_type);
  if (type == "script") {
    script.setAttribute("type", "text/javascript");
  } else if (type == "module") {
    script.setAttribute("type", "module");
  } else {
    script.setAttribute("rel", "stylesheet");
    script.setAttribute("media", "screen");
  }
  if (text == "") {
    script.setAttribute(tag_type == "script" ? "src" : "href", file_path);
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
    await new Promise((r) => setTimeout(r, 500));
  }

  // Create wrapper for Vue App
  const app = document.createElement("DIV");
  app.setAttribute("id", "app");
  document.body.prepend(app);

  // Inject script into page
  injectScript(chrome.runtime.getURL("dist/app.css"), "link", "head");
  injectScript(chrome.runtime.getURL("dist/app.js"), "script", "html");
  injectScript(chrome.runtime.getURL("dist/chunk-vendors.js"), "script", "html");

  injectScript(
    null,
    "script",
    "html",
    `{
          "thumb" : "${chrome.runtime.getURL("img/thumb.png")}",
          "confused" : "${chrome.runtime.getURL("img/confused.gif")}",
          "clap" : "${chrome.runtime.getURL("img/clap.gif")}",
          "laugh" : "${chrome.runtime.getURL("img/laugh.gif")}",
          "love" : "${chrome.runtime.getURL("img/love.gif")}",
          "hand" : "${chrome.runtime.getURL("img/hand.gif")}",
          "down" : "${chrome.runtime.getURL("img/down.png")}",
          "handStatic" : "${chrome.runtime.getURL("img/hand.png")}",
          "notification" : "${chrome.runtime.getURL("img/notification.png")}"
        }`
  );
})();
