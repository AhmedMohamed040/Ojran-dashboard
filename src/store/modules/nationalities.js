/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,

  Nationalities: [],
  Nationality: {},
  NationalityStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getNationalitiesList: (state) => state.Nationalities,
  getNationality: (state) => state.Nationality,
  getNationalityStatus: (state) => state.NationalityStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setNationalityList(state, payload) {
    state.Nationalities = payload
  },
  setNationality(state, payload) {
    state.Nationality = payload
  },
  setNationalityStatus(state, payload) {
    state.NationalityStatus = payload
  }
}
const actions = {
  fetchNationalitys({ state, commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/nationalities`, {params: searchParams})
      .then((response) => {
        commit('setNationalityList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateNationality({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null

    return axios
      .post(`/api/v1/admin/nationalities/${id}`, formData)
      .then((response) => {
        commit('setNationality', response.data.model)
        swal(
          i18n.t('Nationality.NationalityUpdatedSuccessfully'),
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
  postNationality({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    return axios
      .post(`/api/v1/admin/nationalities`, formData)
      .then((response) => {
        commit('setNationality', response.data.model)
        swal(
          i18n.t('Nationality.NationalityCreatedSuccessfully'),
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
  changeNationalityStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/nationalities/${id}/update-status`, formData)
      .then((response) => {
        commit('setNationalityStatus', response.data.model)
        return response
      })
  },
  deleteNationality({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/nationalities/${id}`)
      .then((response) => {
        commit('setNationality', response.data.model)
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'Nationalities',
  state,
  getters,
  actions,
  mutations
}
