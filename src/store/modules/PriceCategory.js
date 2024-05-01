/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  PriceCategories: [],
  PriceCategory: {},
  PriceCategoryStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getPriceCategoriesList: (state) => state.PriceCategories,
  getPriceCategory: (state) => state.PriceCategory,
  getPriceCategoryStatus: (state) => state.PriceCategoryStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setPriceCategoriesList(state, payload) {
    state.PriceCategories = payload
  },
  setPriceCategory(state, payload) {
    state.PriceCategory = payload
  },
  setPriceCategoryStatus(state, payload) {
    state.PriceCategoryStatus = payload
  }
}
const actions = {
  fetchPriceCategorys({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/price-categories`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setPriceCategoriesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updatePriceCategory({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null

    return axios
      .post(`/api/v1/admin/price-categories/${id}`, formData)
      .then((response) => {
        commit('setPriceCategory', response.data.model)
        swal(
          i18n.t('PriceCategory.priceCategoryUpdatedSuccessfully'),
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
  postPriceCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    return axios
      .post(`/api/v1/admin/price-categories`, formData)
      .then((response) => {
        commit('setPriceCategory', response.data.model)
        swal(
          i18n.t('PriceCategory.priceCategoryCreatedSuccessfully'),
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
  changePriceCategoryStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/price-categories/${id}/update-status`, formData)
      .then((response) => {
        commit('setPriceCategoryStatus', response.data.model)
        return response
      })
  },
  deletePriceCategory({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/price-categories/${id}`)
      .then((response) => {
        commit('setPriceCategory', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'PriceCategory',
  state,
  getters,
  actions,
  mutations
}
