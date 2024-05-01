/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: {
    PageNumber: 1,
    pageSize: 6
  },
  last_page: 0,
  Moderators: [],
  Moderator: {},
  permissions: [],
  moderatorStatus: [],
  customers: [],
  customer: [],
  selectedPermissions: [],
  Bills: [],
  CountriesList: [],
  RegionsList: [],
  CitiesList: []

}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getCustomers: (state) => state.customers,
  getCustomer: (state) => state.customer,
  getModeratorsList: (state) => state.Moderators,
  getModerator: (state) => state.Moderator,
  getPermissionsList: (state) => state.permissions,
  getModeratorStatus: (state) => state.moderatorStatus,
  getSelectedPermissions: (state) => state.selectedPermissions,
  getBillsList: (state) => state.Bills,
  getRegionsList: (state) => state.RegionsList,
  getCountriesList: (state) => state.CountriesList,
  getCitiesList: (state) => state.CitiesList,

}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setCustomer(state, payload) {
    state.customer = payload
  },
  setCustomers(state, payload) {
    state.customers = payload
  },
  setModeratorsList(state, payload) {
    state.Moderators = payload
  },
  setModerator(state, payload) {
    state.Moderator = payload
  },
  setPermissionsList(state, payload) {
    state.permissions = payload
  },
  setModeratorStatus(state, payload) {
    state.moderatorStatus = payload
  },
  setSelectedPermissions(state, payload) {
    state.selectedPermissions = payload
  },
  setBillsList(state, payload) {
    state.Bills = payload
  },

  setRegionsList(state, payload) {
    state.RegionsList = payload
  },
  setCountriesList(state, payload) {
    state.CountriesList = payload
  },
  setCitiesList(state, payload) {
    state.CitiesList = payload
  },
}
const actions = {
  fetchModerators({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/managers`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setModeratorsList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchCustomers({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/users`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setCustomers', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },

  fetchCustomer({ commit }, id) {
    return axios.get(`api/v1/admin/users/${id}`).then((response) => {
      commit('setCustomer', response.data.model)
      return response
    })
  },
  changeUserStatus({commit}, item) {
    const fromData = new FormData();
    fromData.append('status', item.status);
    return axios.put(`/api/v1/admin/users/update-status/${item.id}`, fromData).then((res) => {
      commit('setCustomer', res.data.model)
      return res
    })

  },
  fetchBills({ commit }, searchObj) {
    return axios
      .get(
        `/api/v1/admin/bills?UserId=${searchObj.UserID}&DateFrom=${searchObj.DateFrom}&DateTo=${searchObj.DateTo}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setBillsList', response.data.model)
        commit('setLastPage', response.data.model.payments.totalPages)

        return response
      })
  },

  fetchModerator({ commit }, id) {
    return axios.get(`/api/v1/admin/managers/${id}`).then((response) => {
      commit('setModerator', response.data.model)
      return response
    })
  },
  fetchPermissionsList({ commit }) {
    return axios.get(`/api/v1/admin/managers/permissions`).then((response) => {
      commit('setPermissionsList', response.data.model)
      return response
    })
  },
  postModerator({ commit }, item) {
    let formData = new FormData()
    formData.append('Username', item.userName)
    formData.append('Name', item.name)
    formData.append('Phone', item.phone)
    formData.append('Email', item.email)
    formData.append('Password', item.password)
    for (let i = 0; i < item.permissions.length; i++) {
      formData.append('Permissions[' + i + ']', item.permissions[i])
    }
    return axios
      .post(`/api/v1/admin/managers/register`, formData)
      .then((response) => {
        return response
      })
      .catch((err) => {
        return err;
       // swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  ubdateModerator({ commit }, item) {
    let formData = new FormData()
    formData.append('UserId', item.UserId)
    for (let i = 0; i < item.permissions.length; i++) {
      formData.append('Permissions[' + i + ']', item.permissions[i])
    }
    return axios
      .put(`/api/v1/admin/managers/assign-permissions`, formData)
      .then((response) => {
        commit('setModerator', response.data.model)
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
  changeModeratorStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('UserId', item.UserId)
    formData.append('IsActive', item.IsActive)
    return axios
      .put(`/api/v1/coop/moderators/ChangeStatus`, formData)
      .then((response) => {
        commit('setModeratorStatus', response.data.model)
        return response
      })
  },
 /*  updataPermissions() {
    let formData = new FormData()
    formData.append('UserId', item.UserId)
    return axios
      .put(`/api/v1/admin/managers/assign-permissions`, formData)
      .then((response) => {
        commit('getPermissionsList', response.data.model)
        console.log(response.data.model);
        return response
      })
  }, */
  postCommission(_, payload) {
    // console.log(payload);
    return axios
      .post(`/api/v1/admin/agents/commission-types`, payload)
      .then((response) => {
        console.log(response);
        swal(i18n.t('common.operationSuccessful'), response.data.message, 'success')
      })
  },

  // Country CRUD
  fetchCountries({ commit }) {
    return axios.get(`/api/v1/admin/countries`, { params: { pageSize: 100000,} }).then((response) => {
      commit('setCountriesList', response.data.model)
      return response
    })
  },

  // Region CRUD
  fetchRegions({ commit }, data) {
    return axios.get(`/api/v1/admin/regions`, { params: { pageSize: 100000, CountryId: data.country } }).then((response) => {
      commit('setRegionsList', response.data.model)
      return response
    })
  },

  // City CRUD
  fetchCities({ commit }, data) {
    return axios.get(`/api/v1/admin/cities`, { params: { pageSize: 100000, CountryId: data.country, RegionId: data.region,} }).then((response) => {
      commit('setCitiesList', response.data.model)
      return response
    })
  },
}

export default {
  namespaced: true,
  name: 'Moderators',
  state,
  getters,
  actions,
  mutations
}
