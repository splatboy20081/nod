import Vue from "vue";
import App from "./App.vue";
import VueNativeSock from "vue-native-websocket";
import store from "./store/store";

Vue.config.productionTip = false;
Vue.use(VueNativeSock, "wss://j24amtdvi4.execute-api.us-east-1.amazonaws.com/prod", {
  format: "json"
});

new Vue({
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
