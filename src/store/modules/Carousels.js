/* eslint-disable */
import axios from '../../axios'


const state = {
    filter: { PageNumber: 1 },
    last_page: 0,
    carousels: [],
    carousel: {},
    errors: {},
    carouselStatus: [],
    carouselImages: [],
  }

const getters = {
    getLastPage: (state) => state.last_page,
    getFilter: (state) => state.filter,
    getCarouselsList: (state) => state.carousels,
    getCarousel: (state) => state.carousel,
    getErrors: (state) => state.Errors,
    getCarouselStatus: (state) => state.carouselStatus,
    getCarouselImages: (state) => state.carouselImages,

  }

const mutations = {
    setLastPage(state, payload) {
      state.last_page = payload
    },
    setFilter(state, payload) {
      state.filter = payload
    },
    setCarouselsList(state, payload) {
      state.carousels = payload
    },
    setCarousel(state, payload) {
      state.carousel = payload
    },
    setErrors(state, payload) {
      state.Errors = payload
    },
    setCarouselStatus(state, payload) {
      state.carouselStatus = payload
    },
    setCarouselImages(state, payload) {
      state.carouselImages = payload
    },
  }

const actions = {
    // Get All carousels

    fetchCarousels({ state, commit }, searchParams = {}) {
      console.log(state.filter)
      console.log(searchParams);
      return axios
        .get(`/api/v1/admin/carousels`, { params: {...state.filter, ...searchParams} })
        .then((response) => {
          commit('setCarouselsList', response.data.model)
          commit('setLastPage', response.data.totalPages)
          return response
        })
    },

  // Get Carousel By Id
  fetchCarousel({ commit }, id) {
    return axios.get(`/api/v1/admin/carousels/${id}`).then((response) => {
      commit('setCarousel', response.data.model)
      return response
    })
  },

  // Put Carousel Status

  changeCarouselStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/carousels/change-status/${item.id}`, formData)
      .then((response) => {
        commit('setCarouselStatus', response.data.model)
        return response
      })
  },
  deleteCarouselimages({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/carousels/images/${id}`)
      .then((response) => {
        commit('setCarouselImages', response.data.model)
        return response
      })
  },

  addCarouselimages({ commit }, item) {
    let formData = new FormData()
    for (let i = 0; i < item.images.length; i++) {
      formData.append('Image', item.images[i])
    }
    return axios
      .post(`/api/v1/admin/carousels/images/${item.id}`, formData)
      .then((response) => {
        commit('setCarouselImages', response.data.model)
        return response
      })
  },


}

export default {
    namespaced: true,
    name: 'Carousels',
    state,
    getters,
    actions,
    mutations
  }
