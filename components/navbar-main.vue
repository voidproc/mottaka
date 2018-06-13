<template lang="pug">
  nav.navbar
    .navbar-brand
      span.navbar-item
        span.navbar-brand-title.has-text-primary.has-text-weight-bold.is-size-5
          i.fas.fa-clipboard-check
          | &nbsp;MOTTAKA?
      .navbar-burger.burger(@click="navbarActive = !navbarActive" v-bind:class="{ 'is-active': navbarActive }")
        span
        span
        span
    .navbar-menu(v-bind:class="{ 'is-active': navbarActive }")
      .navbar-start
        a.navbar-item(href="./#").has-text-grey
          i.fas.fa-home
          span.has-text-weight-bold HOME
        a.navbar-item(href="./#").has-text-grey
          i.fas.fa-info-circle
          span.has-text-weight-bold ABOUT
        a.navbar-item(href="./#" @click="signOut").has-text-grey
          i.fas.fa-sign-out-alt
          span.has-text-weight-bold LOGOUT
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      navbarActive: false
    };
  },
  methods: {
    ...mapActions([ 'signOut' ])
  }
};
</script>

<style scoped>
.navbar-brand-title {
}
</style>
