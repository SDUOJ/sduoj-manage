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
