<template>
  <div class="dropdown-outer" tabindex="0" aria-label="Want more emojis?" role="button">
    <a href="https://nod.rocks/emojis" target="_blank" class="dropdown-item" tabindex="-1">
      Want more emojis?
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.dropdown-outer {
  flex-basis: 100%;
  margin: 0 5px;
  border-radius: 8px;
  &:hover {
    background-color: #00796b0d;
  }
}
</style>
