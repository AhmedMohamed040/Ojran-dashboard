import axios from '../../axios'

const state = {
  media: {
    Facebook: '',
    WhatsApp: '',
    Twitter: '',
    Mail: '',
    Instagram: ''
  },
  aboutUs: {
    text: ''
  },
  shortAbout: {
    text: ''
  },
  termsAndConditions: {
    text: ''
  },
  privacyPolicy: {
    text: ''
  },
  FAQ: [],
  tax: [],
  contact: [],
  updateContact: []
}

const getters = {
  getMedia: (state) => state.media,
  getAboutUs: (state) => state.aboutUs,
  getShortAbout: (state) => state.shortAbout,
  getTermsAndConditions: (state) => state.termsAndConditions,
  getPrivacyPolicy: (state) => state.privacyPolicy,
  getContact: (state) => state.contact,

  getFAQ: (state) => state.FAQ,
  getTax: (state) => state.tax
}

const mutations = {
  setMedia(state, payload) {
    state.media = payload
  },

  setAboutUs(state, payload) {
    state.aboutUs = payload
  },
  setShortAbout(state, payload) {
    state.shortAbout = payload
  },
  setTermsAndConditions(state, payload) {
    state.termsAndConditions = payload
  },
  setFAQ(state, payload) {
    state.FAQ = payload
  },
  setPrivacyPolicy(state, payload) {
    state.privacyPolicy = payload
  },
  addQuestion(state, newQuestion) {
    state.FAQ.push(newQuestion)
  },
  saveQuestion(state, updatedQuestion) {
    const index = state.FAQ.findIndex((q) => q.id === updatedQuestion.id)

    if (index !== -1) {
      state.FAQ.splice(index, 1, { ...updatedQuestion })
    }
  },
  deleteQuestion(state, question) {
    state.FAQ = state.FAQ.filter((q) => q.id !== question.id)
  },
  setTax(state, payload) {
    state.tax = payload
  },

  setContact(state, payload) {
    state.contact = payload
  },
  updateContact(state, payload) {
    const searchVal = state.contact.find(
      (item) => item.id === payload.id && item.createdAt !== payload.createdAt
    )

    console.log(searchVal)
    if (!searchVal) {
      state.updateContact.push(payload)
    }
  },
  tirmContact(state, payload) {
    if (payload.length > 3) {
      payload.splice(0, payload.length - 3)
    }
  }
}

const actions = {
  //Get about us

  fetchAboutUs({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-by-key/ABOUT_INFO')
      .then((response) => {
        commit('setAboutUs', response.data.model)

        return response
      })
  },
  //Get short about
  fetchShortAbout({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-by-key/SHORT_ABOUT_INFO')
      .then((response) => {
        commit('setShortAbout', response.data.model)

        return response
      })
  },

  //Get media

  fetchMedia({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-group/SOCIAL_LINKS_SETTING')
      .then((response) => {
        commit('setMedia', response.data.model)

        return response
      })
  },
  //Get contact

  fetchContact({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-group/CONTACT_SETTING')
      .then((response) => {
        commit('setContact', response.data.model)

        return response
      })
  },

  //Get privacy policy

  fetchPrivacyPolicy({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-group/POLICY_SETTING')
      .then((response) => {
        commit('setPrivacyPolicy', response.data.model[0])

        return response
      })
  },

  //Get tax

  fetchTax({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-group/TAX')
      .then((response) => {
        commit('setTax', response.data.model)

        return response
      })
  },

  //Get Terms and conditions

  fetchTermsAndConditions({ commit }) {
    return axios
      .get('/api/v1/admin/settings/get-by-key/TERMS_INFO')
      .then((response) => {
        commit('setTermsAndConditions', response.data.model)

        return response
      })
  },

  fetchQuestions({ commit }) {
    return axios
      .get('/api/v1/admin/question', {
        params: { PageNumber: 1, PageSize: 10 }
      })
      .then((response) => {
        commit('setFAQ', response.data.model)

        return response
      })
  },

  // Change about us
  changeAboutUs({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.Value)
    formData.append('NameAr', item.ValueAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        commit('setAboutUs', response.data.model)

        return response
      })
  },
  // Change shot about
  changeShortAbout({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.Value)
    formData.append('NameAr', item.ValueAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        commit('setShortAbout', response.data.model)

        return response
      })
  },

  // Change Media
  changeMedia({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.NameEn)
    formData.append('NameAr', item.NameAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        return response
      })
  },

  // Change Privacy Policy
  changePrivacyPolicy({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.Value)
    formData.append('NameAr', item.ValueAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        commit('setPrivacyPolicy', response.data.model)

        return response
      })
  },

  // Change Terms and conditions
  changeTermsAndConditions({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.Value)
    formData.append('NameAr', item.ValueAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        commit('setTermsAndConditions', response.data.model)

        return response
      })
  },

  // Change tax
  changeTax({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.NameEn)
    formData.append('NameAr', item.NameAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        return response
      })
  },

  // Change contact
  changeContact({ commit, state }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('Value', item.Value)
    formData.append('ValueAr', item.ValueAr)
    formData.append('NameEn', item.NameEn)
    formData.append('NameAr', item.NameAr)

    const { id } = item

    return axios
      .put(`/api/v1/admin/settings/${item.id}`, formData)
      .then((response) => {
        commit('updateContact', response.data.model)
        commit('tirmContact', state.updateContact)
        commit('setContact', state.updateContact)

        return response
      })
  },

  // add question
  addQuestions({ commit }, item) {
    const formData = new FormData()

    formData.append('TitleAr', item.TitleAr)
    formData.append('TitleEn', item.TitleEn)
    formData.append('AnswerAr', item.AnswerAr)
    formData.append('AnswerEn', item.AnswerEn)

    return axios.post('/api/v1/admin/question', formData).then((response) => {
      return response
    })
  },

  // edit question
  editQuestions({ commit }, item) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('TitleAr', item.TitleAr)
    formData.append('TitleEn', item.TitleEn)
    formData.append('AnswerAr', item.AnswerAr)
    formData.append('AnswerEn', item.AnswerEn)

    const { id } = item

    return axios
      .put(`/api/v1/admin/question/${item.id}`, formData)
      .then((response) => {
        return response
      })
  },

  // delete question
  deleteQuestions({ commit }, item) {
    return axios
      .delete(`/api/v1/admin/question/${item.id}`)
      .then((response) => {
        return response
      })
  }
}

export default {
  namespaced: true,
  name: 'AboutUs',
  state,
  getters,
  actions,
  mutations
}
