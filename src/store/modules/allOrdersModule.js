/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
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
        `/api/v1/admin/orders?AgentId=${searchObj.agentId}&UserId=${searchObj.UserID}&createdAt=${searchObj.createdDate}&Role=${searchObj.role}&Status=${searchObj.status}&SearchString=${searchObj.searchString}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setOrdersList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchOrder({ commit }, id) {
    return axios
      .get(`/api/v1/admin/orders/${id}`)
      .then((response) => {
        commit('setOrder', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  acceptOrderAgent({ commit }, id) {
    return axios
      .post(`/api/v1/agent/orders/accept/${id}`)
      .then((response) => {
        swal(
          i18n.t('common.OrderhasBeenAccepted'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        console.log(err)
        swal(
          i18n.t('common.error'),
          i18n.t('common.informationIsIncorrect'),
          'error'
        )
      })
  },
  acceptOrder({ commit }, id) {
    return axios
      .post(`/api/v1/admin/orders/${id}/accept`)
      .then((response) => {
        commit('setOrder', response.data.model)

        swal({
          title:  i18n.t('common.OrderhasBeenAccepted'),
          text:  response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        console.log(err)
        swal({
          title:  i18n.t('common.error'),
          text: i18n.t('common.informationIsIncorrect'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })
      })
  },

  prepareOrder({ commit }, id) {
    return axios
      .post(`/api/v1/admin/orders/${id}/prepare`)
      .then((response) => {
        commit('setOrder', response.data.model)

        swal({
          title:   i18n.t('common.OrderhasBeenPrepared'),
          text:  response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        console.log(err)
        swal({
          title:    i18n.t('common.error'),
          text:     i18n.t('common.informationIsIncorrect'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })

      })
  },
  deliverOrder({ commit }, id) {
    return axios
      .post(`/api/v1/admin/orders/${id}/deliver`)
      .then((response) => {
        commit('setOrder', response.data.model)

        swal({
          title:     i18n.t('common.OrderhasBeenDelivered'),
          text:   response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        console.log(err)
        swal({
          title: i18n.t('common.error'),
          text: i18n.t('common.informationIsIncorrect'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })

      })
  },
  rejectOrder({ commit }, obj) {
    let formData = new FormData()
    formData.append('reason', obj.reason)
    return axios
      .post(`/api/v1/admin/orders/${obj.id}/reject`, formData)
      .then((response) => {
        commit('setOrder', response.data.model)

        swal({
          title: i18n.t('common.OrderhasBeenRejected'),
          text:  response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }
        swal({
          title: i18n.t('common.error'),
          text:  arr.join('\n\n'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })

      })
  },

  rejectOrderAgent({ commit }, obj) {
    let options = {
      method: 'POST',
      url: `/api/v1/agent/orders/reject/${obj.id}`,
      headers: {
          'content-type': 'application/json',

      },
      data: `${obj.reason}`,
    };
    return axios
    .request(options)
      .then((response) => {
        swal({
          title:  i18n.t('common.OrderhasBeenRejected'),
          text:    response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        let arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }
        swal({
          title:i18n.t('common.error'),
          text:  arr.join('\n\n'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })
      })
  },
  cancelOrder({ commit }, obj) {
    let formData = new FormData()
    formData.append('reason', obj.reason)
    return axios
      .post(`/api/v1/admin/orders/${obj.id}/cancel`, formData)
      .then((response) => {
        commit('setOrder', response.data.model)

      /*   order: {
          handler(val) {
            return val
          },
          deep: true,
          immediate: false,

        }, */
        swal({
          title: i18n.t('common.OrderhasBeenCancelled'),
          text: response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })
        return response
      })
      .catch((err) => {
        console.log(err)
        swal({
          title: i18n.t('common.error'),
          text:   i18n.t('common.informationIsIncorrect'),
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'error' // Set the dialog icon to error
        })

      })
  }
}

export default {
  namespaced: true,
  name: 'AllOrders',
  state,
  getters,
  actions,
  mutations
}
