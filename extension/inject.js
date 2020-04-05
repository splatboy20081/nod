const injectScript = (file_path, type = "script", tag = "html", text = "", callback) => {
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
    if (callback) {
      script.onload = function() {
        callback();
      };
    }
    script.innerHTML = text;
  }
  node.appendChild(script);
};

injectScript(chrome.runtime.getURL("styles.css"), "link", "head");
injectScript(chrome.runtime.getURL("content.js"), "module");

// injectScript(chrome.runtime.getURL("src/index.js"), "module");
injectScript(
  null,
  "script",
  "html",
  `{
      "thumb" : "${chrome.runtime.getURL("src/img/thumb.png")}",
      "confused" : "${chrome.runtime.getURL("src/img/confused.gif")}",
      "clap" : "${chrome.runtime.getURL("src/img/clap.gif")}",
      "laugh" : "${chrome.runtime.getURL("src/img/laugh.gif")}",
      "love" : "${chrome.runtime.getURL("src/img/love.gif")}",
      "hand" : "${chrome.runtime.getURL("src/img/hand.gif")}",
      "down" : "${chrome.runtime.getURL("src/img/down.png")}",
      "handStatic" : "${chrome.runtime.getURL("src/img/hand.png")}"
    }`
);
