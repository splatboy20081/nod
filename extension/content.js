chrome.runtime.onMessage.addListener(request => {
  if (request.message === "init_action") {
    let avatar;
    let name;
    let username;
    let meetingId;
    let wsClient;

    const createTray = () => {
      const thumbsup = createBtn("img/thumb.png");
      const wave = createBtn("img/wave.gif", true);
      const heart = createBtn("img/love.gif", true);
      const laugh = createBtn("img/laugh.gif", true);
      const clap = createBtn("img/clap.gif", true);

      var wrapper = document.createElement("DIV");
      wrapper.classList.add("nod-appWrapper");
      wrapper.append(thumbsup);

      var tray = document.createElement("DIV");
      tray.classList.add("nod-tray");
      tray.append(heart);
      tray.append(laugh);
      tray.append(wave);
      tray.append(clap);

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
      wrapper.style = "position: fixed; bottom:100px; left:20px; z-index: 10000000";
      return wrapper;
    };

    const createBtn = (emojiPath, small) => {
      var btn = document.createElement("DIV");
      btn.classList.add("nod-btn");
      small && btn.classList.add("small");

      var img = document.createElement("IMG");
      const emoji = chrome.runtime.getURL(emojiPath);
      img.setAttribute("src", emoji);
      img.classList.add("nod-emoji");

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

      var messageWrapper = document.createElement("DIV");
      messageWrapper.classList.add("nod-message");

      var img = document.createElement("IMG");
      img.setAttribute("src", messageData.img);
      img.classList.add("nod-avatar");

      var emojiWrapper = document.createElement("DIV");
      emojiWrapper.classList.add("nod-emoji-wrapper");

      var emoji = document.createElement("IMG");
      emoji.setAttribute("src", messageData.emoji);
      emoji.classList.add("nod-emoji");

      emojiWrapper.appendChild(emoji);
      messageWrapper.appendChild(emojiWrapper);
      messageWrapper.appendChild(img);
      messageWrapper.innerHTML += `${messageData.message}`;

      return messageWrapper;
    };

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

    // Variables

    avatar = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/img');
    name = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[1]/div[2]/div/div/div');
    username = name["title"].split(" ")[0];
    meetingId = document.querySelector("[data-unresolved-meeting-id]").getAttribute("data-unresolved-meeting-id");

    const loading = setInterval(() => {
      const loadingText = getElementByXpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[3]/div[3]/div/div[2]/div/div[2]/div/div[1]/div[1]/div[1]/div');

      if (loadingText === null) {
        clearInterval(loading);
        wsClient = new WebSocket("wss://ma711m87kd.execute-api.us-east-1.amazonaws.com/dev/");
        const appWrapper = createTray();
        const messageWrapper = createMessageWrapper();

        wsClient.addEventListener("message", event => {
          messageWrapper.insertAdjacentElement("afterbegin", createMessage(event.data));
          setTimeout(() => {
            messageWrapper.lastChild.style = "opacity: 0";
            setTimeout(() => {
              messageWrapper.removeChild(messageWrapper.lastChild);
            }, 300);
          }, 5000);
        });

        document.body.appendChild(appWrapper);
        document.body.appendChild(messageWrapper);
        wsClient.addEventListener("open", event => {
          wsClient.send(JSON.stringify({ route: "join", data: { id: meetingId } }));
        });
      }
    }, 1000);
  }
});
