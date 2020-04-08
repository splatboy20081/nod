<template>
  <div class="tray-button-outer" tabindex="0" @focus="closeDropdown" @keyup.enter="sendHand()" @click="sendHand()">
    <a class="uArJ5e UQuaGc kCyAyd kW31ib foXzLb tray-button" tabindex="-1" aria-label="Raise your hand" role="button">
      <div class="e19J0b CeoRYc"></div>
      <img :src="getHand" style="height: 32px;" />
    </a>
  </div>
</template>

<script>
import { generateUUID } from "../../../utils/index";

export default {
  computed: {
    getHand() {
      return this.$store.getters.getAsset("handTones")[this.$store.state.tone];
    },
  },
  methods: {
    sendHand() {
      // Close dropdown
      this.$store.dispatch("closeDropdown", "reactions");
      //Generate id
      const id = generateUUID();
      // Send local version to store
      if (this.$store.state.hands.filter((h) => h.owner === true).length < 1) {
        this.$store.dispatch("addHand", {
          emoji: "hand",
          username: `${this.$store.getters.getUser("name")} raised their hand`,
          img: this.$store.getters.getUser("avatar"),
          messageId: id,
          owner: true,
          tone: this.$store.state.tone,
        });
        // Send one over the websocket to other users
        this.$socket.sendObj({
          action: "QUEUE",
          message: {
            id: this.$store.getters.getUser("meetingID"),
            emoji: "hand",
            username: `${this.$store.getters.getUser("name")} raised their hand`,
            img: this.$store.getters.getUser("avatar"),
            messageId: id,
            tone: this.$store.state.tone,
          },
        });
      }
    },
    closeDropdown() {
      this.$store.dispatch("closeDropdown", "reactions");
    },
  },
};
</script>

<style lang="scss" scoped>
.tray-button-outer {
  &:focus > .tray-button {
    background-color: rgba(2, 191, 165, 0.15);
  }
}

.tray-button {
  display: flex;
  overflow: visible !important;
  padding: 0 10px;
}
</style>
