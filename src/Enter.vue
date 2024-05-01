<template>
  <v-app>
    <router-view></router-view>
    <loading></loading>
  </v-app>
</template>

<script>
import Loading from './Loading.vue'

export default {
  name: 'Enter',
  components: { Loading },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuthenticated(val) {
      if (val) {
        this.$router.replace('/')
      }
    }
  },
  created() {
    this.$store.dispatch('autoLogin')
  }
}
</script>

<style></style>
