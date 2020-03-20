chrome.runtime.onMessage.addListener(request => {
  if (request.message === "init_action") {
    const wsClient = new WebSocket("wss://ma711m87kd.execute-api.us-east-1.amazonaws.com/dev/");
    const appWrapper = createWrapper();
    const messageWrapper = createMessageWrapper();

    const avatar = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/img');
    const name = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/div/div');
    const username = name["title"].split(" ")[0];

    document.body.appendChild(appWrapper);
    document.body.appendChild(messageWrapper);

    wsClient.addEventListener("open", () => {
      const button = createBtn(wsClient, request.url, username, avatar.src);
      appWrapper.append(button);
      wsClient.send(JSON.stringify({ route: "join", data: { id: request.url } }));
    });

    wsClient.addEventListener("message", event => {
      messageWrapper.insertAdjacentElement("afterbegin", createMessage(event.data));
      setTimeout(() => {
        messageWrapper.firstChild.style = "opacity: 0";
        setTimeout(() => {
          messageWrapper.removeChild(messageWrapper.firstChild);
        }, 300);
      }, 3000);
    });
  }
});

const createWrapper = () => {
  var wrapper = document.createElement("DIV");
  wrapper.style = "position: fixed; top:20px; left:20px; z-index: 10000000";
  return wrapper;
};

const createMessageWrapper = () => {
  var wrapper = document.createElement("DIV");
  wrapper.style = "position: fixed; bottom:100px; left:20px; z-index: 10000000";
  return wrapper;
};

const createBtn = (wsClient, url, name, img) => {
  var btn = document.createElement("DIV");
  btn.classList.add("handsup-btn");
  btn.innerHTML = "👍️";
  btn.addEventListener("click", () => {
    wsClient.send(JSON.stringify({ id: url, message: name, img: img }));
  });
  return btn;
};

const createMessage = message => {
  const messageData = JSON.parse(message);

  var messageWrapper = document.createElement("DIV");
  messageWrapper.classList.add("handsup-message");

  var img = document.createElement("IMG");
  img.setAttribute("src", messageData.img);
  img.classList.add("handsup-avatar");

  messageWrapper.appendChild(img);
  messageWrapper.innerHTML += `${messageData.message} 👍️`;
  return messageWrapper;
};

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
