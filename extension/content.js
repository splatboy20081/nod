chrome.runtime.onMessage.addListener(request => {
  const IS_DEV_MODE = !("update_url" in chrome.runtime.getManifest());

  if (request.message === "init_action") {
    let wsClient;

    let avatar = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/img');
    let name = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/div/div');
    let username = name["title"].split(" ")[0];
    let meetingId = document.querySelector("[data-unresolved-meeting-id]").getAttribute("data-unresolved-meeting-id");

    const createTray = () => {
      const wrapper = document.createElement("DIV");
      const tray = document.createElement("DIV");
      const thumb = createBtn("img/thumb.png");

      wrapper.classList.add("nod-appWrapper");
      tray.classList.add("nod-tray");
      wrapper.append(thumb);

      ["love", "wave", "laugh", "clap"].forEach(e => {
        let btn = createBtn(`img/${e}.gif`, true);
        tray.append(btn);
      });

      wrapper.addEventListener("mouseenter", () => {
        wrapper.appendChild(tray);
      });

      wrapper.addEventListener("mouseleave", () => {
        wrapper.removeChild(tray);
      });

      return wrapper;
    };

    const createMessageWrapper = () => {
      var wrapper = document.createElement("DIV");
      wrapper.classList.add("nod-messageWrapper");
      return wrapper;
    };

    const createBtn = (emojiPath, small) => {
      const btn = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emoji = chrome.runtime.getURL(emojiPath);

      img.setAttribute("src", emoji);
      img.classList.add("nod-emoji");

      btn.classList.add("nod-btn");
      small && btn.classList.add("small");
      btn.appendChild(img);

      btn.addEventListener(
        "click",
        debounce(() => {
          wsClient.send(JSON.stringify({ id: meetingId, emoji: emoji, message: username, img: avatar.src }));
        }, 400)
      );
      return btn;
    };

    const createMessage = message => {
      const messageData = JSON.parse(message);
      const messageWrapper = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emojiWrapper = document.createElement("DIV");
      const emoji = document.createElement("IMG");

      messageWrapper.classList.add("nod-message");

      img.setAttribute("src", messageData.img);
      img.classList.add("nod-avatar");

      emojiWrapper.classList.add("nod-emoji-wrapper");

      emoji.setAttribute("src", messageData.emoji);
      emoji.classList.add("nod-emoji");

      emojiWrapper.appendChild(emoji);
      messageWrapper.appendChild(emojiWrapper);
      messageWrapper.appendChild(img);
      messageWrapper.innerHTML += `${messageData.message}`;

      return messageWrapper;
    };

    // Util functions

    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    const debounce = (func, delay) => {
      let inDebounce;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
      };
    };

    //
    // Initialize
    //

    const loading = setInterval(() => {
      const loadingText = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/div');

      if (!loadingText) {
        clearInterval(loading);
        const wsUrl = IS_DEV_MODE ? "wss://ocbtgdge06.execute-api.us-east-1.amazonaws.com/dev/" : "wss://bc74w5xpwb.execute-api.us-east-1.amazonaws.com/prod/";
        wsClient = new WebSocket(wsUrl);

        wsClient.addEventListener("open", () => {
          const appWrapper = createTray();
          const messageWrapper = createMessageWrapper();

          document.body.appendChild(appWrapper);
          document.body.appendChild(messageWrapper);
          wsClient.send(JSON.stringify({ route: "join", data: { id: meetingId } }));

          wsClient.addEventListener("message", event => {
            messageWrapper.insertAdjacentElement("afterbegin", createMessage(event.data));
            setTimeout(() => {
              messageWrapper.lastChild.style = "opacity: 0";
              setTimeout(() => {
                messageWrapper.removeChild(messageWrapper.lastChild);
              }, 300);
            }, 5000);
          });
        });
      }
    }, 1000);
  }
});
