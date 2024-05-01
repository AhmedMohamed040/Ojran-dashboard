/* eslint-disable */
import axios from '../../axios'


const state = {
   orders: [],
   role: '',
   overDueAmounts: [],
  products: [],
  product: {},
  workPlans: [],
   loading: false,
   receipts: []

  }

const getters = {
    getOrders: (state) => state.orders,
    getOverDueAmounts: (state) => state.overDueAmounts,
    getLoading: (state) => state.loading,
    getrole: (state) => state.role,
    getProducts: (state) => state.products,
    getProduct: (state) => state.product,
    getReceipts: (state) => state.receipts,
    getWorkPlans: (state) => state.workPlans

  }

const mutations = {
    setOrders(state, payload) {
      state.orders = payload

    },
    setOverDueAmounts(state, payload) {
      state.overDueAmounts = payload

    },
    setLoading(state, payload) {
      state.loading = payload

    },
    setrole(state, payload) {
      state.role = payload

    },
    setProducts(state, payload) {
      state.products = payload

    },
    setProduct(state, payload) {
      state.product = payload

    },
    setWorkPlans(state, payload) {
      state.workPlans = payload

    },
    setReceipts(state, payload) {
      state.receipts = payload

    },
  }

const actions = {
    // Get some orders

    fetchOrders({ state, commit }) {
      return axios
        .get(`/api/v1/admin/orders`, { params: {Status: 'Pending', PageSize: 5, PageNumber: 1} })
        .then((response) => {
          commit('setOrders', response.data.model)

          return response
        })
    },

    fetchAgentOrders({ state, commit }) {
      return axios
        .get(`/api/v1/agent/order-requests`, { params: {Status: 'Pending', PageSize: 5, PageNumber: 1} })
        .then((response) => {
          commit('setOrders', response.data.model)

          return response
        })
    },
    fetchAgentMerchantOrders({ state, commit }) {
      return axios
        .get(`/api/v1/agent/orders`, { params: {Status: 'Pending', PageSize: 5, PageNumber: 1} })
        .then((response) => {
          commit('setOrders', response.data.model)

          return response
        })
    },
     // Get some Products
  fetchProductsAgent({ state, commit }) {
    return axios
      .get(`/api/v1/agent/products`, { params: {PageSize: 5, PageNumber: 1, OrderBy: 'Ordered'} })
      .then((response) => {
        commit('setProducts', response.data.model)
        return response
      })
  },
  fetchWorkPlans({ state, commit }) {
    return axios
      .get(`/api/v1/agent/work-plans`, { params: {Status: 'Pending', PageSize: 5, PageNumber: 1} })
      .then((response) => {
        commit('setWorkPlans', response.data.model)
        return response
      })
  },

  fetchProducts({ state, commit }) {
    return axios
      .get(`/api/v1/admin/products`, { params: {PageSize: 5, PageNumber: 1, OrderBy: 'Ordered'} })
      .then((response) => {
        commit('setProducts', response.data.model)
        return response
      })
  },

  // Get Product
  fetchProduct({ commit }, id) {
    return axios.get(`/api/v1/admin/products/${id}`).then((response) => {
      commit('setProduct', response.data.model)
      return response
    })


  },
  fetchReceipts({ commit }) {
    return axios
    .get(`/api/v1/admin/agents/catch-recipients`, { params: { PageSize: 5, PageNumber: 1} })
    .then((response) => {
      commit('setReceipts', response.data.model)

      return response
    })


  },
  fetchOverdue({commit}) {
    if(localStorage.getItem('role') == 'Admin') {
    return axios
    .get('/api/v1/admin/merchants/Indebted', {params: { PageNumber: 1, PageSize: 5}})
    .then((response) => {
      commit('setOverDueAmounts', response.data.model)

      return response
    })
    }
    if(localStorage.getItem('role') == 'Agent') {
      return axios
      .get('/api/v1/agent/merchants/Indebted', {params: { PageNumber: 1, PageSize: 5}})
      .then((response) => {
        commit('setOverDueAmounts', response.data.model)

        return response
      })
    }

  }

}

export default {
    namespaced: true,
    name: 'Dashboard',
    state,
    getters,
    actions,
    mutations
  }
