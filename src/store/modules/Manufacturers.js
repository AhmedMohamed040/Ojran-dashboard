/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Manufacturers: [],
  Manufacturer: {},
  ManufacturerStatus: [],
  manufacturerFeature: []

}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getManufacturersList: (state) => state.Manufacturers,
  getManufacturer: (state) => state.Manufacturer,
  getManufacturerStatus: (state) => state.ManufacturerStatus,
  getManufacturerFeature: (state) => state.manufacturerFeature

}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setManufacturersList(state, payload) {
    state.Manufacturers = payload
  },
  setManufacturer(state, payload) {
    state.Manufacturer = payload
  },
  setManufacturerStatus(state, payload) {
    state.ManufacturerStatus = payload
  },
  setManufacturerFeature(state, payload) {
    state.manufacturerFeature = payload
  }
}
const actions = {
  fetchManufacturers({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/manufacturers`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setManufacturersList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateManufacturer({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.Image ? formData.append('Image', item.Image) : null

    return axios
      .post(`/api/v1/admin/manufacturers/${id}`, formData)
      .then((response) => {
        commit('setManufacturer', response.data.model)
        swal(
          i18n.t('Manufacturers.manufacturerUpdatedSuccessfully'),
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
  postManufacturer({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Image', item.Image)
    return axios
      .post(`/api/v1/admin/manufacturers`, formData)
      .then((response) => {
        commit('setManufacturer', response.data.model)
        swal(
          i18n.t('Manufacturers.manufacturerCreatedSuccessfully'),
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
  
  changeManufacturerFeature({ commit }, item) {
    let formData = new FormData()
    formData.append('isFeatured', item.isFeatured)
    return axios
      .put(`/api/v1/admin/manufacturers/${item.UserId}/toggle-feature`, formData)
      .then((response) => {
        commit('setManufacturerFeature', response.data.model)
        return response
      })
  },
  changeManufacturerStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/manufacturers/${id}/update-status`, formData)
      .then((response) => {
        commit('setManufacturerStatus', response.data.model)
        return response
      })
  },
  deleteManufacturer({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/Manufacturers/${id}`)
      .then((response) => {
        commit('setManufacturer', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'Manufacturers',
  state,
  getters,
  actions,
  mutations
}
