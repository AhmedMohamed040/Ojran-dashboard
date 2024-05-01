import axios from '../axios'
import swal from 'sweetalert'
import i18n from '../plugins/vue-i18n'
import router from '../router'

export default {
  state() {
    return {
      token: null || localStorage.getItem('token'),
      didLogOut: false,
      error: null,
      email: null,
      resetToken: null
    }
  },
  mutations: {
    setAdmin(state, payload) {
      state.token = payload.idToken
      state.didLogOut = false
    },
    setError(state, payload) {
      state.error = payload
    },
    setEmail(state, payload) {
      state.email = payload
    },
    setResetToken(state, payload) {
      state.resetToken = payload
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      const data = new FormData()

      data.append('Username', email)
      data.append('Password', password)
      const response = await axios
        .post('/api/v1/admin/auth/signin', data)
        .catch((error) => {
          let message = ''

          message = error.response.data.message

          swal(i18n.t('common.error'), message, 'error')
          throw error
        })

      if (response.status === 401) {
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
        alert('Invalid username or password')
      }
      if (response.status === 200) {
        const dataResponse = response.data.model.tokens

        localStorage.setItem('token', dataResponse.accessToken)
        localStorage.setItem('lang', 'ar-SA')
        localStorage.setItem('displayLang', 'ar')
        localStorage.setItem('isRTL', 'true')
        localStorage.setItem('role', response.data.model.role.name)
        localStorage.setItem(
          'permissions',
          JSON.stringify(response.data.model.permissions)
        )
        localStorage.setItem(
          'passwordChangeCount',
          response.data.model.user.passwordChangeCount
        )
        commit('setAdmin', {
          idToken: dataResponse.accessToken
        })

        commit('setError', null)
      } else {
        commit('setError', response.data.message)
      }
    },

    async autoLogin({ commit }) {
      const token = localStorage.getItem('token')

      if (!token) {
        return
      } else {
        commit('setAdmin', {
          idToken: token,
          didLogOut: false
        })
      }
    },
    forgetPassword({ commit }, email) {
      const formData = new FormData()

      formData.append('Email', email)

      return axios
        .post('/api/v1/admin/auth/email/reset-password-and-send-otp', formData)
        .then((response) => {
          return response
        })
        .catch((error) => {
          console.log(error)
          let message = ''

          message = error.response.data.message

          swal(i18n.t('common.error'), message, 'error')
          throw error
        })
    },
    checkOTPForResetPassword({ commit }, { email, otp }) {
      const formData = new FormData()

      formData.append('Email', email)
      formData.append('Otp', otp)

      return axios
        .post('/api/v1/admin/auth/email/verify-reset-password', formData)
        .then((response) => {
          commit('setEmail', email)
          commit('setResetToken', response.data.model.token)

          return response
        })
        .catch((error) => {
          let message = ''

          message = error.response.data.message

          swal(i18n.t('common.error'), message, 'error')
          throw error
        })
    },
    resetPassword({ commit }, obj) {
      const formData = new FormData()

      formData.append('Email', obj.email)
      formData.append('Password', obj.password)
      formData.append('Token', obj.token)

      return axios
        .post('/api/v1/admin/auth/email/reset-new-password', formData)
        .then((response) => {
          return response
        })
        .catch((error) => {
          let message = ''

          message = error.response.data.message

          swal(i18n.t('common.error'), message, 'error')
          throw error
        })
    }
    // async logout({ commit }) {

    // },
  },
  getters: {
    getEmail(state) {
      return state.email
    },
    getResetToken(state) {
      return state.resetToken
    },

    isAuthenticated(state) {
      return state.token !== null
    },
    getErrorMessage(state) {
      return state.error
    }
  }
}
