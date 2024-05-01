/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Delegates: [],
  Delegate: {},
  DelegateStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getDelegateList: (state) => state.Delegates,
  getDelegate: (state) => state.Delegate,
  getDelegateStatus: (state) => state.DelegateStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setDelegateList(state, payload) {
    state.Delegates = payload
  },
  setDelegate(state, payload) {
    state.Delegate = payload
  },
  setDelegateStatus(state, payload) {
    state.DelegateStatus = payload
  }
}
const actions = {
  fetchDelegates({ state, commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/agents`, { params: { ...state.filter, ...searchParams } })
      .then((response) => {
        commit('setDelegateList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchDelegate({ commit }, id) {
    return axios.get(`/api/v1/admin/agents/${id}`).then((response) => {
      commit('setDelegate', response.data.model)
      return response
    })
  },
  postDelegate({ commit }, item) {
    let formData = new FormData()
    formData.append('Name', item.Name)
    formData.append('Username', item.Username)
    formData.append('Phone', item.Phone)
    formData.append('Email', item.Email)
    formData.append('Address', item.Address)
    formData.append('NationalityId', item.NationalityId)
    formData.append('IdentityType', item.IdentityType)
    formData.append('IdentityNumber', item.IdentityNumber)
    formData.append('CommissionType.NameAr', item.CommissionType.NameAr)
    formData.append('CommissionType.NameEn', item.CommissionType.NameEn)
    formData.append('CommissionType.StartAt', item.CommissionType.StartAt)
    formData.append('CommissionType.Period', item.CommissionType.Period)
    formData.append(
      'CommissionType.SalesTarget',
      item.CommissionType.SalesTarget
    )
    formData.append(
      'CommissionType.RevenueTarget',
      item.CommissionType.RevenueTarget
    )
    formData.append(
      'CommissionType.SalesPercent',
      item.CommissionType.SalesPercent
    )
    formData.append(
      'CommissionType.RevenuePercent',
      item.CommissionType.RevenuePercent
    )
    formData.append('CountryId', item.CountryId)
    formData.append('RegionId', item.RegionId)
    formData.append('WorkingCityId', item.WorkingCityId)
    return axios
      .post(`/api/v1/admin/agents`, formData)
      .then((response) => {
        commit('setDelegate', response.data)
        swal(
          i18n.t('users.delegateCreatedSuccessfully'),
          response.data.message,
          'success'
        )
      }).catch(({ response }) => {
        let arr = []
        console.log(response);
        for (let i = 0; i < Object.keys(response.data).length; i++) {
          arr.push(Object.values(response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n'), 'error')
      })
  },
  changeDelegateStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('status', item.status)
    return axios
      .put(`/api/v1/admin/agents/${item.id}/update-status`, formData)
      .then((response) => {
        commit('setDelegateStatus', response.data.model)
        return response
      })
  },
  deleteDelegate({ commit }, id) {
    return axios.delete(`/api/v1/admin/agents/${id}`)
    // .then(({response}) => {
    //   commit('setDelegate', response.data.model)
    //   return response
    // })
  },

  updateDelegate({commit}, data) {
    let formData = new FormData()
    formData.append('Name', data.name)
    formData.append('Username', data.userName)
    formData.append('Phone', data.phone)
    formData.append('Address', data.address)
    formData.append('IdentityType', data.IdentityType)
    formData.append('IdentityNumber', data.IdentityNumber)
    formData.append('CountryId', data.country)
    formData.append('RegionId', data.region)
    formData.append('WorkingCityId', data.city)
    return axios
      .put(`/api/v1/admin/agents/${data.id}/update-data`, formData)
      .then((response) => {
        commit('setDelegate', response.data)
        swal(
          i18n.t('users.delegateEditedSuccessfully'),
          response.data.message,
          'success'
        )
      }).catch(({ response }) => {
        let arr = []
        console.log(response);
        for (let i = 0; i < Object.keys(response.data).length; i++) {
          arr.push(Object.values(response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n'), 'error')
      })
  },
}

export default {
  namespaced: true,
  name: 'Delegates',
  state,
  getters,
  actions,
  mutations
}
