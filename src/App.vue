<template>
  <v-app>
    <!-- Layout component -->
    <component :is="currentLayout" v-if="isRouterLoaded">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </component>

    <v-snackbar
      v-model="toast.show"
      :timeout="toast.timeout"
      :color="toast.color"
      bottom
    >
      {{ toast.message }}
      <v-btn
        v-if="toast.timeout === 0"
        color="white"
        text
        @click="toast.show = false"
        >{{ $t('common.close') }}</v-btn
      >
    </v-snackbar>

    <!-- Demo customization menu -->
    <!-- <customization-menu /> -->
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

// Demo Menu
// import CustomizationMenu from './components/demo/CustomizationMenu'

import config from './configs'

// Layouts
import defaultLayout from './layouts/DefaultLayout'
import landingLayout from './layouts/LandingLayout'
import simpleLayout from './layouts/SimpleLayout'
import authLayout from './layouts/AuthLayout'
import errorLayout from './layouts/ErrorLayout'

/*
|---------------------------------------------------------------------
| Main Application Component
|---------------------------------------------------------------------
|
| In charge of choosing the layout according to the router metadata
|
*/
export default {
  components: {
    // CustomizationMenu,
    defaultLayout,
    landingLayout,
    simpleLayout,
    authLayout,
    errorLayout
  },
  computed: {
    ...mapState('app', ['toast']),
    isRouterLoaded: function () {
      if (this.$route.name !== null) return true

      return false
    },
    currentLayout: function () {
      const layout = this.$route.meta.layout || 'default'

      return layout + 'Layout'
    }
  },
  head: {
    link: [
      // adds config/icons into the html head tag
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  }
}
</script>

<style scoped>
/**
 * Transition animation between pages
 */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
<style>
.v-messages__message {
    line-height: 14px;
    font-size: 14px;
}
</style>
