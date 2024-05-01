/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  WorkPlanAgents: [],
  WorkPlanAgent: {},
  WorkPlanAgentStatus: [],
  Errors: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getWorkPlanAgentsList: (state) => state.WorkPlanAgents,
  getErrors: (state) => state.Errors,
  getWorkPlanAgent: (state) => state.WorkPlanAgent,
  getWorkPlanAgentStatus: (state) => state.WorkPlanAgentStatus
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setWorkPlanAgentsList(state, payload) {
    state.WorkPlanAgents = payload
  },
  setErrors(state, payload) {
    state.Errors = payload
  },
  setWorkPlanAgent(state, payload) {
    state.WorkPlanAgent = payload
  }
}
const actions = {
  fetchWorkPlanAgents({ state, commit }, workplanId) {
    console.log(workplanId)
    return axios
      .get(`/api/v1/admin/work-plans/` + workplanId +`/agents`, { params: state.filter })
      .then((response) => {
        commit('setWorkPlanAgentsList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  deleteWorkPlanAgent({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/work-plans/${id}`)
      .then((response) => {
        commit('setWorkPlanAgent', response.data.model)
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
  name: 'WorkPlanAgent',
  state,
  getters,
  actions,
  mutations
}
