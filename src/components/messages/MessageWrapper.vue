<template>
  <div>
    <transition-group name="fading" class="nod-message-wrapper">
      <Message v-for="msg in messages" :key="msg.messageId" :emoji="msg.emoji" :username="msg.username" :img="msg.img" />
      <Hand v-for="hand in hands" :key="hand.messageId" :username="hand.username" :img="hand.img" :messageId="hand.messageId" />
    </transition-group>
  </div>
</template>

<script>
import Message from "./Message";
import Hand from "./Hand";

import { generateUUID } from "../../utils";
export default {
  components: {
    Message,
    Hand
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    hands() {
      return this.$store.state.hands;
    }
  },
  created: function() {
    this.$options.sockets.onmessage = ({ data }) => {
      const d = JSON.parse(data);
      switch (d.action) {
        case "MESSAGE":
          this.$store.dispatch("addMessage", {
            messageId: d.message.messageId || generateUUID(),
            emoji: d.message.emoji,
            username: d.message.username,
            img: d.message.img
          });
          break;
        case "QUEUE":
          this.$store.dispatch("addHand", {
            messageId: d.message.messageId,
            username: d.message.username,
            img: d.message.img
          });
          break;
        case "REMOVE":
          this.$store.dispatch("removeHand", d.message.messageId);
          break;
      }
    };
  }
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
