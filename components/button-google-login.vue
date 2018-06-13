<template lang="pug">
  button.button.is-primary(@click="doSignIn")
    i.fab.fa-google
    | &nbsp;Login (Google Account)
</template>

<style scoped>
</style>

<script>
import signInWithRedirect from '@/plugins/signin'

export default {
  methods: {
    doSignIn() {
      signInWithRedirect()
    }
  }
}
</script>