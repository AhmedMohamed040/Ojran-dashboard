/* eslint-disable */
import axios from '../../axios'
const state = {
  last_page: 0,
  Orders: [],
  Order: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getOrdersList: (state) => state.Orders,
  getOrder: (state) => state.Order
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setOrdersList(state, payload) {
    state.Orders = payload
  },
  setOrder(state, payload) {
    state.Order = payload
  }
}
const actions = {
  fetchOrders({ commit }, searchObj) {
    return axios
      .get(
        `/api/v1/admin/orders-requests?AgentId=${searchObj.agentId}&MerchantId=${searchObj.merchantId}&createdAt=${searchObj.createdDate}&Status=${searchObj.status}&SearchString=${searchObj.searchString}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setOrdersList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchOrder({ commit }, id) {
    return axios
      .get(`/api/v1/admin/orders-requests/${id}`)
      .then((response) => {
        commit('setOrder', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export default {
  namespaced: true,
  name: 'AdminOrders',
  state,
  getters,
  actions,
  mutations
}
