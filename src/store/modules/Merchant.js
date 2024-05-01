import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
import router from '../../router'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Delegates: [],
  Merchants: [],
  Merchant: {},
  warehouse: [],
  MerchantStatus: [],
  joinRequests: [],
  statusCode: 0,
  MerchantId: null,
  Bills: [],
  BillsPdf: []

}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getDelegateList: (state) => state.Delegates,
  getWarehouse: (state) => state.warehouse,
  getJoinRequest: (state) => state.joinRequests,
  getMerchantList: (state) => state.Merchants,
  getMerchant: (state) => state.Merchant,
  getMerchantStatus: (state) => state.MerchantStatus,
  getStatusCode: (state) => state.statusCode,
  getBillsList: (state) => state.Bills,
  getBillsPdf: (state) => state.BillsPdf,
  getMerchantId: (state) => state.MerchantId
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setDelegateList(state, payload) {
    state.Delegates = payload
  },
  setMerchantList(state, payload) {
    state.Merchants = payload
  },
  setMerchant(state, payload) {
    state.Merchant = payload
  },
  setJoinRequest(state, payloud) {
    state.joinRequests = payloud
  },
  setMerchantStatus(state, payload) {
    state.MerchantStatus = payload
  },
  setStatusCode(state, payload) {
    state.statusCode = payload
  },
  setWarehouse(state, payload) {
    state.warehouse = payload
  },
  setBillsList(state, payload) {
    state.Bills = payload
  },
  setBillsPdf(state, payload) {
    state.BillsPdf = payload
  },
  setMerchantId(state, payload) {
    state.MerchantId = payload
  }
}
const actions = {
  fetchDelegates({ commit }, agentName) {
    return axios
      .get('/api/v1/admin/agents', { params: { PageSize: 1000000  } })
      .then((response) => {
        commit('setDelegateList', response.data.model)

        return response
      })
  },
  fetchRequstDetails({ commit }, id) {
    return axios.get(`/api/v1/admin/merchants/requests/${id}`).then((response) => {
      commit('setJoinRequest', response.data.model)

      return response
    })
  },
  fetchMerchants({ state, commit }, searchParam = {}) {
    return axios
      .get('/api/v1/admin/merchants', { params: searchParam })
      .then((response) => {
        commit('setMerchantList', response.data.model)
        commit('setLastPage', response.data.totalPages)

        return response
      })
  },
  fetchMerchant({ commit }, id) {
    return axios.get(`/api/v1/admin/merchants/${id}`).then((response) => {
      commit('setMerchant', response.data.model)

      return response
    })
  },
  postMerchant({ commit }, item) {
    const formData = new FormData()

    formData.append('Name', item.Name)
    formData.append('Email', item.Email)
    formData.append('Phone', item.Phone)
    formData.append('Address', item.Address)
    formData.append('CompanyName', item.CompanyName)
    formData.append('Activity', item.Activity)
    formData.append('RequestTypeId', item.RequestTypeId)
    formData.append('Details', item.Details)
    formData.append('CountryId', item.CountryId)
    formData.append('RegionId', item.RegionId)
    formData.append('CityId', item.CityId)
    if (item.Attachments) {
      for (let i = 0; i < item.Attachments.length; i++) {
        formData.append('Attachments', item.Attachments[i])
      }
    }

    return axios
      .post('/api/v1/admin/merchants', formData)
      .then((response) => { // if status code = 400 it don't go catch
        console.log(response)
        const { data } = response

        if (data.status >= 400) throw data
        commit('setMerchant', data.model)
        commit('setStatusCode', data.statusCode)
        swal(
          i18n.t('Merchant.merchantCreatedSuccessfully'),
          data.message,
          'success'
        )

        return response
      }).then(() => router.go(-1))
      .catch((err) => {
        const arr = []

        console.log(err)
        for (let i = 0; i < Object.keys(err).length; i++) {
          arr.push(Object.values(err.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n'), 'error')
        commit('setStatusCode', err.status)
      })
  },
  assignAgent({ commit }, item) {
    const { id } = item
    const formData = new FormData()

    formData.append('AgentId', item.AgentId)

    return axios
      .put(`/api/v1/admin/merchants/${id}/assign-agent`, formData)
      .then((response) => {
        swal(
          i18n.t('Delegate.agentHasBeenAssginedSuccessfully'),
          response.data.message,
          'success'
        )

        return response
      })
      .catch((err) => {
        const arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  assignWarehouse({ commit }, item) {
    const { id } = item
    const formData = new FormData()

    formData.append('id', item.id)

    formData.append('WarehouseId', item.warehouse)

    return axios
      .put(`/api/v1/admin/merchants/${id}/attach-warehouse`, formData)
      .then((response) => {
        swal(
          i18n.t('Delegate.warehouseHasBeenAssignedSuccessfully'),
          response.data.message,
          'success'
        )

        return response
      })
      .catch((err) => {
        console.log(err)
        const arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  unassignAgent({ commit }, item) {
    const { id } = item
    const formData = new FormData()

    formData.append('AgentId', item.AgentId)

    return axios
      .put(`/api/v1/admin/merchants/${id}/unassign-agent`, formData)
      .then((response) => {
        swal(
          i18n.t('Delegate.agentHasBeenUnassginedSuccessfully'),
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
        throw err
      })
  },
  unassignWarehouse({ commit }, item) {
    const { id } = item
    const formData = new FormData()

    formData.append('WarehouseId', item.warehouse)

    return axios
      .put(`/api/v1/admin/merchants/${id}/detach-warehouse`, formData)
      .then((response) => {
        swal(
          i18n.t('Delegate.warehouseHasBeenUnassginedSuccessfully'),
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
        throw err
      })
  },
  attachPriceCategory({ commit }, item) {
    const { id } = item
    const formData = new FormData()

    formData.append('PriceCategoryId', item.PriceCategoryId)

    return axios
      .put(`/api/v1/admin/merchants/${id}/attach-price-category`, formData)
      .then((response) => {
        swal(
          'تم تحدد الشريحة السعرية لهذا التاجر بنجاح',
          response.data.message,
          'success'
        )

        return response
      })
      .catch((err) => {
        const arr = []

        for (let i = 0; i < Object.keys(err.response.data).length; i++) {
          arr.push(Object.values(err.response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n\n'), 'error')
      })
  },
  detachPriceCategory({ commit }, id) {
    return axios
      .put(`/api/v1/admin/merchants/${id}/detach-price-category`)
      .then((response) => {
        swal(
          'تم إزالة الشريحة السعرية لهذا التاجر بنجاح',
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
  changeMerchantStatus({ commit }, item) {
    const formData = new FormData()

    formData.append('status', item.status)

    return axios
      .put(`/api/v1/admin/merchants/${item.id}/update-status`, formData)
      .then((response) => {
        commit('setMerchantStatus', response.data.model)

        return response
      })
  },
  fetchBills({ commit }, searchObj) {
    return axios
      .get(
        `/api/v1/admin/bills?UserId=${searchObj.UserID}&DateFrom=${searchObj.DateFrom}&DateTo=${searchObj.DateTo}&PageNumber=${searchObj.PageNumber}`
      )
      .then((response) => {
        commit('setBillsList', response.data.model)
        commit('setLastPage', response.data.model.payments.totalPages)

        return response
      })
  },
  fetchBillsPdf({ commit }, searchObj) {
    const size = 100000000

    return axios
      .get(
        `/api/v1/admin/bills?UserId=${searchObj.UserID}&DateFrom=${searchObj.DateFrom}&DateTo=${searchObj.DateTo}&PageSize=${size}`
      )
      .then((response) => {
        commit('setBillsPdf', response.data.model)

        return response
      })
  },

  updateMerchant({ commit }, data) {

    const formData = new FormData()

    formData.append('Name', data.name)
    formData.append('Username', data.phone)
    formData.append('Phone', data.phone)
    formData.append('Email', data.email)
    formData.append('CommercialRegisterNumber', data.number)
    formData.append('Address', data.address)
    formData.append('RegionId', data.region)
    formData.append('CityId', data.city)

    return axios
      .put(`/api/v1/admin/merchants/${data.id}/update-data`, formData)
      .then((response) => {
        commit('setMerchant', response.data)
        swal(
          i18n.t('users.delegateEditedSuccessfully'),
          response.data.message,
          'success'
        )

        return response

      }).catch(({ response }) => {
        const arr = []

        console.log(response)
        for (let i = 0; i < Object.keys(response.data).length; i++) {
          arr.push(Object.values(response.data.errors)[i])
        }

        swal(i18n.t('common.error'), arr.join('\n'), 'error')
      })
  }

}

export default {
  namespaced: true,
  name: 'Merchant',
  state,
  getters,
  actions,
  mutations
}
