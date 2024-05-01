/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'

const state = {
  last_page: 0,
  PotentialMerchantVisits: [],
  PotentialMerchantVisit: [],
  WorkPlans: []
}

const getters = {
  getLastPage: (state) => state.last_page,
  getPotentialMerchantVisitsList: (state) => state.PotentialMerchantVisits,
  getPotentialMerchantVisit: (state) => state.PotentialMerchantVisit,
  getWorkPlans: (state) => state.WorkPlans
}
const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setPotentialMerchantVisitsList(state, payload) {
    state.PotentialMerchantVisits = payload
  },
  setPotentialMerchantVisit(state, payload) {
    state.PotentialMerchantVisit = payload
  },
  setWorkPlans(state, payload) {
    state.WorkPlans = payload
  }
}
const actions = {
  fetchPotentialMerchantVisits(
    { state, commit },
    searchObj = { WorkPlanId: '', PageNumber: 1 }
  ) {
    let page =
      searchObj.PageNumber !== '' ? `&PageNumber=${searchObj.PageNumber}` : ''
    // let WorkPlan = WorkPlanId != '' ? `?WorkPlanId=${WorkPlanId}` : ''
    return axios
      .get(
        `/api/v1/agent/merchant-visits?WorkPlanId=${searchObj.workPlanId}${page}`
      )
      .then((response) => {
        commit('setPotentialMerchantVisitsList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        console.log(response)
        return response
      })
  },
  fetchPotentialMerchantVisit({ commit }, id) {
    return axios.get(`/api/v1/agent/merchant-visits/${id}`).then((response) => {
      commit('setPotentialMerchantVisit', response.data.model)
      return response
    })
  },
  fetchWorkPlans({ commit }) {
    return axios
      .get('/api/v1/agent/work-plans?Status=accepted', {
        params: { PageSize: 10000 }
      })
      .then((response) => {
        commit('setWorkPlans', response.data.model)
        return response
      })
  },
  createPotentialMerchantVisit({ commit }, item) {
    let formData = new FormData()
    formData.append('Details', item.Details)
    formData.append('MerchantDetailId', item.MerchantDetailId)
    formData.append('WorkPlanId', item.WorkPlanId)
    for (let i = 0; i < item.Images.length; i++) {
      formData.append('Images', item.Images[i])
    }
    for (let i = 0; i < item.Attachments.length; i++) {
      formData.append('Attachments', item.Attachments[i])
    }
    if (item.Potential) {
      formData.append('PotentialMerchant.Name', item.PotentialMerchant.Name)
      formData.append('PotentialMerchant.Phone', item.PotentialMerchant.Phone)
      formData.append('PotentialMerchant.Email', item.PotentialMerchant.Email)
      formData.append(
        'PotentialMerchant.Details',
        item.PotentialMerchant.Details
      )
      formData.append(
        'PotentialMerchant.CompanyName',
        item.PotentialMerchant.CompanyName
      )
      formData.append(
        'PotentialMerchant.Address',
        item.PotentialMerchant.Address
      )
      formData.append(
        'PotentialMerchant.Activity',
        item.PotentialMerchant.Activity
      )
      formData.append(
        'PotentialMerchant.CountryId',
        item.PotentialMerchant.CountryId
      )
      formData.append('PotentialMerchant.CityId', item.PotentialMerchant.CityId)
      formData.append(
        'PotentialMerchant.RegionId',
        item.PotentialMerchant.RegionId
      )
      formData.append(
        'PotentialMerchant.Lat',
        item.PotentialMerchant.location.lat
      )
      formData.append(
        'PotentialMerchant.Long',
        item.PotentialMerchant.location.lng
      )
      formData.append(
        'PotentialMerchant.Attachments',
        item.PotentialMerchant.Attachments
      )
      if (item.PotentialMerchant.Attachments != null)
      for (let i = 0; i < item.PotentialMerchant.Attachments.length; i++) {
        formData.append('PotentialMerchant.Attachments', item.Attachments[i])
      }
    }

    return axios
      .post(`/api/v1/agent/merchant-visits`, formData)
      .then((response) => {
        commit('setPotentialMerchantVisit', response.data.model)
        swal(
          i18n.t('PotentialMerchantVisit.savedSuccessfully'),
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
        return err;
      })
  }
}

export default {
  namespaced: true,
  name: 'PotentialMerchantVisit',
  state,
  getters,
  actions,
  mutations
}
