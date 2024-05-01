/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  WorkPlanTypes: [],
  WorkPlanType: {},
  WorkPlanTypeStatus: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWorkPlanTypesList: (state) => state.WorkPlanTypes,
  getWorkPlanType: (state) => state.WorkPlanType,
  getWorkPlanTypeStatus: (state) => state.WorkPlanTypeStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setWorkPlanTypesList(state, payload) {
    state.WorkPlanTypes = payload
  },
  setWorkPlanType(state, payload) {
    state.WorkPlanType = payload
  },
  setWorkPlanTypeStatus(state, payload) {
    state.WorkPlanTypeStatus = payload
  }
}
const actions = {
  fetchWorkPlanTypes({ state, commit }) {
    return axios
      .get(`/api/v1/admin/work-plans/work-plan-types`, { params: state.filter })
      .then((response) => {
        commit('setWorkPlanTypesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  updateWorkPlanType({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.Target ? formData.append('Target', item.Target) : null

    return axios
      .post(`/api/v1/admin/work-plans/work-plan-types/${id}`, formData)
      .then((response) => {
        commit('setWorkPlanType', response.data.model)
        swal(
          i18n.t('WorkPlanType.WorkPlanTypeUpdatedSuccessfully'),
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
  postWorkPlanType({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Target', item.Target)
    return axios
      .post(`/api/v1/admin/work-plans/work-plan-types`, formData)
      .then((response) => {
        commit('setWorkPlanType', response.data.model)
        swal(
          i18n.t('WorkPlanType.WorkPlanTypeCreatedSuccessfully'),
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
  changeWorkPlanTypeStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(
        `/api/v1/admin/work-plans/work-plan-types/${id}/update-status`,
        formData
      )
      .then((response) => {
        commit('setWorkPlanTypeStatus', response.data.model)
        return response
      })
  },
  deleteWorkPlanType({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/work-plans/work-plan-types/${id}`)
      .then((response) => {
        commit('setWorkPlanType', response.data.model)
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
  name: 'WorkPlanType',
  state,
  getters,
  actions,
  mutations
}
