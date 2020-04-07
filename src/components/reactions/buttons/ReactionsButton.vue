<template>
  <div id="nodBtn" class="tray-button-outer" tabindex="0" @mouseover="openReactions" @mouseleave="closeReactions" @keyup.enter="openReactions" @keyup.esc="closeReactions">
    <a class="uArJ5e UQuaGc kCyAyd kW31ib foXzLb tray-button" tabindex="-1" aria-label="Open Nod extension" role="button">
      <div class="e19J0b CeoRYc"></div>
      <img :src="$store.getters.getAsset('thumb')" style="height: 42px;" />
      <ReactionsDropdown v-if="this.$store.state.reactions" />
    </a>
  </div>
</template>

<script>
import ReactionsDropdown from "../ReactionsDropdown";

export default {
  components: {
    ReactionsDropdown,
  },
  methods: {
    openReactions: function() {
      this.$store.dispatch("openDropdown", "reactions");
    },
    closeReactions: function() {
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
