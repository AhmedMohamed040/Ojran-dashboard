/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  WorkPlans: [],
  AllWorkPlans: [],
  WorkPlan: {}
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWorkPlansList: (state) => state.WorkPlans,
  getAllWorkPlansList: (state) => state.AllWorkPlans,
  getWorkPlan: (state) => state.WorkPlan
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
  setAllWorkPlansList(state, payload) {
    state.AllWorkPlans = payload
  },
  setWorkPlan(state, payload) {
    state.WorkPlan = payload
  }
}
const actions = {
  fetchWorkPlans({ state, commit }, item) {
    let status = item.status
    return axios
      .get(`/api/v1/agent/work-plans?Status=${status}`, {
        params: state.filter
      })
      .then((response) => {
        commit('setWorkPlansList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchAllWorkPlan({ commit }) {
    return axios
      .get(`/api/v1/agent/work-plans?Status=accepted`, {
        params: { PageSize: 10000 }
      })
      .then((response) => {
        commit('setAllWorkPlansList', response.data.model)

        return response
      })
  },
  acceptWorkPlan({ commit }, id) {
    return axios
      .put(`/api/v1/agent/work-plans/${id}/accept`)
      .then((response) => {
        commit('setWorkPlan', response.data.model)

        return response
      })
  },
  declineWorkPlan({ commit }, workPlanObj) {
    let formData = new FormData()

    formData.append('rejectReason', workPlanObj.rejectReason)

    return axios
      .put(`/api/v1/agent/work-plans/${workPlanObj.id}/decline`, formData)
      .then((response) => {
        commit('setWorkPlan', response.data.model)

        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'DelegateWorkPlan',
  state,
  getters,
  actions,
  mutations
}
