/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  WorkPlans: [],
  WorkPlanTypes: [],
  WorkPlan: {},
  WorkPlanStatus: [],
  Errors: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWorkPlansList: (state) => state.WorkPlans,
  getErrors: (state) => state.Errors,
  getWorkPlanTypesList: (state) => state.WorkPlanTypes,
  getWorkPlan: (state) => state.WorkPlan,
  getWorkPlanStatus: (state) => state.WorkPlanStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setWorkPlansList(state, payload) {
    state.WorkPlans = payload
  },
  setErrors(state, payload) {
    state.Errors = payload
  },
  setWorkPlanTypesList(state, payload) {
    state.WorkPlanTypes = payload
  },
  setWorkPlan(state, payload) {
    state.WorkPlan = payload
  },
  setWorkPlanStatus(state, payload) {
    state.WorkPlanStatus = payload
  }
}
const actions = {
  fetchWorkPlans({ state, commit }) {
    return axios
      .get(`/api/v1/admin/work-plans`, { params: state.filter })
      .then((response) => {
        commit('setWorkPlansList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchWorkPlanTypes({ commit }) {
    return axios
      .get(`/api/v1/admin/work-plans/work-plan-types`, {
        params: { PageSize: 10000 }
      })
      .then((response) => {
        commit('setWorkPlanTypesList', response.data.model)

        return response
      })
  },
  postWorkPlan({ commit }, item) {
    let formData = new FormData()
    formData.append('Name', item.Name)
    formData.append('StartDate', item.StartDate)
    formData.append('EndDate', item.EndDate)
    formData.append('WorkPlanTypeId', item.WorkPlanTypeId)
    formData.append('Goals', item.Goals)
    formData.append('Target', item.Target)
    formData.append('CountryId', item.CountryId)
    formData.append('RegionId', item.RegionId)
    formData.append('CityId', item.CityId)
    if (item.AgentIds) {
      for (let i = 0; i < item.AgentIds.length; i++) {
        formData.append('AgentIds[' + i + ']', item.AgentIds[i])
      }
    }
    return axios
      .post(`/api/v1/admin/work-plans`, formData)
      .then((response) => {
        commit('setErrors', [])
        commit('setWorkPlan', response.data.model)
        swal(
          i18n.t('WorkPlan.WorkPlanCreatedSuccessfully'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        commit('setErrors', err.response.data.errors || [])
      })
  },
  updateWorkPlan({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.Name ? formData.append('Name', item.Name) : null
    item.StartDate ? formData.append('StartDate', item.StartDate) : null
    item.EndDate ? formData.append('EndDate', item.EndDate) : null
    item.WorkPlanTypeId
      ? formData.append('WorkPlanTypeId', item.WorkPlanTypeId)
      : null
    item.Goals ? formData.append('Goals', item.Goals) : null
    item.Target ? formData.append('Target', item.Target) : null
    item.CountryId ? formData.append('CountryId', item.CountryId) : null
    item.RegionId ? formData.append('RegionId', item.RegionId) : null
    item.CityId ? formData.append('CityId', item.CityId) : null

    if (item.AgentIds) {
      for (let i = 0; i < item.AgentIds.length; i++) {
        formData.append('AgentIds[' + i + ']', item.AgentIds[i])
      }
    }

    return axios
      .post(`/api/v1/admin/work-plans/${id}`, formData)
      .then((response) => {
        commit('setWorkPlan', response.data.model)
        swal(
          i18n.t('WorkPlan.WorkPlanUpdatedSuccessfully'),
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

  changeWorkPlanStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/work-plans/${id}/update-status`, formData)
      .then((response) => {
        commit('setWorkPlanStatus', response.data.model)
        return response
      })
  },
  deleteWorkPlan({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/work-plans/${id}`)
      .then((response) => {
        commit('setWorkPlan', response.data.model)
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
  name: 'WorkPlan',
  state,
  getters,
  actions,
  mutations
}
