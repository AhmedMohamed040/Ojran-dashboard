/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
   status: [],
   orders: [],
   order: [],
   AgentSales: [],
   warehouses: [],
  sales: []
  }

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getOrders: (state) => state.orders,
    getOrdersStatus: (state) => state.status,
    getOrder: (state) => state.order,
    getSales: (state) => state.sales,
    getAgentSales: (state) => state.AgentSales,
    getWarehouses: (state) => state.warehouses,



  }

const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setOrders(state, payload) {
    state.orders = payload
  },
  setOrder(state, payload) {
    state.order = payload
  },
  setSales(state, payload) {
    state.sales = payload
  },

  setAgentSales(state, payload) {
    state.AgentSales = payload
  },
  setWarehouses(state, payload){
    state.warehouses = payload

  },

    setOrderStatus(state, payload) {
      state.status = payload
    },

  }

const actions = {
  fetchOrders({ commit }, searchObj) {
    console.log(searchObj)
    return axios
      .get(
        `/api/v1/admin/return-order-items?createdAt=${searchObj.createdDate}&SearchString=${searchObj.searchString}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setOrders', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchWarehouses({ commit }) {
    return axios
    .get('/api/v1/admin/warehouses')
      .then((response) => {
        commit('setWarehouses', response.data.model)

        return response
      })
  },
  fetchSales({ commit }) {
    return axios
    .get('/api/v1/admin/orders/sales')
      .then((response) => {
        commit('setSales', response.data.model)

        return response
      })
  },
  fetchAgentSales({ commit }, data) {
    console.log(data)
    return axios
    .get(`api/v1/agent/orders/${data[0].userId}/agent-sales`)
      .then((response) => {
        commit('setAgentSales', response.data.model)

        return response
      })
  },

 /* fetchOrders({ commit }) {
  let options = {
    method: 'PUT',
    url: `/api/v1/notification/toggle/${item.id}`,
    headers: {
        'content-type': 'application/json',
    },
    data:
        {
          "read": item.read,
        },
  };
  return axios
  .request(options)
  .then(function (response) {
      commit('setNotificationStatus', response.data.model)

  })
}, */
fetchOrder({ commit }, id) {
  return axios
    .get(`/api/v1/admin/return-order-items/${id}`)
    .then((response) => {
      commit('setOrder', response.data.model)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
},
acceptOrder({ commit }, data) {
  console.log(data)
  return axios
    .put(`/api/v1/admin/return-order-items/${data.id}/accept/${data.warehouse}`)
    .then((response) => {
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
        title:     i18n.t('common.informationIsIncorrect'),
        text:   i18n.t('common.error'),
        timer: 2000, // Time in milliseconds
        showConfirmButton: false, // Hide the confirm button
        icon: 'error' // Set the dialog icon to error
      })

    })
},
markAsReturned({ commit }, id) {
  return axios
    .put(`/api/v1/admin/return-order-items/${id}/mark-as-returned`)
    .then((response) => {
      swal({
        title:  i18n.t('common.OrderhasBeenPrepared'),
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
        title:   i18n.t('common.informationIsIncorrect'),
        text:   i18n.t('common.error'),
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
    .put(`/api/v1/admin/return-order-items/${obj.id}/reject`, formData)
    .then((response) => {
      swal({
        title:i18n.t('common.OrderhasBeenRejected'),
        text:   response.data.message,
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
        title:arr.join('\n\n'),
        text:   i18n.t('common.error'),
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
    .put(`/api/v1/admin/return-order-items/${obj.id}/cancel`, formData)
    .then((response) => {
      swal({
        title: i18n.t('common.OrderhasBeenCancelled'),
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
        title: i18n.t('common.informationIsIncorrect'),
        text:   i18n.t('common.error'),
        timer: 2000, // Time in milliseconds
        showConfirmButton: false, // Hide the confirm button
        icon: 'error' // Set the dialog icon to error
      })

    })
}


}

export default {
    namespaced: true,
    name: 'Sales',
    state,
    getters,
    actions,
    mutations
  }
