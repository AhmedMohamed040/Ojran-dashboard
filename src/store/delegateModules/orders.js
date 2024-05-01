/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
const state = {
  last_page: 0,
  Orders: [],
  Order: [],
  Products: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getOrdersList: (state) => state.Orders,
  getOrder: (state) => state.Order,
  getProducts: (state) => state.Products
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
  },
  setProducts(state, payload) {
    state.Products = payload
  }
}
const actions = {
  fetchOrders({ state, commit }, searchObj) {
    return axios
      .get(
        `/api/v1/agent/order-requests`, { params: {...searchObj}}
      )
      .then((response) => {
        commit('setOrdersList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  async fetchFetchProductWarehouses({ state, commit }, data) {
    const res =  await axios
      .get(
        `/api/v1/agent/products/${data.id}/warehouses`
      )
      return res;
  },
  fetchOrder({ commit }, id) {
    return axios
      .get(`/api/v1/agent/order-requests/${id}`)
      .then((response) => {
        commit('setOrder', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  createOrder({ commit }, item) {
    console.log(item)
    let formData = new FormData()
    formData.append('MerchantId', item.MerchantId)
    for (let i = 0; i < item.OrderRequestItems.length; i++) {
      formData.append(
        'OrderRequestItems[' + i + '].productId',
        item.OrderRequestItems[i].productId
      )
      formData.append(
        'OrderRequestItems[' + i + '].warehouseId',
        item.OrderRequestItems[i].warehouseId
      )
      formData.append(
        'OrderRequestItems[' + i + '].quantity',
        item.OrderRequestItems[i].quantity
      )
    }
    formData.append('CustomDiscount', item.CustomDiscount)
    formData.append('CustomDiscountDetails', item.CustomDiscountDetails)

    return axios
      .post(`/api/v1/agent/order-requests`, formData)
      .then((response) => {
        commit('setOrder', response.data.model)
        swal(
          i18n.t('Orders.OrderCreatedSuccessfully'),
          response.data.message,
          'success'
        )
        location.replace('/orders/list')
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
  updateeOrder({ commit }, item) {
    let formData = new FormData()
    formData.append('MerchantId', item.MerchantId)
    formData.append('CustomPrice', item.CustomPrice)
    formData.append('CustomDiscount', item.CustomDiscount)
    formData.append('CustomDiscountDetails', item.CustomDiscountDetails)

    return axios
      .put(`/api/v1/agent/order-requests/${item.id}`, formData)
      .then((response) => {
        commit('setOrder', response.data.model)
        swal(
          i18n.t('Orders.OrderUpdatedSuccessfully'),
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
  deleteOrder({ commit }, id) {
    return axios
      .delete(`/api/v1/agent/order-requests/${id}`)
      .then((response) => {
        swal(
          i18n.t('Orders.OrderDeletedSuccessfully'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        swal(
          i18n.t('common.error'),
          i18n.t('common.informationIsIncorrect'),
          'error'
        )
      })
  },
  increaseOrder({ state, commit }, { item, orderId }) {
    let formData = new FormData()
    formData.append('orderRequestItemId', item.id)
    return axios
      .put(`/api/v1/agent/order-requests/${orderId}/increase-item`, formData)
      .then((response) => {
        let obj = state.Order
        obj.totalPrice = response.data.model.totalPrice
        obj.customPrice = response.data.model.customPrice
        obj.customDiscount = response.data.model.customDiscount
        commit('setOrder', obj)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  decreaseOrder({ commit }, { item, orderId }) {
    let formData = new FormData()
    formData.append('orderRequestItemId', item.id)
    return axios
      .put(`/api/v1/agent/order-requests/${orderId}/decrease-item`, formData)
      .then((response) => {
        let obj = state.Order
        obj.totalPrice = response.data.model.totalPrice
        obj.customPrice = response.data.model.customPrice
        obj.customDiscount = response.data.model.customDiscount
        commit('setOrder', obj)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  deleteItem({ commit }, { item, orderId }) {
    return axios
      .delete(`/api/v1/agent/order-requests/${orderId}/delete-item/${item.id}`)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  fetchProducts({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/agent/products`, {
        params: searchParams
      })
      .then((response) => {
        commit('setProducts', response.data.model)
        return response
      })
  },
  addProduct({ commit }, orderObj) {
    let formData = new FormData()
    formData.append('ProductId', orderObj.ProductId)
    formData.append('ProductQuantityId', orderObj.productQuantityId)
    formData.append('Quantity', orderObj.quantity)
    return axios
      .put(
        `/api/v1/agent/order-requests/${orderObj.orderId}/add-item`,
        formData
      )
      .then((response) => {
        swal(
          i18n.t('Orders.ItemAddedSuccessfully'),
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
  }
}

export default {
  namespaced: true,
  name: 'Order',
  state,
  getters,
  actions,
  mutations
}
