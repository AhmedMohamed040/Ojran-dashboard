/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  Region: {},
  Country: {},
  City: {},
  CountriesList: [],
  RegionsList: [],
  CitiesList: []
}

const getters = {
  getRegionsList: (state) => state.RegionsList,
  getCountriesList: (state) => state.CountriesList,
  getCitiesList: (state) => state.CitiesList,
  getRegion: (state) => state.Region,
  getCountry: (state) => state.Country,
  getCity: (state) => state.City
}
const mutations = {
  setRegionsList(state, payload) {
    state.RegionsList = payload
  },
  setCountriesList(state, payload) {
    state.CountriesList = payload
  },
  setCitiesList(state, payload) {
    state.CitiesList = payload
  },
  setRegion(state, payload) {
    state.Region = payload
  },
  setCountry(state, payload) {
    state.Country = payload
  },
  setCity(state, payload) {
    state.City = payload
  }
}
const actions = {
  // Country CRUD
  fetchCountries({ commit }, searchParams= {}) {
    return axios.get(`/api/v1/admin/countries`, { params: searchParams }).then((response) => {
      commit('setCountriesList', response.data.model)
      return response
    })
  },
  postCountry({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    return axios
      .post(`/api/v1/admin/countries`, formData)
      .then((response) => {
        commit('setCountry', response.data.model)
        swal(
          i18n.t('geography.CountryCreatedSuccessfully'),
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
  updateCountry({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null

    return axios
      .post(`/api/v1/admin/countries/${id}`, formData)
      .then((response) => {
        commit('setCountry', response.data.model)
        swal(
          i18n.t('geography.CountryUpdatedSuccessfully'),
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
  changeCountryStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/countries/${id}/update-status`, formData)
      .then((response) => {
        commit('setCountryStatus', response.data.model)
        return response
      })
  },
  deleteCountry({ commit }, id) {
    return axios.delete(`/api/v1/admin/countries/${id}`).then((response) => {
      commit('setCountry', response.data.model)
      return response
    })
  },

  /////////////////////////////////////////////////////////

  // Region CRUD
  fetchRegions({ commit }, searchParams= {}) {
    return axios.get(`/api/v1/admin/regions`, { params: searchParams }).then((response) => {
      commit('setRegionsList', response.data.model)
      return response
    })
  },
  postRegion({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('CountryId', item.CountryId)
    return axios
      .post(`/api/v1/admin/regions`, formData)
      .then((response) => {
        commit('setRegion', response.data.model)
        swal(
          i18n.t('geography.RegionCreatedSuccessfully'),
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
  updateRegion({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('CountryId', item.CountryId)
    return axios
      .post(`/api/v1/admin/regions/${id}`, formData)
      .then((response) => {
        commit('setRegion', response.data.model)
        swal(
          i18n.t('geography.RegionUpdatedSuccessfully'),
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
  changeRegionStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/regions/${id}/update-status`, formData)
      .then((response) => {
        commit('setRegionStatus', response.data.model)
        return response
      })
  },
  deleteRegion({ commit }, id) {
    return axios.delete(`/api/v1/admin/regions/${id}`).then((response) => {
      commit('setRegion', response.data.model)
      return response
    })
  },

  /////////////////////////////////////////////////////////

  // City CRUD
  fetchCities({ commit }, searchParams= {}) {
    return axios.get(`/api/v1/admin/cities`, { params: searchParams }).then((response) => {
      commit('setCitiesList', response.data.model)
      return response
    })
  },
  postCity({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('CountryId', item.CountryId)
    formData.append('RegionId', item.RegionId)

    return axios
      .post(`/api/v1/admin/cities`, formData)
      .then((response) => {
        commit('setCity', response.data.model)
        swal(
          i18n.t('geography.CityCreatedSuccessfully'),
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
  updateCity({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.CountryId ? formData.append('CountryId', item.CountryId) : null
    item.RegionId ? formData.append('RegionId', item.RegionId) : null

    return axios
      .post(`/api/v1/admin/cities/${id}`, formData)
      .then((response) => {
        commit('setCity', response.data.model)
        swal(
          i18n.t('geography.CityUpdatedSuccessfully'),
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
  changeCityStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/cities/${id}/update-status`, formData)
      .then((response) => {
        commit('setCityStatus', response.data.model)
        return response
      })
  },
  deleteCity({ commit }, id) {
    return axios.delete(`/api/v1/admin/cities/${id}`).then((response) => {
      commit('setCity', response.data.model)
      return response
    })
  }
}

export default {
  namespaced: true,
  name: 'GeographyCrud',
  state,
  getters,
  actions,
  mutations
}
