<template>
  <div class="dropdown-outer" tabindex="0" aria-label="Report an Issue" role="button">
    <div id="cutton-js"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.loadScript();
  },
  methods: {
    loadScript() {
      if (typeof window._bsa === "undefined") {
        return console.warn("Could not load Carbon Ads Text");
      }
      window._bsa.init("custom", "CE7IC2QL", "placement:nodrocks", {
        forceReload: true,
        target: "#cutton-js",
        template: `
          <label class="native-button" for="native-button" style="background-color: ##backgroundColor##; color: ##textColor##;"><img src="##image##" class="native-img">Sponsored by ##company##</label>
          <input type="checkbox" id="native-button">
          <div class="native-overlay" style="background-color: ##backgroundColor##; color: ##textColor##">
            <div class="native-banner">
              <img class="native-logo" src="##logo##">
              <div class="native-tagline">##tagline##</div>
              <div class="native-description">##description##</div>
              <div class="native-footer">
                <a href="##statlink##" class="native-cta" style="background-color: ##ctaBackgroundColor##; color: ##ctaTextColor##">##callToAction##</a>
              </div>
            </div>
          </div>`,
      });
    },
  },
};
</script>

<style lang="scss">
#cutton-js {
  padding: 5px;
  position: static;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#cutton-js .native-button {
  z-index: 100;
  display: flex;
  padding: 12px 15px;
  border-radius: 6px;
  box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.15);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-align: left;
  line-height: 1.2;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;

  user-select: none;
  justify-content: flex-start;
  align-items: center;
}

#cutton-js .native-img {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

#cutton-js .native-overlay {
  text-align: left;
  width: 250px;
  box-sizing: border-box;
  position: fixed;
  bottom: -335px;
  display: none;
  padding: 0px 20px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.15);
  opacity: 0;
  user-select: none;
  transition: transform 0.2s ease-in-out, opacity 0.1s ease-in-out;
  transform: scale(1) translateY(-50px);
}

#cutton-js #native-button:checked + .native-overlay {
  opacity: 1;
  display: flex;
  transition: transform 0.2s ease-in-out, opacity 0.4s ease-in-out;
  transform: scale(1) translateY(0);
}

#native-button {
  display: none;
}

#cutton-js .native-banner {
  line-height: 1.35;
  padding: 20px 0px;
}

#cutton-js .native-tagline {
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
}

#cutton-js .native-description {
  margin-bottom: 10px;
  font-size: 16px;
}

#cutton-js .native-footer {
  display: flex;
  margin-top: 15px;

  justify-content: flex-start;
  align-items: center;
}

#cutton-js .native-logo {
  width: 120px;
  height: auto;
  margin-bottom: 10px;
}

#cutton-js .native-cta {
  padding: 6px 8px;
  border-radius: 3px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 12px;
}
</style>
