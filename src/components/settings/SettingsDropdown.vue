<template>
  <div class="dropdown">Settings</div>
</template>

<script>
export default {};
</script>

<style scoped>
.dropdown {
  position: fixed;
  top: 48px;
  left: 0;
  background-color: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 8px 0;
  width: 240px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 6px 6px 2px rgba(60, 64, 67, 0.149);
  padding: 20px 0;
}

*:focus {
  background-color: rgba(2, 191, 165, 0.15);
  outline: #00bfa5 solid 4px !important;
}
</style>
