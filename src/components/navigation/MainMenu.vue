<template>
  <v-list nav dense>
    
    <div v-for="(item, index) in menu" :key="index">
      <div v-if="item.key || item.text" class="pa-1 mt-2 overline">{{ item.key ? $t(item.key) : item.text }}</div>
      <nav-menu :menu="item.items" />
    </div>
  </v-list>
</template>

<script>

import NavMenu from './NavMenu'
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
 
  components: {
    NavMenu 
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  
  computed: {
    ...mapState('Info', ['permissions']),
    ...mapState('Info', ['role'])

  },
  created() {
    this.storePermissions()
    
  },
  methods: {
    ...mapMutations('Info', ['setPermissions']),
    ...mapMutations('Info', ['setRole']),
    ...mapActions('Info', ['hasPermission']),
    ...mapActions('Info', ['hasPermissions']),
 
    storePermissions() {
      const role = localStorage.getItem('role')
      const permissions = JSON.parse(localStorage.getItem('permissions'))

      this.setRole(role)
      this.setPermissions(permissions)      
    }
    
  }
}
</script>
