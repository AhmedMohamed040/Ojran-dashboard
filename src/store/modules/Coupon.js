/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Coupons: [],
  Coupon: {},
  CouponStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getCouponList: (state) => state.Coupons,
  getCoupon: (state) => state.Coupon,
  getCouponStatus: (state) => state.CouponStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setCouponList(state, payload) {
    state.Coupons = payload
  },
  setCoupon(state, payload) {
    state.Coupon = payload
  },
  setCouponStatus(state, payload) {
    state.CouponStatus = payload
  }
}
const actions = {
  fetchCoupons({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/coupons`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setCouponList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateCoupon({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.Code ? formData.append('Code', item.Code) : null
    item.Discount ? formData.append('Discount', item.Discount) : null
    item.PercentDiscount
      ? formData.append('PercentDiscount', item.PercentDiscount)
      : null
    item.MaxDiscount ? formData.append('MaxDiscount', item.MaxDiscount) : null
    item.StartsAt ? formData.append('StartsAt', item.StartsAt) : null
    item.EndsAt ? formData.append('EndsAt', item.EndsAt) : null

    return axios
      .post(`/api/v1/admin/coupons/${id}`, formData)
      .then((response) => {
        commit('setCoupon', response.data.model)
        swal(
          i18n.t('Coupon.CouponUpdatedSuccessfully'),
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
  postCoupon({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Code', item.Code)
    formData.append('StartsAt', item.StartsAt)
    formData.append('EndsAt', item.EndsAt)
    item.Discount ? formData.append('Discount', item.Discount) : null
    item.PercentDiscount
      ? formData.append('PercentDiscount', item.PercentDiscount)
      : null
    item.MaxDiscount ? formData.append('MaxDiscount', item.MaxDiscount) : null
    return axios
      .post(`/api/v1/admin/coupons`, formData)
      .then((response) => {
        commit('setCoupon', response.data.model)
        swal(
          i18n.t('Coupon.CouponCreatedSuccessfully'),
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
  changeCouponStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/coupons/${id}/update-status`, formData)
      .then((response) => {
        commit('setCouponStatus', response.data.model)
        return response
      })
  },
  deleteCoupon({ commit }, id) {
    return axios.delete(`/api/v1/admin/coupons/${id}`).then((response) => {
      commit('setCoupon', response.data.model)
      return response
    })
  }
}

export default {
  namespaced: true,
  name: 'Coupon',
  state,
  getters,
  actions,
  mutations
}
