<template lang="pug">
  div
    NavbarMain(v-if="user")
    section.hero(v-else)
      .hero-body
        .container.is-fluid
          h1.title MOTTAKA?
          h2.subtitle.is-size-7 出かける前に、持ち物チェック。
    section.section.container.is-fluid(v-if="!isLoading")
      .columns.is-multiline
        .column.is-12(v-if="!user")
          ButtonGoogleLogin
        .column.is-12(v-if="user")
          .field
            .field.has-addons
              .control
                input.input(:class="{ 'is-loading' : isUpdating }" type="text" v-model="newItemName" placeholder="新しい持ち物")
              .control
                button.button.is-primary(@click="addNewItem")
                  i.fa.fa-plus
          .field
            button.button(@click="resetCheckboxes") すべてのチェックを外す
            hr
          .field(v-if="userItemCount == 0")
            span No items.
          .field(v-for="item in items || []")
            input.is-checkradio.is-block.is-success(type="checkbox" :id="'item-check-' + item.id" @change="checkboxChanged" :checked="item.checked" v-model="item.checked")
            label(:for="'item-check-' + item.id") {{ item.name }}
            a(:id="'item-remove-' + item.id" @click="removeButtonClicked").delete
</template>

<style scoped>
  pre {
    font-size: 75%;
    line-height: 105%;
    background-color: #fcfcfc;
    color: #888;
    border: solid 1px #eee;
  }
</style>

<script>
import ButtonGoogleLogin from '@/components/button-google-login.vue'
import NavbarMain from '@/components/navbar-main.vue'

import firebase from '@/plugins/firebase'
import auth from '@/plugins/auth'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  async mounted() {
    let user
    if (!this.user) {
      user = await auth()
    }
    this.setUser({ user : user || null })
    this.isLoading = false

    this.fetchUserInfo()
  },

  methods: {
    ...mapActions([ 'setUser', 'setUserInfo', 'setItems', 'removeItem', 'resetCheckAll' ]),

    fetchUserInfo() {
      if (this.user) {
        firebase.database().ref('users/' + this.user.uid + '/info').once('value')
          .then((snapshot) => {
            this.setUserInfo({ userInfo : {
              status: snapshot.val().status,
              statusTimestamp: snapshot.val().statusTimestamp,
              }
            })
          })
        firebase.database().ref('users/' + this.user.uid + '/items').once('value')
          .then((snapshot) => {
            let items = []
            for (let item in snapshot.val()) {
              items.push({ id: item, ...snapshot.val()[item] })
            }
            this.setItems({ items: items || [] })
          })
      }
    },

    async addNewItem() {
      if (this.newItemName == '') return;

      this.isUpdating = true

      // update firebase db
      const newItem = { name: this.newItemName, checked: false }
      const itemRef = await firebase.database().ref('users/' + this.user.uid + '/items').push()
      await itemRef.set(newItem)

      //update store
      let items = this.items
      items.push({ id: itemRef.key, ...newItem })
      this.setItems({ items: items })

      this.newItemName = '';

      this.isUpdating = false
    },

    async removeButtonClicked(event) {
      const key = event.target.id.replace(/^item-remove-/, '')
      if (key === '') return;

      this.removeItem({ key: key })

      const itemRef = firebase.database().ref('users/' + this.user.uid + '/items/' + key)
      await itemRef.remove()
    },

    async checkboxChanged(event) {
      const key = event.target.id.replace(/^item-check-/, '')
      if (key === '') return;

      const checkedRef = firebase.database().ref('users/' + this.user.uid + '/items/' + key + '/checked')
      await checkedRef.set(event.target.checked)
    },

    async resetCheckboxes() {
      const checkedItems = this.items.filter(item => { return item.checked })
      let updates = {}
      checkedItems.forEach(item => {
        updates['users/' + this.user.uid + '/items/' + item.id + '/checked'] = false
      })
      await firebase.database().ref().update(updates)

      this.resetCheckAll()
    },
  },

  components: {
    ButtonGoogleLogin,
    NavbarMain,
  },

  data() {
    return {
      isLoading: true,
      isUpdating: false,
      newItemName: '',
    }
  },

  computed: {
    ...mapState([ 'user', 'userInfo', 'items' ]),
    ...mapGetters([ 'userItemCount' ]),

  },
}
</script>