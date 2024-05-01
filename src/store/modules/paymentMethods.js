/* eslint-disable */
import axios from '../../axios'


const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
   paymentMethods:  [ ],
  methodStatus: [],
  }

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getPaymentMethods: (state) => state.paymentMethods,
  }

const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setPaymentMethods(state, payload) {
    state.paymentMethods = payload
  },
  setMethodsStatus(state, payload) {
    state.carouselStatus = payload
  },

  }

const actions = {
  // GET ALL PAYMENT METHODS
  fetchPaymentMethods({ state, commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/payment-method`, { params: {PageSize: 10, PageNumber: state.filter.PageNumber, ...searchParams}})
      .then((response) => {
        commit('setPaymentMethods', response.data.model)
        return response
      })
  },

  changePaymentMethodStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    return axios
      .put(`/api/v1/admin/payment-method/${item.id}/is-active-update-status`, formData)
      .then((response) => {
        commit('setMethodsStatus', response.data.model)
        return response
      })
  },
  changePaymentMethodForMerchantOnly({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    return axios
      .put(`/api/v1/admin/payment-method/${item.id}/for-merchant-only-update-status`, formData)
      .then((response) => {
        commit('setMethodsStatus', response.data.model)
        return response
      })
  },

}

export default {
    namespaced: true,
    name: 'Payment',
    state,
    getters,
    actions,
    mutations
  }
