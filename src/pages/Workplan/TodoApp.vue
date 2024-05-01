<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      class="elevation-1 rounded flex-shrink-0"
      :right="$vuetify.rtl"
      :class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
      width="240"
    >
      <todo-menu class="todo-app-menu pa-2" ></todo-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">{{ $t('menu.todo') }}</div>
      </v-toolbar>
      <router-view :key="$route.fullPath" class="flex-grow-1" ></router-view>
    </div>

  </div>
</template>

<script>
import TodoMenu from './components/TodoMenu'

export default {
  components: {
    TodoMenu
  },
  data() {
    return {
      drawer: null
    }
  },
  methods: {

  }
}
</script>
