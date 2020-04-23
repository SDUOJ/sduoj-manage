import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "./css/reset.css";
import "./css/element-variables.scss";
import "./css/global.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.$error = (msg) => {
  Vue.prototype.$message({ 'message': msg, 'type': 'error' })
}

Vue.prototype.$warning = (msg) => {
  Vue.prototype.$message({ 'message': msg, 'type': 'warning' })
}

Vue.prototype.$success = (msg) => {
  if (!msg) {
    Vue.prototype.$message({ 'message': 'Succeeded', 'type': 'success' })
  } else {
    Vue.prototype.$message({ 'message': msg, 'type': 'success' })
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
