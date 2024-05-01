/* eslint-disable */
import axios from "../../axios";
import swal from "sweetalert";
import i18n from "../../plugins/vue-i18n";

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  MerchantsRequestes : [],
  acceptRequest : {},
  declineRequest : {},
  MerchantRequest : {},
};

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getMerchantsRequestes : (state) => state.MerchantsRequestes,
  getAcceptRequest : (state) => state.acceptRequest,
  getDeclineRequest : (state) => state.declineRequest,
  getMerchantRequest : (state) => state.MerchantRequest,
};
const mutations = {

  setLastPage(state, payload) {
    state.last_page = payload;
  },
  setFilter(state, payload) {
    state.filter = payload;
  },
  setMerchantsRequestes(state, payload) {
    state.MerchantsRequestes = payload;
  }
  ,setAcceptRequest(state, payload) {
    state.acceptRequest = payload;
  }
  ,setDeclineRequest(state, payload) {
    state.declineRequest = payload;
  }
  ,setMerchantRequest(state, payload) {
    state.MerchantRequest = payload;
  }
};
const actions = {
  fetchMerchantsRequestes({ state, commit }, searchParams= {}) {
    return axios
      .get(`/api/v1/admin/merchants/requests`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit("setMerchantsRequestes", response.data.model);
        commit("setLastPage", response.data.totalPages);
        return response;
      });
  },
  acceptMerchantRequest({ commit }, id) {
    return axios
      .put(`/api/v1/admin/merchants/requests/${id}/accept`)
      .then((response) => {
        commit("setAcceptRequest", response.data.model);
        return response;
      });
  },
  declineMerchantRequest({ commit }, id) {
    return axios
      .put(`/api/v1/admin/merchants/requests/${id}/decline`)
      .then((response) => {
        commit("setDeclineRequest", response.data.model);
        return response;
      });
  },
  deleteMerchantRequest({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/merchants/requests/${id}`)
      .then((response) => {
        commit("setMerchantRequest", response.data.model);
        return response;
      });
  }
};

export default {
  namespaced: true,
  name: "MerchantsRequestes",
  state,
  getters,
  actions,
  mutations,
};
