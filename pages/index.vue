<template lang="pug">
  div(v-if="loaded")
    //- 上部ナビゲーションバー
    NavbarMain(v-if="user")

    //- タイトル（未ログイン時）
    section.hero(v-if="!user")
      .hero-body
        .container.is-fluid
          h1.title MOTTAKA?
          h2.subtitle.is-size-7 出かける前に、持ち物チェック。

    //- ログインボタン（未ログイン時）
    section.section(v-if="!user")
      .container.is-fluid
        .field
          ButtonGoogleLogin

    //- メイン
    section.section(v-if="user")
      .container.is-fluid
        //- アイテム追加コントロール
        .field
          InputAddNewitem
        //- リセットボタン
        .field
          ButtonResetChecked
        //- ----
        hr
        //- アイテム一覧
        ListCheckboxItems
        //- 更新中の表示
        .field(v-if="updating")
          div
            i.fas.fa-spinner.fa-pulse
            | &nbsp;Updating...
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
import InputAddNewitem from '@/components/input-add-newitem.vue'
import ButtonResetChecked from '@/components/button-reset-checked.vue'
import ListCheckboxItems from '@/components/list-checkbox-items.vue'
import NavbarMain from '@/components/navbar-main.vue'
import auth from '@/plugins/auth'
import { mapState, mapActions } from 'vuex'


export default {
  data() {
    return {
      loaded: false,
    }
  },

  computed: {
    ...mapState([ 'user', 'updating', 'items' ]),
  },

  async mounted() {
    let user
    if (!this.user) {
      user = await auth()
    }
    this.setUser({ user : user || null })
    this.loaded = true

    this.fetchItems()
  },

  methods: {
    ...mapActions([
      'setUser',
      'fetchItems',
    ]),

  },

  components: {
    ButtonGoogleLogin,
    InputAddNewitem,
    ButtonResetChecked,
    ListCheckboxItems,
    NavbarMain,
  },

}
</script>