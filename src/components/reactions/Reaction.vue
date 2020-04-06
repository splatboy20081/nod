<template>
  <div class="dropdown-outer" @click="sendMessage(emoji)" @keyup.enter="sendMessage(emoji)" tabindex="0" :aria-label="label" role="button">
    <div class="dropdown-item" tabindex="-1">
      <img class="emoji" :src="$store.getters.getAsset(emoji)" />
      {{ text }}
    </div>
  </div>
</template>

<script>
import { generateUUID } from "../../utils/index";

export default {
  props: {
    emoji: String,
    text: String,
    label: String,
  },
  methods: {
    sendMessage(emoji) {
      this.$store.dispatch("closeDropdown", "reactions");
      if (this.$store.state.messages.filter((h) => h.owner === true).length < 1) {
        this.$store.dispatch("addMessage", {
          messageId: generateUUID(),
          emoji: emoji,
          username: this.$store.getters.getUser("name"),
          img: this.$store.getters.getUser("avatar"),
          owner: true,
        });

        this.$socket.sendObj({
          action: "MESSAGE",
          message: {
            id: this.$store.getters.getUser("meetingID"),
            emoji: emoji,
            username: this.$store.getters.getUser("name"),
            img: this.$store.getters.getUser("avatar"),
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-outer {
  &:focus > .dropdown-item {
    background-color: rgba(2, 191, 165, 0.15);
    outline: 4px solid rgb(2, 191, 165);
  }
}

.dropdown-item {
  padding: 3px 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  position: relative;
  &:hover {
    background-color: #00796b0d;
  }
}

.emoji {
  width: 70%;
  max-width: 42px;
  margin-right: 10px;
}
</style>
