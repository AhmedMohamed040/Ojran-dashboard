<template>
  <div>
    <v-row
      v-for="list in getPermissionsList"
      :key="list.name"
      :value="list"
      class="flex-column pl-2 pr-2 justify-space-between"
    >
      <v-col sm="12" md="12">
        <h4 class="primary--text font-weight-regular">
          {{ $t(`Permissions.${list.name}`) }}
        </h4>
      </v-col>
      <v-col
        class="d-flex flex-row align-center justify-space-around flex-wrap pa-0 no-gutters"
        sm="12"
        md="9"
        xl="12"
      >
        <v-checkbox
          v-for="(checkbox, index) in list.children"
          :key="index"
          v-model="permissions"
          :input-value="checkbox.name"
          :value="checkbox.name"
          :label="
            $t(
              'PermissionsList' +
                checkbox.name.slice(checkbox.name.indexOf('.'))
            )
          "
        ></v-checkbox>
      </v-col>
      <v-divider class="mb-1"></v-divider>
    </v-row>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    selectedPermissions: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      tab: null,
      permissions: []
    }
  },
  computed: {
    ...mapGetters('Moderators', ['getPermissionsList'])
  },
  watch: {
    permissions() {
      this.$emit('addPermissions', this.permissions)
    }
  },
  mounted() {
    this.fetchPermissions().finally(() => {
      this.defaultSelected()
    })
    console.log(this.selectedPermissions)
    this.permissions = this.selectedPermissions || []
    console.log(this.permissions)
  },
  methods: {
    ...mapActions('Moderators', ['fetchPermissionsList']),
    defaultSelected() {
      if (this.selectedPermissions.length === 0)
        for (let e = 0; this.getPermissionsList.length > e; e++) {
          for (let i = 0; this.getPermissionsList[e].children.length > i; i++) {
            this.permissions.unshift(
              this.getPermissionsList[e].children[i].name
            )
          }
        }
    },
    async fetchPermissions() {
      const f = await this.fetchPermissionsList()
    }
  }
}
</script>
<style scoped>
</style>
