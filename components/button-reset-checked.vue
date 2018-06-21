<template lang="pug">
  .control
    button.button(@click="resetCheckboxes") すべてのチェックを外す
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([ 'resetCheckAll', 'setUpdating' ]),

    async resetCheckboxes() {
      this.setUpdating({ updating: true })
      await this.resetCheckAll()
      this.setUpdating({ updating: false })
    },
  }
};
</script>

<style scoped>
</style>
