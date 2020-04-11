<template>
  <div class="dropdown-outer" aria-label="Check for update" role="button">
    <div class="dropdown-item">
      <div class="tone-picker tone-picker-0" @click="setTone(0)" @keyup.enter="setTone(0)" tabindex="0" aria-label="Set default skin tone" role="button"></div>
      <div class="tone-picker tone-picker-1" @click="setTone(1)" @keyup.enter="setTone(1)" tabindex="0" aria-label="Set light skin tone" role="button"></div>
      <div class="tone-picker tone-picker-2" @click="setTone(2)" @keyup.enter="setTone(2)" tabindex="0" aria-label="Set medium-light skin tone" role="button"></div>
      <div class="tone-picker tone-picker-3" @click="setTone(3)" @keyup.enter="setTone(3)" tabindex="0" aria-label="Set medium skin tone" role="button"></div>
      <div class="tone-picker tone-picker-4" @click="setTone(4)" @keyup.enter="setTone(4)" tabindex="0" aria-label="Set medium-dark skin tone" role="button"></div>
      <div class="tone-picker tone-picker-5" @click="setTone(5)" @keyup.enter="setTone(5)" tabindex="0" aria-label="Set dark skin tone" role="button"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    setTone(number) {
      this.$store.dispatch("setTone", number);
      localStorage.setItem("nod-skinTone", number);
    }
  }
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
  padding: 10px 10px 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tone-picker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0 2px;
  border: 3px solid white;
  &:hover {
    border: 3px solid #00796b;
  }
  &:focus {
    border: 3px solid #00796b;
  }
  &-0 {
    background-color: #f8cc5c;
  }
  &-1 {
    background-color: #f7dbb8;
  }
  &-2 {
    background-color: #deb793;
  }
  &-3 {
    background-color: #d2a16a;
  }
  &-4 {
    background-color: #bb9065;
  }
  &-5 {
    background-color: #80654d;
  }
}
</style>
