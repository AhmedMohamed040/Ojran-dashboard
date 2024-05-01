/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
const state = {
  user: {},
  password: {},
  email: {},
  phone: {},
  role: {},
  permissions: [],
  notifications: [],
  filter: {
    PageSize: 5,
    PageNumber: 1,
    },
  last_page: 0,
  notificationStatus: {},

}

const getters = {

  getUser: (state) => state.user,
  getPassword: (state) => state.password,
  getEmail: (state) => state.email,
  getPhone: (state) => state.phone,
  getRole: (state) => state.role,
  getPermissions: (state) => state.permissions,
  getNotifications: (state) => state.notifications,
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  geNotificationStatus: (state) => state.notificationStatus,



}
const mutations = {

  setUser: (state, payload) => {
    state.user = payload
  },
  setPassword: (state, payload) => {
    state.password = payload
  },
  setEmail: (state, payload) => {
    state.email = payload
  },
  setPhone: (state, payload) => {
    state.phone = payload
  },
  setRole: (state, payload) => {
    state.role = payload
  },
  setPermissions: (state, payload) => {
    state.permissions = payload
  },
  setNotifications: (state, payload) => {
    state.notifications = payload
  },
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setNotificationStatus(state, payload) {
   state.setNotificationStatus
  }
}
const actions = {
  fetchUser: ({ commit }) => {
    return axios.get(`/api/v1/admin/auth/pe/my-info`).then((response) => {
      console.log(response.data.model)
      commit('setUser', response.data.model)
      //to implement set permissions

      return response
    })
  },
  ubdateUser: ({ commit }, item) => {
    let formData = new FormData()
    item.user.name ? formData.append('Name', item.user.name) : null
    item.ProfileImage ? formData.append('Image', item.ProfileImage) : null
    return axios
      .post(`/api/v1/admin/auth/pe/update-info`, formData)
      .then((response) => {
        swal(
          i18n.t('login.profileImageSuccessfullyUpdated'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  changePassword: ({ commit }, obj) => {
    let formData = new FormData()
    formData.append('CurrentPassword', obj.oldPassword)
    formData.append('NewPassword', obj.newPassword)
    return axios
      .post(`/api/v1/admin/auth/ChangePassword`, formData)
      .then((response) => {
        commit('setPassword', response.data.model)
        swal(
          i18n.t('login.passwordSuccessfullyUpdated'),
          response.data.message,
          'success'
        ),
          localStorage.setItem('passwordChangeCount', 1)
        return response
      })
      .catch((err) => {
        let arr = []
        if (err.response.data.errors!= undefined)
        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        console.log(err.response.data)

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
        return err;
      })
  },
  changeEmail: ({ commit }, Email) => {
    let formData = new FormData()
    formData.append('Email', Email)
    return axios
      .post(`/api/v1/admin/auth/pe/update-email`, formData)
      .then((response) => {
        commit('setEmail', response.data.model)
        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  changePhone: ({ commit }, Phone) => {
    let formData = new FormData()
    formData.append('Phone', Phone)
    return axios
      .post(`/api/v1/admin/auth/pe/update-phone`, formData)
      .then((response) => {
        commit('setPhone', response.data.model)
        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  verifyMyEmail: ({ commit }, Email) => {
    let formData = new FormData()
    formData.append('Email', Email.user.email)
    formData.append('OTP', Email.otp)
    return axios
      .post(`/api/v1/admin/auth/pe/verify-email`, formData)
      .then((response) => {
        commit('setEmail', response.data.model)
        swal(
          i18n.t('login.emailSuccessfullyverifyed'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  verifyMyPhone: ({ commit }, Phone) => {
    let formData = new FormData()
    formData.append('Phone', Phone.user.phone)
    formData.append('OTP', Phone.otp)
    return axios
      .post(`/api/v1/admin/auth/pe/verify-phone`, formData)
      .then((response) => {
        commit('setPhone', response.data.model)
        swal(
          i18n.t('login.phoneSuccessfullyverifyed'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },

  hasPermission({ state }, permission){
    console.log(permission, '1')
    if(state.role && state.role.name === 'Admin') {
      return true;
    }
    return state.permissions.some((item)=> item.toLowerCase() === permission.toLowerCase());

  },
 hasPermissions({dispatch, state}, permissions){
  console.log(permissions, '2')
  if(state.role && state.role.name === 'Admin') {
    return true;
  }
  return permissions.some( (per) => {
    dispatch('hasPermission', per);
  })
 },
 allNotifications({state, commit}, item) {
  console.log(item)
    return axios.get(`/api/v1/notification`, { params: {...state.filter } })
    .then((response) => {
      commit('setNotifications', response.data.model)
      commit('setLastPage', response.data.totalPages)

      return response
    })

 },
 // Put Carousel Status

 changeNotificationStatus({ commit }, item) {
  let options = {
    method: 'PUT',
    url: `/api/v1/notification/toggle/${item.id}`,
    headers: {
        'content-type': 'application/json',
    },
    data:
        {
          "read": item.read,
        },
  };
  return axios
  .request(options)
  .then(function (response) {
      commit('setNotificationStatus', response.data.model)

  })
},

changeNotificationsStatus({commit}){

  return axios.put('/api/v1/notification/read-all').then((response) => {

      return response
    })

}

}

export default {
  namespaced: true,
  name: 'Info',
  state,
  getters,
  actions,
  mutations
}
