/*
 * Copyright 2020-2021 the original author or authors.
 *
 * Licensed under the General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 */

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
