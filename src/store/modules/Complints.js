/* eslint-disable */
import axios from '../../axios'


const state = {
    filter: { PageNumber: 1 },
    last_page: 0,
    complaints: [  ],
    complaint: [],
    errors: {},

  }

const getters = {
    getLastPage: (state) => state.last_page,
    getFilter: (state) => state.filter,
    getComplaints: (state) => state.complaints,
    getComplaint: (state) => state.complaint,
    getErrors: (state) => state.Errors,

  }

const mutations = {
    setLastPage(state, payload) {
      state.last_page = payload
    },
    setFilter(state, payload) {
      state.filter = payload
    },
    setComplaints(state, payload) {
      state.complaints = payload
    },
    setComplaint(state, payload) {
      state.complaint = payload
    },
    setErrors(state, payload) {
      state.Errors = payload
    },

  }

const actions = {
    // Get all complaints

    fetchComplaints({ state, commit }, searchParams = {}) {
      console.log(state.filter)
      console.log(searchParams);
      return axios
        .get(`/api/v1/admin/complain`, { params: {...state.filter, ...searchParams } })
        .then((response) => {
          commit('setComplaints', response.data.model)
          commit('setLastPage', response.data.totalPages)
          return response
        })
    },

  // Put Compmlaint
   editCompaints({ commit }, item) {
    console.log(item.isRead, item.id);
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('IsRead', item.isRead)

    const { id } = item

    return axios
      .put(`/api/v1/admin/complain/${item.id}`, formData)
      .then((response) => {
        commit('setComplaint', response.data.model)

        return response
      })

  },


   // delete complaint
   deleteComplaint({ commit }, item) {
    const { id } = item

    return axios
      .delete(`/api/v1/admin/complain/${item.id}`)
      .then((response) => {

        return response
      })

  }

}

export default {
    namespaced: true,
    name: 'Complaints',
    state,
    getters,
    actions,
    mutations
  }
