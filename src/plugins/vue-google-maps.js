import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

import config from '../configs'

const { key } = config.maps

/**
 * Vue Google Maps plugin
 * https://github.com/Jeson-gk/vue2-google-maps
 */
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB39oFpK83p5jROzG4SyS7cFGjYZb0L4G4',
    libraries: 'places'
  }
})
