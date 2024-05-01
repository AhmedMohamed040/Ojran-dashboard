import store from './store'
import Axios from 'axios'
import router from './router'
import i18n from '../src/plugins/vue-i18n'

import swal from 'sweetalert'
const axios = Axios.create({
  baseURL: 'https://api.ojran.sa/',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('lang')
  }
})

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  // store.state.token
  config.headers.Authorization = token ? 'Bearer ' + token : ''

  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const checkToken = async () => {
      const originalRequest = error?.config
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      // if (error.response.status === 500) {
      //   //
      // } else if ([401].includes(error.response.status)) {
      //login message
      /*   !(
          `${error.config?.headers?.Authorization}`.trim() == `Bearer ${store.state.token}`.trim()
        ) */
      try {
        // Send a request to check the token validity
        if (role === 'Agent') {
          await axios.get('/api/v1/agent/work-plans')
        } else {
          await axios.get('api/v1/admin/settings/get-group/TAX')
        }
      } catch (arr) {
        // If the token is invalid, handle the error accordingly
        console.log('Token is invalid')
        // Redirect to login or perform any other action

        store.commit('setAdmin', { idToken: null })
        const logOut = new Promise((resolve, reject) => {
          swal({
            title: i18n.t('login.AnErrorOccurredPleaseLoginAgain'),
            icon: 'error'
          })
            .then((value) => {
              if (value) {
                resolve()
                router.replace('/auth/signin')
                localStorage.clear()

                history.pushState(null, null, null)
                window.addEventListener('popstate', () => {
                  history.pushState(null, null, null)
                })
              } else {
                reject(new Error('User canceled the swal dialog'))
              }
            })
            .catch((error) => {
              reject(error)
            })
        })

        return axiosInstance(originalRequest)
      }

      return Promise.reject(arr)
    }

    return Promise.reject(error)
    // }
  }
)
export default axios
