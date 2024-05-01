/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  WorkPlanAgentVisits: [],
  WorkPlanAgentVisit: {},
  WorkPlanAgentVisitStatus: [],
  Errors: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWorkPlanAgentVisitsList: (state) => state.WorkPlanAgentVisits,
  getErrors: (state) => state.Errors,
  getWorkPlanAgentVisit: (state) => state.WorkPlanAgentVisit,
  getWorkPlanAgentVisitStatus: (state) => state.WorkPlanAgentVisitStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setWorkPlanAgentVisitsList(state, payload) {
    state.WorkPlanAgentVisits = payload
  },
  setErrors(state, payload) {
    state.Errors = payload
  },
  setWorkPlanAgentVisit(state, payload) {
    state.WorkPlanAgentVisit = payload
  }
}
const actions = {
  fetchWorkPlanAgentVisits({ state, commit }, params) {
    return axios
      .get(`/api/v1/admin/work-plans/` + params.id +`/agents/` + params.agentId, { params: state.filter })
      .then((response) => {
        commit('setWorkPlanAgentVisitsList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  deleteWorkPlanAgentVisit({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/work-plans/${id}`)
      .then((response) => {
        commit('setWorkPlanAgentVisit', response.data.model)
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
  name: 'WorkPlanAgentVisit',
  state,
  getters,
  actions,
  mutations
}
