/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
import router from '../../router'
const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Categories: [],
  Category: {},
  subCategories: [],
  subCategory: {},
  CategoryStatus: [],
  categoryFeature: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getCategoriesList: (state) => state.Categories,
  getSubCategoriesList: (state) => state.subCategories,
  getCategory: (state) => state.Category,
  getSubCategory: (state) => state.subCategory,
  getCategoryStatus: (state) => state.CategoryStatus,
  getCategoryFeature: (state) => state.categoryFeature

}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setCategoriesList(state, payload) {
    state.Categories = payload
  },
  setSubCategoryList(state, payload) {
    state.subCategories = payload
  },
  setCategory(state, payload) {
    state.Category = payload
  },
  setSubCategory(state, payload) {
    state.subCategory = payload
  },
  setCategoryStatus(state, payload) {
    state.CategoryStatus = payload
  },
  getCategoryFeature(state, payload) {
    state.categoryFeature = payload
  }
}
const actions = {
  fetchCategories({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/categories`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setCategoriesList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },
  fetchSubCategory({ commit }, id) {
    return axios
      .get(`/api/v1/admin/categories?ParentCategoryId=${id}`)
      .then((response) => {
        commit('setSubCategoryList', response.data.model)
        return response
      })
  },
  postCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Image', item.Image)
    return axios
      .post(`/api/v1/admin/categories`, formData)
      .then((response) => {
        commit('setCategory', response.data.model)
        swal(
          i18n.t('Categories.categoryCreatedSuccessfully'),
          response.data.message,
          'success'
        ).finally(() => {
          router.go(-1);
        })
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
  postsubCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Image', item.Image)
    formData.append('ParentCategoryId', item.ParentCategoryId)
    return axios
      .post(`/api/v1/admin/categories`, formData)
      .then((response) => {
        commit('setSubCategory', response.data.model)
        swal(
          i18n.t('Categories.categoryCreatedSuccessfully'),
          response.data.message,
          'success'
        ).then ( (res) => {
          if(res) {
            router.go(-1);
          }
        })
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
  ubdateCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Image', item.Image)
    return axios
      .post(`/api/v1/admin/categories/${item.id}`, formData)
      .then((response) => {
        commit('setCategory', response.data.model)
        swal(
          i18n.t('Categories.categoryUpdatedSuccessfully'),
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
  ubdateSubCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('NameAr', item.NameAr)
    formData.append('NameEn', item.NameEn)
    formData.append('Image', item.Image)
    formData.append('ParentCategoryId', item.ParentCategoryId)
    return axios
      .post(`/api/v1/admin/categories/${item.id}`, formData)
      .then((response) => {
        commit('setSubCategory', response.data.model)
        swal(
          i18n.t('Categories.categoryUpdatedSuccessfully'),
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
  changeCategoryStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('status', item.IsActive)
    return axios
      .put(`/api/v1/admin/categories/${item.UserId}/update-status`, formData)
      .then((response) => {
        commit('setCategoryStatus', response.data.model)
        return response
      })
  },
  changeCategoryfeature({ commit }, item) {
    let formData = new FormData()
    formData.append('isFeatured', item.isFeatured)
    return axios
      .put(`/api/v1/admin/categories/${item.UserId}/toggle-feature`, formData)
      .then((response) => {
        commit('getCategoryFeature', response.data.model)
        return response
      })
  },
  deleteCategory({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/categories/${id}`)
      .then((response) => {
        commit('setCategory', response.data.model)
        return response
      })
      .catch((error) => {
        console.log(error.response.data.message)
        swal('Error ! ...', error.response.data.message, 'error')
      })
  }
}

export default {
  namespaced: true,
  name: 'Categories',
  state,
  getters,
  actions,
  mutations
}
