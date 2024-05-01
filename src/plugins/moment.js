import Vue from 'vue'
import moment from 'moment'
import 'moment/min/moment-with-locales'
import i18n from './vue-i18n'

/**
 * Date library momentjs
 * https://momentjs.com/
 */
Vue.prototype.$moment = moment

const locale = () => {
  if (i18n.locale === 'en') {
    return moment.locale('en')
  }
  if (i18n.locale === 'ar') {
    return moment.locale('ar')
  }

}

locale()
