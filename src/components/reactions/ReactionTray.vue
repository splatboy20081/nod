<template>
  <div class="lvE3se main-tray">
    <div class="NzPR9b tray-inner" :class="{ open: trayOpen }">
      <ReactionsButton />
      <div class="qO3Z3c"></div>
      <HandUpButton />
      <div class="qO3Z3c"></div>
      <SettingsButton />
    </div>
  </div>
</template>

<script>
import HandUpButton from "./buttons/HandUpButton";
import ReactionsButton from "./buttons/ReactionsButton";
import SettingsButton from "./buttons/SettingsButton";

export default {
  components: {
    HandUpButton,
    ReactionsButton,
    SettingsButton,
  },
  computed: {
    trayOpen() {
      return this.$store.state.reactions || this.$store.state.settings;
    },
  },
};
</script>

<style scoped>
.main-tray {
  right: auto;
  animation-name: fade;
  animation-duration: 0.5s;
  z-index: 100000;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.main-tray,
.tray-inner {
  border-radius: 0 0 8px;
}

.open {
  border-radius: 0;
}
</style>
