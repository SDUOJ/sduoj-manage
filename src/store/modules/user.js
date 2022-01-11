/*
 * Copyright 2020-2022 the original author or authors.
 *
 * Licensed under the Affero General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/agpl-3.0.en.html
 */

import md5 from '@/utils/md5';

const state = {
  profile: {}
}

const getters = {
  profile: state => state.profile || {},
  username: state => state.profile.username || '',
  avatar: state => `https://www.gravatar.com/avatar/${md5(state.profile.email || '')}?s=200&d=mp&r=g`
}

const mutations = {
  setProfile: function (state, profile) {
    state.profile = profile;
  },
  clearProfile: function (state) {
    state.profile = {};
  }
}

const actions = {
  setProfile({ commit }, profile) {
    commit('setProfile', profile);
  },
  clearProfile({ commit }) {
    commit('clearProfile');
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
