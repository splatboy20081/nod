import * as utils from "./src/utils/index.js";

(async () => {
  // REMEMBER TO TURN THIS BACK OFF YOU TIT.
  const IS_DEV_MODE = true;
  // YES. THIS IS AWFUL CODE. BUT DONT FORGET.

  window.onerror = function(message, source, lineno, colno, error) {};

  let wsClient;
  let meetingId;
  let keepAlive;
  let messageWrapper;
  let newTray;

  document.addEventListener("keydown", function(event) {
    if (event.keyCode === 9) {
      if (document.activeElement == document.body || document.activeElement == null) {
        event.preventDefault();
        document.querySelector("#nod-btn").focus();
      }
    }

    if (event.keyCode === 13) {
      event.preventDefault();
      document.activeElement.click();
    }
  });

  meetingId = document.querySelector("[data-unresolved-meeting-id]").getAttribute("data-unresolved-meeting-id");

  const dataScript = utils.contains("script", "ds:7");
  const assets = JSON.parse(document.querySelector("#nodAssetData").textContent);
  const userData = JSON.parse(dataScript[1].text.match(/\[[^\}]*/)[0]);
  const name = userData[6];

  if (name != null) {
    let avatar = userData[5];
    let username = name.split(" ")[0];
    let team = userData[28];

    const createButtons = () => {
      // Create Tray
      const ownVideoPreview = document.querySelector("[data-fps-request-screencast-cap]");
      const tray = ownVideoPreview.parentElement.parentElement.parentElement.parentElement;
      const trayInner = ownVideoPreview.parentElement.parentElement.parentElement;

      newTray = document.createElement("DIV");
      newTray.classList = tray.classList;
      newTray.style.right = "auto";
      newTray.style.zIndex = "1000000";
      newTray.style.borderRadius = "0 0 8px 0";

      const newTrayInner = document.createElement("DIV");
      newTrayInner.classList = trayInner.classList;
      newTrayInner.style.borderRadius = "0 0 8px 0";
      newTrayInner.setAttribute("id", "tray-inner");

      // Add our thumbs up button
      const toggleButton = document.createElement("a");
      toggleButton.classList = trayInner.querySelector("[data-tab-id='1']").classList;
      toggleButton.classList.add("nod-tray-button");
      toggleButton.classList = trayInner.querySelector("[data-tab-id='1']").classList;
      toggleButton.classList.add("nod-tray-button");
      toggleButton.setAttribute("id", "nod-btn");

      const thumbEmoji = assets["thumb"];
      const thumb = document.createElement("IMG");
      thumb.setAttribute("src", thumbEmoji);
      thumb.style.height = "42px";
      toggleButton.appendChild(thumb);
      toggleButton.setAttribute("tabindex", 0);
      toggleButton.setAttribute("aria-label", "Open Nod extension");
      toggleButton.setAttribute("role", "button");

      // Add divider
      const divider = document.createElement("DIV");
      divider.classList = trayInner.children[1].classList;

      // Add hands up button
      const handsUpButton = document.createElement("a");
      handsUpButton.classList = trayInner.children[0].classList;
      handsUpButton.classList.add("nod-tray-button");
      handsUpButton.setAttribute("tabindex", 0);
      handsUpButton.setAttribute("aria-label", "Raise your hand");
      handsUpButton.setAttribute("role", "button");

      const handEmoji = assets["handStatic"];
      const hand = document.createElement("IMG");
      hand.setAttribute("src", handEmoji);
      hand.style.height = "32px";
      handsUpButton.appendChild(hand);

      handsUpButton.addEventListener(
        "click",
        utils.debounce(() => {
          const messageData = {
            action: "QUEUE",
            message: { id: meetingId, emoji: "hand", username: utils.sanitize(`${username} raised their hand`), img: utils.sanitize(avatar), messageId: utils.generateUUID() }
          };
          insertMessage(messageData, true);
          wsClient.send(JSON.stringify(messageData));
        }, 500)
      );

      // Append all to tray

      newTrayInner.append(toggleButton);
      newTrayInner.append(divider);
      newTrayInner.append(handsUpButton);

      newTray.appendChild(newTrayInner);
      document.body.prepend(newTray);

      // Create dropdown
      let dropdown = document.createElement("DIV");
      dropdown.classList.add("nod-dropdown");
      dropdown.setAttribute("id", "nod-dropdown");

      // Create Messages Wrapper
      messageWrapper = document.createElement("DIV");
      messageWrapper.classList.add("nod-messageWrapper");
      document.body.appendChild(messageWrapper);

      //Create emotes
      const thumbBtn = createButton("thumb", "Thumbs up", "Send thumbs up emoji");
      const confusedBtn = createButton("confused", "Hmm?", "Send confused emoji");
      const lolBtn = createButton("laugh", "LOL!", "Send laughing emoji");
      const loveBtn = createButton("love", "Wow!", "Send excited face emoji");
      const clapBtn = createButton("clap", "Well Done", "Send clapping hands emoji");

      const issuesArea = document.createElement("DIV");
      issuesArea.classList.add("nod-issues-area");
      issuesArea.innerHTML = "Having issues? <a>Reload</a>";
      issuesArea.setAttribute("tabindex", 0);
      issuesArea.setAttribute("aria-label", "Reload nod extension");
      issuesArea.setAttribute("role", "button");

      // issuesArea.addEventListener("click", () => {
      //   document.querySelector(".nod-dropdown").remove();
      //   let tray = document.querySelector("#tray-inner");
      //   tray.style.borderRadius = "0 0 8px 0";
      //   chrome.runtime.sendMessage("oikgofeboedgfkaacpfepbfmgdalabej", { reload: true });
      //   tray.style.opacity = "0.5";
      //   setTimeout(() => {
      //     tray.style.opacity = "1";
      //   }, 600);
      // });

      issuesArea.addEventListener("click", () => {
        chrome.runtime.sendMessage("oikgofeboedgfkaacpfepbfmgdalabej", { reload: true });
        destroy();
        init();
      });

      dropdown.appendChild(thumbBtn);
      dropdown.appendChild(confusedBtn);
      dropdown.appendChild(loveBtn);
      dropdown.appendChild(lolBtn);
      dropdown.appendChild(clapBtn);
      dropdown.appendChild(issuesArea);

      document.addEventListener("keyup", () => {
        if (event.keyCode === 13) {
          if (document.activeElement == toggleButton) {
            event.preventDefault();
            toggleButton.appendChild(dropdown);
            newTrayInner.style.borderRadius = "0";
            dropdown.firstChild.focus();
          } else {
            event.preventDefault();
            document.activeElement.click();
          }
        }
      });

      toggleButton.addEventListener("focus", () => {
        if (document.querySelector("#nod-dropdown")) {
          toggleButton.removeChild(dropdown);
          newTrayInner.style.borderRadius = "0 0 8px 0";
        }
      });
      handsUpButton.addEventListener("focus", () => {
        if (document.querySelector("#nod-dropdown")) {
          toggleButton.removeChild(dropdown);
          newTrayInner.style.borderRadius = "0 0 8px 0";
        }
      });

      toggleButton.addEventListener("mouseenter", () => {
        toggleButton.appendChild(dropdown);
        newTrayInner.style.borderRadius = "0";
      });

      toggleButton.addEventListener("mouseleave", () => {
        toggleButton.removeChild(dropdown);
        newTrayInner.style.borderRadius = "0 0 8px 0";
      });
    };

    const createButton = (emojiName, title, label) => {
      const btn = document.createElement("DIV");
      const img = document.createElement("IMG");
      const titleDiv = document.createElement("DIV");

      img.setAttribute("src", assets[emojiName]);
      img.classList.add("nod-emoji");

      titleDiv.textContent = title;

      btn.classList.add("nod-dropdown-item");
      btn.appendChild(img);
      btn.appendChild(titleDiv);
      btn.setAttribute("tabindex", 0);
      btn.setAttribute("aria-label", label);
      btn.setAttribute("role", "button");

      btn.addEventListener("click", () => {
        document.querySelector(".nod-dropdown").remove();
        document.querySelector("#tray-inner").style.borderRadius = "0 0 8px 0";
        const messageData = {
          action: "MESSAGE",
          message: { id: meetingId, emoji: utils.sanitize(emojiName), username: utils.sanitize(username), img: utils.sanitize(avatar) }
        };
        insertMessage(messageData);
        wsClient.send(JSON.stringify(messageData));
      });
      return btn;
    };

    const insertMessage = (data, removable = false) => {
      const messageItem = document.createElement("DIV");
      const img = document.createElement("IMG");
      const emojiWrapper = document.createElement("DIV");
      const emoji = document.createElement("IMG");
      const name = document.createElement("DIV");

      messageItem.classList.add("nod-message");

      img.setAttribute("src", data.message.img);
      img.classList.add("nod-avatar");

      emojiWrapper.classList.add("nod-emoji-wrapper");

      emoji.setAttribute("src", assets[data.message.emoji]);
      emoji.classList.add("nod-emoji");

      name.textContent = data.message.username;

      emojiWrapper.appendChild(emoji);
      messageItem.appendChild(emojiWrapper);
      messageItem.appendChild(img);
      messageItem.appendChild(name);

      const item = messageWrapper.insertAdjacentElement("afterbegin", messageItem);
      if (removable) {
        const id = data.message.messageId;
        item.setAttribute("data-id", id);
        item.classList.add("nod-removable");
        let emoji = item.querySelector(".nod-emoji");

        item.addEventListener("mouseenter", () => {
          emoji.setAttribute("src", assets["down"]);
        });
        item.addEventListener("mouseleave", () => {
          emoji.setAttribute("src", assets["hand"]);
        });
        item.addEventListener("click", () => {
          wsClient.send(JSON.stringify({ action: "REMOVE", message: { id: meetingId, messageId: id } }));
          item.classList.add("nod-removed");
          setTimeout(() => {
            item.remove();
          }, 300);
        });
      } else {
        setTimeout(() => {
          item.classList.add("nod-removed");
          setTimeout(() => {
            item.remove();
          }, 300);
        }, 5000);
      }
    };

    //
    // Initialize
    //

    const destroy = () => {
      if (wsClient.readyState != WebSocket.CLOSED) {
        clearInterval(keepAlive);
        wsClient.send(JSON.stringify({ route: "disconnect", data: { id: meetingId } }));
        newTray.remove();
        messageWrapper.remove();
        wsClient.close();
      }
    };

    const init = async () => {
      while (document.querySelector(".d7iDfe") !== null) {
        await new Promise(r => setTimeout(r, 500));
      }

      const wsUrl = IS_DEV_MODE ? "wss://ypuphzsg9c.execute-api.us-east-1.amazonaws.com/dev/" : "wss://j24amtdvi4.execute-api.us-east-1.amazonaws.com/prod";
      wsClient = new WebSocket(wsUrl);

      wsClient.addEventListener("open", () => {
        createButtons();
        wsClient.send(JSON.stringify({ route: "join", data: { id: meetingId, team: team } }));

        console.log("%c Initialised Nod Extension.", "background: #4D2F3C; color: #FBE2A0");
        console.log("%c Something gone wrong? Let me know - hi@jamiec.io", "background: #4D2F3C; color: #FBE2A0");

        wsClient.addEventListener("message", event => {
          const data = JSON.parse(event.data);
          if (data.action != "PING") {
            clearInterval(keepAlive);
            keepAlive = setInterval(ping, 60000 * 5);
          }
          switch (data.action) {
            case "MESSAGE":
              insertMessage(data);
              break;
            case "QUEUE":
              insertMessage(data, true);
              break;
            case "REMOVE":
              let removable = document.querySelector(`[data-id="${data.message.messageId}"]`);
              removable.classList.add("nod-removed");
              setTimeout(() => {
                removable.remove();
              }, 300);
              break;
          }
        });

        window.addEventListener("beforeunload", event => {
          destroy();
        });

        const ping = () => {
          console.log("Keeping Nod alive...");
          wsClient.send(JSON.stringify({ route: "ping" }));
        };

        keepAlive = setInterval(ping, 60000 * 5);
      });

      while (document.querySelector("[data-call-ended='true']") == null) {
        await new Promise(r => setTimeout(r, 500));
      }

      destroy();
    };

    init();
  }
})();
