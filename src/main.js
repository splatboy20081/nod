import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import VueGtag from "vue-gtag";
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: "https://www.nodws.co.uk",
  })
);

// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: "http://localhost:3000",
//   })
// );

Vue.use(VueGtag, {
  config: { id: "UA-162154532-1" },
  disableScriptLoad: true,
});

new Vue({
  store,
  render: function(h) {
    return h(App);
  },
}).$mount("#app");
