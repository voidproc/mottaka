<template lang="pug">
  .field.has-addons
    .control
      input.input(type="text" v-model="newItemName" placeholder="新しい持ち物")
    .control
      button.button.is-primary(@click="addButtonClicked")
        i.fa.fa-plus
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      newItemName: ''
    };
  },

  methods: {
    ...mapActions([ 'addNewItem', 'setUpdating' ]),

    async addButtonClicked() {
      if (this.newItemName === '') return;

      this.setUpdating({ updating: true })
      await this.addNewItem({ name: this.newItemName })
      this.newItemName = '';
      this.setUpdating({ updating: false })
    },
  }
};
</script>

<style scoped>
</style>
