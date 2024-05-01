/* eslint-disable */
import axios from '../../axios'

const state = {
  Regions: [],
  Countries: [],
  Cities: []
}

const getters = {
  getRegionsList: (state) => state.Regions,
  getCountriesList: (state) => state.Countries,
  getCitiesList: (state) => state.Cities
}
const mutations = {
  setRegionsList(state, payload) {
    state.Regions = payload
  },
  setCountriesList(state, payload) {
    state.Countries = payload
  },
  setCitiesList(state, payload) {
    state.Cities = payload
  }
}
const actions = {
 async fetchRegions({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/regions?`, {params: searchParams})
      .then((response) => {
        commit('setRegionsList', response.data.model)
        return response
      })
  },
  async fetchCountries({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/countries`, {params: searchParams})
      .then((response) => {
        commit('setCountriesList', response.data.model)
        return response
      })
  },
  async fetchCities({ commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/cities`, {params: searchParams})
      .then((response) => {
        commit('setCitiesList', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'Geography',
  state,
  getters,
  actions,
  mutations
}
