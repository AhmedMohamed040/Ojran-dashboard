/* eslint-disable */
import axios from '../../axios'

const state = {
  PriceCategories: [],
  Categories: [],
  Warehouses: [],
  Manfucters: [],
  GiftCards: [],
  QuantityUnits: [],
  Colors: [],
  Sizes: []
}

const getters = {
  getPriceCategoriesList: (state) => state.PriceCategories,
  getCategoriesList: (state) => state.Categories,
  getWarehousesList: (state) => state.Warehouses,
  getManfuctersList: (state) => state.Manfucters,
  getGiftCardsList: (state) => state.GiftCards,
  getQuantityUnitsList: (state) => state.QuantityUnits,
  getColorsList: (state) => state.Colors,
  getSizesList: (state) => state.Sizes
}
const mutations = {
  setPriceCategoriesList(state, payload) {
    state.PriceCategories = payload
  },
  setCategoriesList(state, payload) {
    state.Categories = payload
  },
  setWarehousesList(state, payload) {
    state.Warehouses = payload
  },
  setManfuctersList(state, payload) {
    state.Manfucters = payload
  },
  setGiftCardsList(state, payload) {
    state.GiftCards = payload
  },
  setQuantityUnitsList(state, payload) {
    state.QuantityUnits = payload
  },
  setColorsList(state, payload) {
    state.Colors = payload
  },
  setSizesList(state, payload) {
    state.Sizes = payload
  }
}
const actions = {
  fetchPriceCategorys({ commit }) {
    return axios
      .get(`/api/v1/admin/price-categories`, { params: { PageSize: 10000 } })
      .then((response) => {
        commit('setPriceCategoriesList', response.data.model)
        return response
      })
  },
  fetchCategories({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/categories`, { params: searchParams })
      .then((response) => {
        commit('setCategoriesList', response.data.model)
        return response
      })
  },
  fetchWarehouses({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/warehouses`, { params: searchParams })
      .then((response) => {
        commit('setWarehousesList', response.data.model)
        return response
      })
  },
  fetchManfucters({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/manufacturers`, { params: searchParams })
      .then((response) => {
        commit('setManfuctersList', response.data.model)
        return response
      })
  },
  fetchGiftCards({ commit }) {
    return axios
      .get(`/api/v1/admin/gift-cards`, { params: { PageSize: 10000 } })
      .then((response) => {
        commit('setGiftCardsList', response.data.model)
        return response
      })
  },
  fetchQuantityUnits({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/quantity-units`, { params: searchParams })
      .then((response) => {
        commit('setQuantityUnitsList', response.data.model)
        return response
      })
  },

  fetchSizes({ commit }) {
    return axios
      .get(`/api/v1/admin/sizes`, { params: { PageSize: 10000 } })
      .then((response) => {
        commit('setSizesList', response.data.model)

        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'ProductProps',
  state,
  getters,
  actions,
  mutations
}
