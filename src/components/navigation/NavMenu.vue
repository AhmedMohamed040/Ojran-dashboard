<template>
  <div>
    <!-- menu level 1  -->
    <div v-for="(level1Item, level1Index) in menu" :key="level1Index">

      <div v-if="hasPermissions(permission) || role == 'Admin'">
        <nav-menu-item v-if="hasPermissions(level1Item.permission)" :menu-item="level1Item">
          <template >
  
            <!-- menu level 2 -->
            <div v-for="(level2Item, level2Index) in level1Item.items" :key="level2Index">
              <div v-if="hasPermissions(level1Item.permission)">
                <nav-menu-item
                  v-if="hasPermissions(level2Item.permission)"
                  :menu-item="level2Item"
                  subgroup
                  small
                >
                  <template v-if="level2Item.items">
 
                    <!-- menu level 3 -->
                    <div v-for="(level3Item, level3Index) in level2Item.items" :key="level3Index">
                      <div v-if="hasPermissions(level2Item.permission)">
                        <nav-menu-item
                          v-if="hasPermissions(level3Item.permission)"
                          :menu-item="level3Item"
                          small
                        />
                      </div>
               
                    </div>
               
                  </template>
                </nav-menu-item>
              </div>
            
            </div>
          
          </template>
        </nav-menu-item>
      </div>
   
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NavMenuItem from './NavMenuItem'

export default {
  components: {
    NavMenuItem
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roles: null,
      permission: null
    }
  },
  computed: {
    ...mapState('Info', ['permissions']),
    ...mapState('Info', ['role'])
     
  },
  created() {
    this.changeValue()
  },
  methods: {
    changeValue() {
      this.roles = this.role
      this.permission = this.permissions
    },
    hasPermission(per) {
      if (this.role === 'Admin' || this.role === 'Agent' ) {
        return true
      } 

      return this.permission.some((item) => item.toLowerCase() === per.toLowerCase())
    },
    hasPermissions(permissions = this.permission) {
      if (this.role === 'Admin' || this.role === 'Agent') {
        return true
      }

      return permissions.some((p) => this.hasPermission(p))
    }
  }

}
</script>
