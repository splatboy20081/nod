<template>
  <div>
    <transition-group name="fading" class="nod-message-wrapper">
      <Message v-for="msg in messages" :key="msg.messageId" :emoji="msg.emoji" :username="msg.username" :img="msg.img" :tone="msg.tone" />
      <Hand v-for="hand in hands" :key="hand.messageId" :username="hand.username" :img="hand.img" :messageId="hand.messageId" :tone="hand.tone" />
    </transition-group>
  </div>
</template>

<script>
import Message from "./Message";
import Hand from "./Hand";
import { generateUUID, sendNotification } from "../../utils";

export default {
  components: {
    Message,
    Hand,
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    hands() {
      return this.$store.state.hands;
    },
  },
  created: function() {
    this.sockets.subscribe("message", (data) => {
      this.$store.dispatch("addMessage", {
        messageId: data.messageId || generateUUID(),
        emoji: data.emoji,
        username: data.username,
        img: data.img,
        owner: false,
        tone: data.tone,
      });
    });

    this.sockets.subscribe("queue", (data) => {
      this.$store.dispatch("addHand", {
        messageId: data.messageId,
        username: data.username,
        img: data.img,
        owner: false,
        tone: data.tone,
      });

      if (this.$store.state.visible == false && localStorage.getItem("notificationStatus") == "true") {
        chrome.runtime.sendMessage(this.$store.state.extensionID, {
          type: "displayNotification",
          options: {
            title: "Notification from Nod",
            message: data.username,
            iconUrl: data.tone
              ? `chrome-extension://${this.$store.state.extensionID}/img/tones/${data.tone}/hand.gif`
              : `chrome-extension://${this.$store.state.extensionID}/img/tones/0/hand.gif`,
            type: "basic",
          },
        });
      }
    });

    this.sockets.subscribe("remove", ({ messageId }) => {
      this.$store.dispatch("removeHand", messageId);
    });
  },
};
</script>

<style lang="scss" scoped>
.fading-enter {
  opacity: 0;
}
.fading-leave-to {
  opacity: 0;
  margin-bottom: -50px;
}
.nod-message-wrapper {
  position: fixed;
  bottom: 100px;
  left: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
