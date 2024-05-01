/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  last_page: 0,
  PotentialMerchant: [],
  allPotentialMerchant: [],
  Orders: [],
  Order: [],
  Invoices: [],
  Invoice: [],
  Bills: [],
  Methods: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getPotentialMerchantList: (state) => state.PotentialMerchant,
  getAllPotentialMerchantList: (state) => state.allPotentialMerchant,
  getOrdersList: (state) => state.Orders,
  getOrder: (state) => state.Order,
  getInvoicesList: (state) => state.Invoices,
  getInvoice: (state) => state.Invoice,
  getBillsList: (state) => state.Bills,
  getMethodsList: (state) => state.Methods
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setPotentialMerchantList(state, payload) {
    state.PotentialMerchant = payload
  },
  setAllPotentialMerchantList(state, payload) {
    state.allPotentialMerchant = payload
  },
  setOrdersList(state, payload) {
    state.Orders = payload
  },
  setOrder(state, payload) {
    state.Order = payload
  },
  setInvoicesList(state, payload) {
    state.Invoices = payload
  },
  setInvoice(state, payload) {
    state.Invoice = payload
  },
  setBillsList(state, payload) {
    state.Bills = payload
  },
  setMethodsList(state, payload) {
    state.Methods = payload
  }
}
const actions = {
  fetchPotentialMerchant(
    { commit },
    searchObj = {}
  ) {
    let page =
      searchObj.PageNumber !== '' ? `&PageNumber=${searchObj.PageNumber}` : ''
    return axios
      .get(
        `/api/v1/agent/merchants?`, { params: searchObj}
      )
      .then((response) => {
        commit('setPotentialMerchantList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchAllPotentialMerchant({ commit }) {
    return axios
      .get(`/api/v1/agent/merchants`, { params: { PageSize: 10000 } })
      .then((response) => {
        commit('setAllPotentialMerchantList', response.data.model)
        return response
      })
  },
  setLocation({ commit }, location) {
    let formData = new FormData()
    formData.append('Lat', location.lat)
    formData.append('Long', location.lng)
    formData.append('MerchantId', location.merchantId)
    return axios
      .post(`/api/v1/agent/merchants/set-location`, formData)
      .then((response) => {
        swal(
          i18n.t('common.locationHaveBeenSettedSuccessfully'),
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
  fetchOrders({ commit }, searchObj) {
    console.log('sdfsdf', searchObj)
    return axios
      .get(
        `/api/v1/agent/orders?AgentId=${searchObj.agentId}&UserId=${searchObj.UserID}&createdAt=${searchObj.createdDate}&Status=${searchObj.status}&SearchString=${searchObj.searchString}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setOrdersList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchOrder({ commit }, id) {
    return axios
      .get(`/api/v1/agent/orders/${id}`)
      .then((response) => {
        commit('setOrder', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  fetchInvoices({ commit }, searchObj = {}) {
    return axios
      .get(`/api/v1/agent/invoices`, {params: searchObj})
      .then((response) => {
        commit('setInvoicesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchInvoice({ commit }, id) {
    return axios
      .get(`/api/v1/agent/invoices/${id}`)
      .then((response) => {
        console.log(response.data.model)
        commit('setInvoice', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  createReceiptVoucher(
    { commit },
    voucherReceipt = {
      id: '',
      amount: '',
      andThatIsInReturn: '',
      method: '',
      attachments: '',

      date: '',
      notes: ''
    }
  ) {
    let formData = new FormData()
    formData.append('PaymentMethodId', voucherReceipt.method)
    formData.append('PaidFor', voucherReceipt.andThatIsInReturn)
    formData.append('Notes', voucherReceipt.notes)
    formData.append('Amount', voucherReceipt.amount)
    formData.append('PaidAt', voucherReceipt.date)
    formData.append('Attachment', voucherReceipt.attachments)

    return axios
      .post(
        `/api/v1/agent/invoices/${voucherReceipt.id}/create-catch-reciept`,
        formData
      )
      .then((response) => {

          swal({
            title:  i18n.t('Invoices.receiptVoucherHasBeenCreatedSuccessfully'),
            text:  response.data.message,
            timer: 2000, // Time in milliseconds
            showConfirmButton: false, // Hide the confirm button
            icon: 'success' // Set the dialog icon to error
          })

        return response
      })
      .catch((err) => {
        let arr = []
        console.log(err);
        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  fetchBills({ commit }, searchObj) {
    return axios
      .get(
        `/api/v1/agent/bills?UserId=${searchObj.UserID}&DateFrom=${searchObj.DateFrom}&DateTo=${searchObj.DateTo}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setBillsList', response.data.model)
        commit('setLastPage', response.data.model.payments.totalPages)
        return response
      })
  },
  fetchMethods({ commit }) {
    return axios.get(`/api/v1/agent/invoices/methods`).then((response) => {
      commit('setMethodsList', response.data.model)
      return response
    })
  },
  fetchAdminInvoices({ commit }, searchObj = {}) {
    return axios
      .get(`/api/v1/admin/invoices`, {params: searchObj})
      .then((response) => {
        commit('setInvoicesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchAdminInvoice({ commit }, id) {
    return axios
      .get(`/api/v1/admin/invoices/${id}`)
      .then((response) => {
        console.log(response.data.model)
        commit('setInvoice', response.data.model)
        return response
      })
      .catch((err) => {
        console.log(err)
      })
  },
  createReceiptVoucherAdmin(
    { commit },
    voucherReceipt = {
      id: '',
      amount: '',
      andThatIsInReturn: '',
      method: '',
      attachments: '',
      date: '',
      notes: ''
    }
  ) {
    let formData = new FormData()
    formData.append('PaymentMethodId', voucherReceipt.method)
    formData.append('PaidFor', voucherReceipt.andThatIsInReturn)
    formData.append('Notes', voucherReceipt.notes)
    formData.append('Amount', voucherReceipt.amount)
    formData.append('PaidAt', voucherReceipt.date)
    formData.append('Attachment', voucherReceipt.attachments)

    return axios
      .post(
        `/api/v1/admin/invoices/${voucherReceipt.id}/create-catch-reciept`,
        formData
      )
      .then((response) => {
        swal({
          title:  i18n.t('Invoices.receiptVoucherHasBeenCreatedSuccessfully'),
          text:  response.data.message,
          timer: 2000, // Time in milliseconds
          showConfirmButton: false, // Hide the confirm button
          icon: 'success' // Set the dialog icon to error
        })

        return response
      })
      .catch((err) => {
        let arr = []
        console.log(err);
        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
        return arr
      })

  },
  fetchMethodsAdmin({ commit }) {
    return axios.get(`/api/v1/admin/invoices/methods`).then((response) => {
      commit('setMethodsList', response.data.model)
      return response
    })
  },
}

export default {
  namespaced: true,
  name: 'PotentialMerchant',
  state,
  getters,
  actions,
  mutations
}
