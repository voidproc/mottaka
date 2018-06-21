<template lang="pug">
  .field
    div(v-if="noItems") No items.
    draggable(v-else v-model="items" @end="onEndDrag")
      .field(v-for="item in items || []")
        input.is-checkradio.is-block.is-success(type="checkbox" :id="'item-check-' + item.id" @change="checkboxChanged" :checked="item.checked" v-model="item.checked")
        label(:for="'item-check-' + item.id") {{ item.name }}
        a(:id="'item-remove-' + item.id" @click="removeButtonClicked").delete
        a(:id="'item-edit-' + item.id" @click="editButtonClicked") [edit]
    .modal(:class="{ 'is-active': showEditDialog }")
      .modal-background(@click="closeEditDialog")
      .modal-content
        .card
          .card-content
            .field
              label.label 新しい名前：
            .field
              .control
                input.input(type="text" v-model="newName" placeholder="新しい名前")
            .field.is-grouped
              .control
                button.button.is-primary(@click="renameButtonClicked")
                  i.fas.fa-check
                  | &nbsp;名前を変更
              .control
                button.button(@click="closeEditDialog") キャンセル
      .modal-close(@click="closeEditDialog")
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      showEditDialog: false,
      editItemKey: '',
      newName: ''
    }
  },

  computed: {
    items: {
      get() {
        return this.$store.state.items
      },
      set(value) {
        this.setItems({ items: value })
      }
    },

    noItems() {
      return !this.items || !this.items.length
    },
  },

  methods: {
    ...mapActions([
      'setItems',
      'removeItem',
      'renameItem',
      'updateChecked',
      'updateItemPos',
      'setUpdating'
    ]),

    async removeButtonClicked(event) {
      const key = event.target.id.replace(/^item-remove-/, '')
      if (key === '') return;

      this.setUpdating({ updating: true })
      await this.removeItem({ key: key })
      this.setUpdating({ updating: false })
    },

    async editButtonClicked(event) {
      const key = event.target.id.replace(/^item-edit-/, '')
      if (key === '') return;

      this.editItemKey = key
      this.newName = this.items.find(item => { return item.id == key }).name
      this.showEditDialog = true
    },

    closeEditDialog() {
      this.showEditDialog = false
    },

    async renameButtonClicked() {
      this.showEditDialog = false

      this.setUpdating({ updating: true })
      await this.renameItem({ key: this.editItemKey, name: this.newName })
      this.setUpdating({ updating: false })

      this.editItemKey = ''
      this.newName = ''
    },

    async checkboxChanged(event) {
      const key = event.target.id.replace(/^item-check-/, '')
      if (key === '') return;

      this.setUpdating({ updating: true })
      await this.updateChecked({ key: key, checked: event.target.checked })
      this.setUpdating({ updating: false })
    },

    async onEndDrag(event) {
      this.setUpdating({ updating: true })
      await this.updateItemPos()
      this.setUpdating({ updating: false })
    },
  },

  components: {
    draggable,
  },
};
</script>

<style scoped>
</style>
