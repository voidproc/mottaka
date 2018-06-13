import Vuex from 'vuex'
import Vue from 'vue'
import firebase from '@/plugins/firebase'

const store = () => new Vuex.Store({
  state: {
    user: null,
    userInfo: { status:null, statusTimestamp:null },
    items: [],
    sendingUserInfo: false,
  },

  getters: {
    userItemCount(state) {
      return state.items.length
    },
  },

  actions: {
    setUser({commit}, {user}) {
      if (!user) return;
      commit('setUser', user)
    },

    setUserInfo({commit}, {userInfo}) {
      commit('setUserInfo', userInfo)
    },

    setItems({commit}, {items}) {
      commit('setItems', items)
    },

    removeItem({commit}, {key}) {
      commit('removeItem', key)
    },

    resetCheckAll({commit}) {
      commit('resetCheckAll')
    },

    setSendingUserInfo({commit}, {isSending}) {
      commit('setSendingUserInfo', isSending)
    },

    async signOut({commit}) {
      await firebase.auth().signOut()
      commit('setUser', null)
      location.href = '/'
    }
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    },

    setUserInfo(state, payload) {
      state.userInfo = payload
    },

    setItems(state, items) {
      state.items = items
    },

    removeItem(state, key) {
      state.items = state.items.filter((item) => { return item.id != key })
    },

    resetCheckAll(state) {
      state.items.forEach(item => {
        item.checked = false
      })
    },

    setSendingUserInfo(state, payload) {
      state.sendingUserInfo = payload
    },
  }
})

export default store