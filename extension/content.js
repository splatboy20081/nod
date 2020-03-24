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

    const createBtn = (emojiPath, small, tip) => {
      const btnWrapper = document.createElement("DIV");
      const btn = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emoji = chrome.runtime.getURL(emojiPath);

      img.setAttribute("src", emoji);
      img.classList.add("nod-emoji");

      btn.classList.add("nod-btn");
      small && btn.classList.add("small");
      btn.appendChild(img);
      btnWrapper.classList.add("nod-btn-wrapper");
      btnWrapper.appendChild(btn);

      if (tip) {
        let tooltip = createTooltip(tip);

        btn.addEventListener("mouseenter", () => {
          btnWrapper.appendChild(tooltip);
        });

        btn.addEventListener("mouseleave", () => {
          btnWrapper.removeChild(tooltip);
        });
      }

      btn.addEventListener(
        "click",
        debounce(() => {
          const messageData = {
            action: "MESSAGE",
            message: { id: meetingId, emoji: emoji, username: username, img: avatar.src }
          };
          insertMessage(messageData, messageWrapper);
          wsClient.send(JSON.stringify(messageData));
        }, 500)
      );
      return btnWrapper;
    };

    const createHandUpBtn = (emojiPath, tip) => {
      const btnWrapper = document.createElement("DIV");
      const btnBlock = document.createElement("DIV");
      const btn = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emoji = chrome.runtime.getURL(emojiPath);

      img.setAttribute("src", emoji);
      img.classList.add("nod-emoji");

      btn.classList.add("nod-btn");
      btn.classList.add("small");
      btn.appendChild(img);

      btnBlock.classList.add("nod-btn-wrapper");
      btnWrapper.classList.add("nod-handsup-wrapper");

      btnBlock.appendChild(btn);
      btnWrapper.appendChild(btnBlock);

      if (tip) {
        let tooltip = createTooltip(tip);

        btnBlock.addEventListener("mouseenter", () => {
          btnBlock.appendChild(tooltip);
        });

        btnBlock.addEventListener("mouseleave", () => {
          btnBlock.removeChild(tooltip);
        });
      }

      btn.addEventListener(
        "click",
        debounce(() => {
          const messageData = {
            action: "QUEUE",
            message: { id: meetingId, emoji: emoji, username: `${username} raised their hand`, img: avatar.src, messageId: generateUUID() }
          };
          addToQueue(messageData, messageWrapper);
          wsClient.send(JSON.stringify(messageData));
        }, 500)
      );
      return btnWrapper;
    };

    const createTray = () => {
      const tray = document.createElement("DIV");
      const subTray = document.createElement("DIV");
      const thumb = createBtn("img/thumb.png");

      tray.classList.add("nod-appWrapper");
      tray.classList.add("nod-tray");
      subTray.classList.add("nod-tray");
      tray.append(thumb);

      [
        ["love", "Love&nbsp;it!"],
        ["confused", "I'm&nbsp;Confused?"],
        ["laugh", "LOL"],
        ["clap", "Well&nbsp;Done!"]
      ].forEach(e => {
        let btn = createBtn(`img/${e[0]}.gif`, true, e[1]);
        subTray.append(btn);
      });

      let btn = createHandUpBtn("img/hand.gif", "Raise&nbsp;your&nbsp;hand");
      subTray.append(btn);

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

    function generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function insertMessage(data, container) {
      const item = container.insertAdjacentElement("afterbegin", createMessage(data));
      setTimeout(() => {
        item.classList.add("nod-removed");
        setTimeout(() => {
          item.remove();
        }, 300);
      }, 5000);
    }

    function addToQueue(data, container) {
      const item = container.insertAdjacentElement("afterbegin", createMessage(data));
      const id = data.message.messageId;
      item.setAttribute("data-id", id);

      item.addEventListener("click", () => {
        wsClient.send(JSON.stringify({ action: "REMOVE", message: { id: meetingId, messageId: id } }));
        removeFromQueue(id, container);
      });
    }

    function removeFromQueue(id) {
      const removableItem = messageWrapper.querySelector(`[data-id='${id}']`);
      if (removableItem) {
        removableItem.classList.add("nod-removed");
        setTimeout(() => {
          removableItem.remove();
        }, 300);
      }
    }

    function createTooltip(text) {
      const wrapper = document.createElement("DIV");
      wrapper.classList.add("nod-tooltip");
      wrapper.innerHTML += text;
      return wrapper;
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
        console.log("opening");
        document.body.appendChild(appWrapper);
        document.body.appendChild(messageWrapper);
        wsClient.send(JSON.stringify({ route: "join", data: { id: meetingId, username: username } }));

        wsClient.addEventListener("message", event => {
          const data = JSON.parse(event.data);
          console.log(data.action);
          switch (data.action) {
            case "MESSAGE":
              insertMessage(data, messageWrapper);
              break;
            case "QUEUE":
              addToQueue(data, messageWrapper);
              break;
            case "REMOVE":
              removeFromQueue(data.message.messageId);
              break;
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
