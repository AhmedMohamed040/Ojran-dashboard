/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  RequestTypes: [],
  RequestType: {},
  RequestTypeStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getRequestTypesList: (state) => state.RequestTypes,
  getRequestType: (state) => state.RequestType,
  getRequestTypeStatus: (state) => state.RequestTypeStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setRequestTypesList(state, payload) {
    state.RequestTypes = payload
  },
  setRequestType(state, payload) {
    state.RequestType = payload
  },
  setRequestTypeStatus(state, payload) {
    state.RequestTypeStatus = payload
  }
}
const actions = {
  fetchRequestTypes({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/merchants/request-types`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setRequestTypesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateRequestType({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null

    return axios
      .post(`/api/v1/admin/merchants/request-types/${id}`, formData)
      .then((response) => {
        commit('setRequestType', response.data.model)
        swal(
          i18n.t('RequestType.RequestTypeUpdatedSuccessfully'),
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
  postRequestType({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    return axios
      .post(`/api/v1/admin/merchants/request-types`, formData)
      .then((response) => {
        commit('setRequestType', response.data.model)
        swal(
          i18n.t('RequestType.RequestTypeCreatedSuccessfully'),
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
  changeRequestTypeStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(
        `/api/v1/admin/merchants/request-types/${id}/change-status`,
        formData
      )
      .then((response) => {
        commit('setRequestTypeStatus', response.data.model)
        return response
      })
  },
  deleteRequestType({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/merchants/request-types/${id}`)
      .then((response) => {
        commit('setRequestType', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'SourceIntroduction',
  state,
  getters,
  actions,
  mutations
}
