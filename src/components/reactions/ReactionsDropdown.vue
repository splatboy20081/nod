<template>
  <div class="dropdown" id="reactions-dropdown">
    <Reaction emoji="thumb" label="Send thumbs up emoji" />
    <Reaction emoji="thumb_down" label="Send thumbs down emoji" />
    <Reaction emoji="clap" label="Send clapping emoji" />
    <Reaction emoji="wave" label="Send wave emoji" />
    <Reaction emoji="celebrate" label="Send celebration face emoji" />
    <Reaction emoji="laugh" label="Send laughing emoji" />
    <WantMore />
  </div>
</template>

<script>
import Reaction from "./Reaction";
import WantMore from "./WantMore";
export default {
  components: {
    Reaction,
    WantMore,
  },
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
  display: flex;
  flex-wrap: wrap;
}
</style>
