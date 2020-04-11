<template>
  <div class="dropdown" id="reactions-dropdown">
    <Reaction emoji="thumb" text="Thumbs Up" label="Send thumbs up emoji" />
    <Reaction emoji="clap" text="Well Done!" label="Send clapping emoji" />
    <Reaction emoji="confused" text="Hmmm?" label="Send confused face emoji" />
    <Reaction emoji="love" text="Wow" label="Send excited face emoji" />
    <Reaction emoji="laugh" text="LOL!" label="Send laughing emoji" />
  </div>
</template>

<script>
import Reaction from "./Reaction";
export default {
  components: {
    Reaction
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  animation: fade 0.2s;
  position: absolute;
  top: 48px;
  left: 0;
  background-color: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 8px 0;
  width: 260px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 6px 6px 2px rgba(60, 64, 67, 0.149);
  padding-bottom: 10px;
}
</style>
