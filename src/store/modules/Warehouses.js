/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Warehouses: [],
  Warehouse: {},
  WarehouseStatus: [],
  someWarehouses: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWarehousesList: (state) => state.Warehouses,
  getWarehouse: (state) => state.Warehouse,
  getWarehouseStatus: (state) => state.WarehouseStatus,
  getSomeWarehouses: (state) => state.someWarehouses
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setWarehousesList(state, payload) {
    state.Warehouses = payload
  },
  setWarehouse(state, payload) {
    state.Warehouse = payload
  },
  setWarehouseStatus(state, payload) {
    state.WarehouseStatus = payload
  },
  setSomeWarehouses(state, payload) {
    state.someWarehouses = payload
  }
}
const actions = {
  fetchWarehouses({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/warehouses`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setWarehousesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  //Get some warehouses
  fetchSomeWarehouses({ commit }) {
    return axios
      .get(`/api/v1/admin/warehouses`, { params: { PageSize: 10,  } })
      .then((response) => {
        commit('setSomeWarehouses', response.data.model)
        return response
      })
  },
  updateWarehouse({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.CountryId ? formData.append('CountryId', item.CountryId) : null
    item.RegionId ? formData.append('RegionId', item.RegionId) : null
    item.CityId ? formData.append('CityId', item.CityId) : null

    return axios
      .post(`/api/v1/admin/warehouses/${id}`, formData)
      .then((response) => {
        commit('setWarehouse', response.data.model)
        swal(
          i18n.t('warehouse.warehouseUpdatedSuccessfully'),
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
  postWarehouse({ commit }, item) {
    let formData = new FormData()
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.CountryId ? formData.append('CountryId', item.CountryId) : null
    item.RegionId ? formData.append('RegionId', item.RegionId) : null
    item.CityId ? formData.append('CityId', item.CityId) : null
    return axios
      .post(`/api/v1/admin/warehouses`, formData)
      .then((response) => {
        commit('setWarehouse', response.data.model)
        swal(
          i18n.t('warehouse.warehouseCreatedSuccessfully'),
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
  changeWarehouseStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/warehouses/${id}/update-status`, formData)
      .then((response) => {
        commit('setWarehouseStatus', response.data.model)
        return response
      })
  },
  deleteWarehouse({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/warehouses/${id}`)
      .then((response) => {
        commit('setWarehouse', response.data.model)
        return response
      })
      .catch((error) => {
        console.log(error.message)
        swal('Error ! ...', error.message, 'error')
      })
  }
}

export default {
  namespaced: true,
  name: 'Warehouses',
  state,
  getters,
  actions,
  mutations
}
