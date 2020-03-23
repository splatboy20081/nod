chrome.runtime.onMessage.addListener(request => {
  const IS_DEV_MODE = !("update_url" in chrome.runtime.getManifest());

  if (request.message === "init") {
    let wsClient;

    let avatar = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/img');
    let name = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/div/div');
    let username = name && name["title"].split(" ")[0];
    let meetingId = document.querySelector("[data-unresolved-meeting-id]").getAttribute("data-unresolved-meeting-id");

    // Create Functions

    const createMessageWrapper = () => {
      var messageWrapper = document.createElement("DIV");
      messageWrapper.classList.add("nod-messageWrapper");
      return messageWrapper;
    };

    let messageWrapper = createMessageWrapper();

    const createBtn = (emojiPath, small) => {
      const btn = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emoji = chrome.runtime.getURL(emojiPath);

      img.setAttribute("src", emoji);
      img.classList.add("nod-emoji");

      btn.classList.add("nod-btn");
      small && btn.classList.add("small");
      btn.appendChild(img);

      const data = { id: meetingId, emoji: emoji, username: username, img: avatar.src };

      btn.addEventListener(
        "click",
        debounce(() => {
          const messageData = { action: "MESSAGE", message: data };
          insertMessage(messageData, messageWrapper);
          wsClient.send(JSON.stringify(messageData));
        }, 500)
      );
      return btn;
    };

    const createTray = () => {
      const tray = document.createElement("DIV");
      const subTray = document.createElement("DIV");
      const thumb = createBtn("img/thumb.png");

      tray.classList.add("nod-appWrapper");
      tray.classList.add("nod-tray");
      subTray.classList.add("nod-tray");
      tray.append(thumb);

      ["love", "wave", "laugh", "clap"].forEach(e => {
        let btn = createBtn(`img/${e}.gif`, true);
        subTray.append(btn);
      });

      tray.addEventListener("mouseenter", () => {
        tray.appendChild(subTray);
      });

      tray.addEventListener("mouseleave", () => {
        tray.removeChild(subTray);
      });

      return tray;
    };

    let appWrapper = createTray();

    const createMessage = data => {
      const messageItem = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emojiWrapper = document.createElement("DIV");
      const emoji = document.createElement("IMG");

      messageItem.classList.add("nod-message");

      img.setAttribute("src", data.message.img);
      img.classList.add("nod-avatar");

      emojiWrapper.classList.add("nod-emoji-wrapper");

      emoji.setAttribute("src", data.message.emoji);
      emoji.classList.add("nod-emoji");

      emojiWrapper.appendChild(emoji);
      messageItem.appendChild(emojiWrapper);
      messageItem.appendChild(img);
      messageItem.innerHTML += `${data.message.username}`;

      return messageItem;
    };

    // Util functions

    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function debounce(func, delay) {
      let inDebounce;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
      };
    }

    function insertMessage(data, container) {
      container.insertAdjacentElement("afterbegin", createMessage(data));
      setTimeout(() => {
        container.lastChild.classList.add("nod-removed");
        setTimeout(() => {
          container.removeChild(container.lastChild);
        }, 300);
      }, 5000);
    }

    //
    // Initialize
    //

    const init = async () => {
      while (getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/div')) {
        await new Promise(r => setTimeout(r, 500));
      }

      const wsUrl = IS_DEV_MODE ? "wss://ocbtgdge06.execute-api.us-east-1.amazonaws.com/dev/" : "wss://bc74w5xpwb.execute-api.us-east-1.amazonaws.com/prod/";
      wsClient = new WebSocket(wsUrl);

      wsClient.addEventListener("open", () => {
        document.body.appendChild(appWrapper);
        document.body.appendChild(messageWrapper);
        wsClient.send(JSON.stringify({ route: "join", data: { id: meetingId, username: username } }));

        wsClient.addEventListener("message", event => {
          const data = JSON.parse(event.data);
          if (data.action == "MESSAGE") {
            insertMessage(data, messageWrapper);
          } else {
            console.log(data);
          }
        });

        window.addEventListener("beforeunload", function(e) {
          wsClient.send(JSON.stringify({ route: "disconnect", data: { id: meetingId } }));
        });

        const ping = () => {
          wsClient.send(JSON.stringify({ route: "ping" }));
          setTimeout(ping, 500000);
        };

        ping();
      });
    };

    init();
  }
});
