<template>
  <div class="dropdown">
    <NotificationsButton />
    <UpdateButton />

    <div class="kCtYwe" role="separator"></div>

    <div class="dropdown-outer" tabindex="0" aria-label="Report an Issue" role="button">
      <a href="https://airtable.com/shrL7FB5kQh4uOYj4" target="_blank" class="dropdown-item" tabindex="-1">
        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" class="settings-icon">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12z"></path>
          <path d="M11 12h2v2h-2zm0-6h2v4h-2z"></path>
        </svg>
        Report an Issue
      </a>
    </div>
    <div class="dropdown-outer" tabindex="0" aria-label="Buy me a coffee" role="button">
      <a href="https://www.buymeacoffee.com/jamiec" target="_blank" class="dropdown-item" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="settings-icon">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
        </svg>
        Want to support Nod?
      </a>
    </div>
  </div>
</template>

<script>
import NotificationsButton from "./NotificationsButton";
import UpdateButton from "./UpdateButton";
export default {
  components: {
    NotificationsButton,
    UpdateButton,
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: fixed;
  top: 48px;
  left: 0;
  background-color: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 8px 0;
  width: 240px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 6px 6px 2px rgba(60, 64, 67, 0.149);
  padding-bottom: 10px;
}

.dropdown-outer {
  &:focus > .dropdown-item {
    background-color: rgba(2, 191, 165, 0.15);
    outline: 4px solid rgb(2, 191, 165);
  }
}

.dropdown-item {
  padding: 5px 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  color: #5f6368;
  &:hover {
    background-color: #00796b0d;
  }
}

.settings-icon {
  margin-right: 10px;
  fill: #3c4043;
}
</style>
