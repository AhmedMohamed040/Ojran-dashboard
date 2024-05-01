/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  ProductAttributes: [],
  ProductAttribute: {},
  ProductAttributeStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getProductAttributesList: (state) => state.ProductAttributes,
  getProductAttribute: (state) => state.ProductAttribute,
  getProductAttributeStatus: (state) => state.ProductAttributeStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setProductAttributesList(state, payload) {
    state.ProductAttributes = payload
  },
  setProductAttribute(state, payload) {
    state.ProductAttribute = payload
  },
  setProductAttributeStatus(state, payload) {
    state.ProductAttributeStatus = payload
  }
}
const actions = {
  fetchProductAttributes({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/product-attributes`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setProductAttributesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateProductAttribute({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.DetailsAr ? formData.append('DetailsAr', item.DetailsAr) : null
    item.DetailsEn ? formData.append('DetailsEn', item.DetailsEn) : null
    item.IsColor ? formData.append('IsColor', item.IsColor) : null
    item.IsImage ? formData.append('IsImage', item.IsImage) : null

    return axios
      .put(`/api/v1/admin/product-attributes/${id}`, formData)
      .then((response) => {
        commit('setProductAttribute', response.data.model)
        swal(
          i18n.t('ProductAttributes.productAttributesUpdatedSuccessfully'),
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
  postProductAttribute({ commit }, item) {
    let formData = new FormData()
    console.log('postProductAttribute');
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('DetailsAr', item.DetailsAr)
    formData.append('DetailsEn', item.DetailsEn)
    formData.append('IsColor', item.IsColor)
    formData.append('IsImage', item.IsImage)
    return axios
      .post(`/api/v1/admin/product-attributes`, formData)
      .then((response) => {
        commit('setProductAttribute', response.data.model)
        swal(
          i18n.t('ProductAttributes.productAttributesCreatedSuccessfully'),
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
  changeProductAttributeStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/product-attributes/${id}/update-status`, formData)
      .then((response) => {
        commit('setProductAttributeStatus', response.data.model)
        return response
      })
  },
  deleteProductAttribute({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/product-attributes/${id}`)
      .then((response) => {
        commit('setProductAttribute', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'ProductAttributes',
  state,
  getters,
  actions,
  mutations
}
