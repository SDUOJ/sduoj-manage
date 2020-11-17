import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/iviewui';

Vue.config.productionTip = false;

Vue.prototype.$Message.config({
  duration: 3,
  top: 60
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
