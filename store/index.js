import Vuex from 'vuex'
import Vue from 'vue'
import firebase from '@/plugins/firebase'

const store = () => new Vuex.Store({
  state: {
    user: null,
    items: [],
    updating: false,
  },

  actions: {
    setUser({commit}, {user}) {
      if (!user) return;
      commit('setUser', user)
    },

    fetchItems({commit, state}) {
      if (!state.user) return

      firebase.database().ref('items/' + state.user.uid).once('value')
        .then((snapshot) => {
          let items = Object.keys(snapshot.val() || {}).map(key => { return { id: key, ...snapshot.val()[key] } })
          items.sort((a, b) => a.pos - b.pos)
          commit('setItems', items)
        })
    },

    setItems({commit}, {items}) {
      commit('setItems', items)
    },

    async addNewItem({commit, state}, {name}) {
      const newItem = { name: name, checked: false, pos: state.items.length }
      const itemRef = await firebase.database().ref('items/' + state.user.uid).push()
      await itemRef.set(newItem)

      let items = state.items
      items.push({ id: itemRef.key, ...newItem })
      commit('setItems', items)
    },

    async removeItem({commit, state}, {key}) {
      const itemRef = firebase.database().ref('items/' + state.user.uid + '/' + key)
      await itemRef.remove()
      commit('removeItem', key)
    },

    async renameItem({commit, state}, {key, name}) {
      const nameRef = firebase.database().ref('items/' + state.user.uid + '/' + key + '/name')
      await nameRef.set(name)
      commit('renameItem', { key: key, name: name })
    },

    async updateChecked({commit, state}, {key, checked}) {
      const checkedRef = firebase.database().ref('items/' + state.user.uid + '/' + key + '/checked')
      await checkedRef.set(checked)
    },

    async resetCheckAll({commit, state}) {
      const checkedItems = state.items.filter(item => item.checked)
      let updates = {}
      checkedItems.forEach(item => {
        updates['items/' + state.user.uid + '/' + item.id + '/checked'] = false
      })
      await firebase.database().ref().update(updates)

      commit('resetCheckAll')
    },

    async updateItemPos({commit, state}) {
      const oldPos = state.items.map(item => item.pos)
      commit('numberItemPos')

      const changedPosItems = state.items.filter((item, index) => { return oldPos[index] != item.pos })

      let updates = {}
      changedPosItems.forEach(item => {
        updates['items/' + state.user.uid + '/' + item.id + '/pos'] = item.pos
      })
      await firebase.database().ref().update(updates)
    },

    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },

    async signOut({commit}) {
      await firebase.auth().signOut()
      commit('setUser', null)
      location.href = '/'
    },

    setUpdating({commit}, {updating}) {
      commit('setUpdating', updating)
    }
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
    },

    setItems(state, items) {
      state.items = items
    },

    removeItem(state, key) {
      state.items = state.items.filter((item) => { return item.id != key })
    },

    renameItem(state, payload) {
      state.items.find(item => { return item.id == payload.key }).name = payload.name
    },

    resetCheckAll(state) {
      state.items.forEach(item => {
        item.checked = false
      })
    },

    numberItemPos(state) {
      state.items.forEach((item, index) => {
        item.pos = index
      })
    },

    setUpdating(state, value) {
      state.updating = value
    },
  }
})

export default store