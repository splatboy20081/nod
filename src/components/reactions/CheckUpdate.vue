<template>
  <div class="update-outer" tabindex="0">
    <div class="update-area" tabindex="-1">
      <span @click="checkUpdate" v-if="!$store.state.updateChecked">Check for Update</span>
      <span @click="reload" @keydown.enter="reload" v-if="$store.state.updateAvailable == true && $store.state.updateChecked">
        Update Available
        <a>Reload</a>
      </span>
      <span v-if="$store.state.updateAvailable == false && $store.state.updateChecked">Latest version installed</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    checkUpdate() {
      const store = this.$store;
      store.dispatch("setUpdateChecked", true);

      chrome.runtime.sendMessage("pfiolkfpcemnmbbipejokihmdjopljbj", { reload: true }, function(response) {
        store.dispatch("setUpdateStatus", response.updateAvailable);
      });
    },

    reload() {
      location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.update-outer {
  &:focus > .update-area {
    background-color: rgba(2, 191, 165, 0.15);
    outline: 4px solid rgb(2, 191, 165);
  }
}
.update-outer {
  font-size: 11px;
  background-color: #eee;
  border-radius: 0 0 8px;
  padding: 3px 0;
  &:hover {
    background-color: rgb(222, 222, 222);
  }
}
</style>
