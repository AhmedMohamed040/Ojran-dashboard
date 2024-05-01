/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  QuantityUnits: [],
  QuantityUnit: {},
  QuantityUnitStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getQuantityUnitList: (state) => state.QuantityUnits,
  getQuantityUnit: (state) => state.QuantityUnit,
  getQuantityUnitStatus: (state) => state.QuantityUnitStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setQuantityUnitList(state, payload) {
    state.QuantityUnits = payload
  },
  setQuantityUnit(state, payload) {
    state.QuantityUnit = payload
  },
  setQuantityUnitStatus(state, payload) {
    state.QuantityUnitStatus = payload
  }
}
const actions = {
  fetchQuantityUnits({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/quantity-units`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setQuantityUnitList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateQuantityUnit({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.QuantityFill
      ? formData.append('QuantityFill', item.QuantityFill)
      : null

    return axios
      .post(`/api/v1/admin/quantity-units/${id}`, formData)
      .then((response) => {
        commit('setQuantityUnit', response.data.model)
        swal(
          i18n.t('QuantityUnit.quantityUnitUpdatedSuccessfully'),
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
  postQuantityUnit({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('QuantityFill', item.QuantityFill)
    return axios
      .post(`/api/v1/admin/quantity-units`, formData)
      .then((response) => {
        commit('setQuantityUnit', response.data.model)
        swal(
          i18n.t('QuantityUnit.quantityUnitCreatedSuccessfully'),
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
  changeQuantityUnitStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/quantity-units/${id}/update-status`, formData)
      .then((response) => {
        commit('setQuantityUnitStatus', response.data.model)
        return response
      })
  },
  deleteQuantityUnit({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/quantity-units/${id}`)
      .then((response) => {
        commit('setQuantityUnit', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'QuantityUnit',
  state,
  getters,
  actions,
  mutations
}
