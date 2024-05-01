import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import AdminLogin from './AdminLogin'
// Example Apps
import BoardModule from '../apps/board/store'
import EmailModule from '../apps/email/store'

Vue.use(Vuex)
const modules = {}
const delegateModules = {}
const context = require.context('@/store/modules', true)
const context2 = require.context('@/store/delegateModules', true)

context
  .keys()
  .map(context)
  .map((m) => m.default)
  .forEach((resource) => {
    modules[resource.name] = resource
  })

context2
  .keys()
  .map(context2)
  .map((m) => m.default)
  .forEach((resource) => {
    delegateModules[resource.name] = resource
  })
/**
 * Main Vuex Store
 */

const store = new Vuex.Store({
  modules: {
    app: AppModule,
    'board-app': BoardModule,
    'email-app': EmailModule,
    ...modules,
    ...delegateModules
  },

  ...AdminLogin
})

export default store
