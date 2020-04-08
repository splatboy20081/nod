<template>
  <div id="app">
    <ReactionTray v-if="loaded" />
    <MessageWrapper v-if="loaded" />
  </div>
</template>

<script>
import ReactionTray from "./components/reactions/ReactionTray.vue";
import MessageWrapper from "./components/messages/MessageWrapper.vue";
import { contains, waitForElement } from "./utils";

export default {
  name: "App",
  data() {
    return {
      loaded: false,
    };
  },
  components: {
    ReactionTray,
    MessageWrapper,
  },
  created: function() {
    this.getData();
    this.setupListeners();
    this.$options.sockets.onopen = (data) => {
      this.websocketInit();
    };
  },

  methods: {
    getData() {
      const dataScript = contains("script", "ds:7");
      const userData = JSON.parse(dataScript[1].text.match(/\[[^\}]*/)[0]);
      const assets = JSON.parse(document.querySelector("#nodAssetData").textContent);

      let data = {
        meetingID: document.querySelector("[data-unresolved-meeting-id]").getAttribute("data-unresolved-meeting-id"),
        name: userData[6].split(" ")[0],
        team: userData[28],
        avatar: userData[5],
        assets: assets,
      };
      this.$store.dispatch("addUserData", data);
    },
    websocketInit() {
      // Display extension
      this.loaded = true;

      // send join message to websocket
      this.$socket.sendObj({
        route: "join",
        data: {
          id: this.$store.getters.getUser("meetingID"),
          team: this.$store.getters.getUser("team"),
        },
      });

      // Send console message
      console.log("%c Initialised Nod Extension.", "background: #4D2F3C; color: #FBE2A0");
      console.log("%c Something gone wrong? Let me know - hi@jamiec.io", "background: #4D2F3C; color: #FBE2A0");

      // Send ping to keep socket connection open
      const ping = () => {
        console.log("Keeping Nod alive...");
        this.$socket.sendObj({ route: "ping" });
      };

      let keepAlive = setInterval(ping, 60000 * 5);
    },

    setupListeners() {
      this.setupTabListener();
      this.setupDestroyListener();
      this.setupVisibilityListeners();
    },

    setupVisibilityListeners() {
      const vm = this;
      document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "hidden") {
          vm.$store.dispatch("setVisible", false);
        } else {
          vm.$store.dispatch("setVisible", true);
        }
      });
    },
    setupTabListener() {
      document.addEventListener("keydown", function(event) {
        if (event.keyCode === 9) {
          if (document.activeElement == document.body || document.activeElement == null) {
            event.preventDefault();
            document.getElementById("nodBtn").focus();
          }
        }
      });
    },

    async setupDestroyListener() {
      window.addEventListener("beforeunload", (event) => {
        this.$socket.sendObj({
          route: "disconnect",
          data: { id: this.$store.getters.getUser("meetingID") },
        });
      });

      // wait for meet to relay call ended message
      while (document.querySelector("[data-call-ended='true']") == null) {
        await new Promise((r) => setTimeout(r, 200));
      }
      this.loaded = false;
      this.$socket.sendObj({
        route: "disconnect",
        data: { id: this.$store.getters.getUser("meetingID") },
      });
      this.$socket.close();
    },
  },
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100000;
}

/* Styles for Meet */
.pHsCke {
  padding-left: 250px !important;
}
</style>
