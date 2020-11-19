import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    copyright: '',
    pathComponents: []
  },
  mutations: {
    updateCopyright(state, payload) {
      state.copyright = payload.copyright;
    }
  },
  actions: {},
  modules: {
    user: user
  }
})
