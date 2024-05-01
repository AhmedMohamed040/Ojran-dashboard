/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  ProductAttributesValue: [],
  ProductAttributeValue: {},
  ProductAttributeValueStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getProductAttributesValueList: (state) => state.ProductAttributesValue,
  getProductAttributeValue: (state) => state.ProductAttributeValue,
  getProductAttributeValueStatus: (state) => state.ProductAttributeValueStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setProductAttributesValueList(state, payload) {
    state.ProductAttributesValue = payload
  },
  setProductAttributeValue(state, payload) {
    state.ProductAttributeValue = payload
  },
  setProductAttributeValueStatus(state, payload) {
    state.ProductAttributeValueStatus = payload
  }
}
const actions = {
  fetchProductAttributesValue({ state, commit }) {
    return axios
      .get(`/api/v1/admin/product-attributes/values`, { params: state.filter })
      .then((response) => {
        commit('setProductAttributesValueList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchProductAttributeValue({ commit }, item) {
    return axios
      .get(
        `/api/v1/admin/product-attributes/values/single-value?ProductId=${item.ProductId}&ProductAttributeId=${item.ProductAttributeId}&ProductQuantityId=${item.ProductQuantityId}`
      )
      .then((response) => {
        commit('setProductAttributeValue', response.data.model)
        return response
      })
  },
  updateProductAttributeValue({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.DisplayOrder
      ? formData.append('DisplayOrder', item.DisplayOrder)
      : null
    item.IsPreSelected
      ? formData.append('IsPreSelected', item.IsPreSelected)
      : null
    item.WeightAdjustment
      ? formData.append('WeightAdjustment', item.WeightAdjustment)
      : null
    item.Cost ? formData.append('Cost', item.Cost) : null
    item.PriceAdjustmentUsePercentage
      ? formData.append(
          'PriceAdjustmentUsePercentage',
          item.PriceAdjustmentUsePercentage
        )
      : null
    item.PriceAdjustment
      ? formData.append('PriceAdjustment', item.PriceAdjustment)
      : null
    item.ImageSquaresPicture
      ? formData.append('ImageSquaresPicture', item.ImageSquaresPicture)
      : null
    item.ColorSquaresHex
      ? formData.append('ColorSquaresHex', item.ColorSquaresHex)
      : null
    formData.append('ProductId', item.ProductId)
    formData.append('ProductAttributeId', item.ProductAttributeId)
    formData.append('ProductQuantityId', item.ProductQuantityId)

    return axios
      .post(`/api/v1/admin/product-attributes/values/${id}`, formData)
      .then((response) => {
        commit('setProductAttributeValue', response.data.model)
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
  postProductAttributeValue({ commit }, item) {
    let formData = new FormData()
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.DisplayOrder
      ? formData.append('DisplayOrder', item.DisplayOrder)
      : null
    item.IsPreSelected
      ? formData.append('IsPreSelected', item.IsPreSelected)
      : null
    item.WeightAdjustment
      ? formData.append('WeightAdjustment', item.WeightAdjustment)
      : null
    item.Cost ? formData.append('Cost', item.Cost) : null
    item.PriceAdjustmentUsePercentage
      ? formData.append(
          'PriceAdjustmentUsePercentage',
          item.PriceAdjustmentUsePercentage
        )
      : null
    item.PriceAdjustment
      ? formData.append('PriceAdjustment', item.PriceAdjustment)
      : null
    item.ImageSquaresPicture
      ? formData.append('ImageSquaresPicture', item.ImageSquaresPicture)
      : null
    item.ColorSquaresHex
      ? formData.append('ColorSquaresHex', item.ColorSquaresHex)
      : null
    formData.append('ProductId', item.ProductId)
    formData.append('ProductAttributeId', item.ProductAttributeId)
    formData.append('ProductQuantityId', item.ProductQuantityId)
    return axios
      .post(`/api/v1/admin/product-attributes/values`, formData)
      .then((response) => {
        commit('setProductAttributeValue', response.data.model)
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
  changeProductAttributeValueStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(
        `/api/v1/admin/product-attributes/values/${id}/update-status`,
        formData
      )
      .then((response) => {
        commit('setProductAttributeValueStatus', response.data.model)
        return response
      })
  },
  deleteProductAttributeValue({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/product-attributes/values/${id}`)
      .then((response) => {
        commit('setProductAttributeValue', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'ProductAttributesValue',
  state,
  getters,
  actions,
  mutations
}
