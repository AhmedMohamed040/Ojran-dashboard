/* eslint-disable */
import axios from "../../axios";
import swal from "sweetalert";
import i18n from "../../plugins/vue-i18n";

const state = {
  addedStock: {},
  transferedStock: {},
  destructStock: {},
  WarehousesStock: [],
  QuantityInWarehouse: [],
};

const getters = {
  getAddedStock: (state) => state.addedStock,
  getTransferedStock: (state) => state.transferedStock,
  getDestructStock: (state) => state.destructStock,
  getWarehousesStock: (state) => state.WarehousesStock,
  getQuantityInWarehouse: (state) => state.QuantityInWarehouse,

};
const mutations = {
  setAddedStock(state, payload) {
    state.addedStock = payload;
  },
  setTransferedStock(state, payload) {
    state.transferedStock = payload;
  },
  setDestructStock(state, payload) {
    state.destructStock = payload;
  }
  ,
  setWarehousesStock(state, payload) {
    state.WarehousesStock = payload;
  },
  setQuantityInWarehouse(state, payload) {
    state.QuantityInWarehouse = payload;
  }
};
const actions = {
  addStock({ commit }, item) {
    let formData = new FormData()
    formData.append('Quantity', item.Quantity)
    formData.append('BoughtPrice', item.BoughtPrice)
    formData.append('WarehouseId', item.WarehouseId)
    formData.append('QuantityUnitId', item.QuantityUnitId)
    formData.append('AdditionType', item.AdditionType)
    item.Invoice ? formData.append('Invoice', item.Invoice) : null
    item.Notes ? formData.append('Notes', item.Notes) : null
    return axios
      .put(`/api/v1/admin/products/${item.id}/add-quantity`, formData)
      .then((response) => {
        commit('setAddedStock', response.data.model)
        swal(
          i18n.t("common.operationSuccessful") ,
          i18n.t("Product.stockAddedSuccessfully"),
          "success");
        return response
      })
      .catch((error) => {
        console.log(error.response.data.errors.messages[0])
        swal(i18n.t("common.error") , i18n.t("common.operationFaild") , 'error')
      })
  },
  fetchWarehouseStock({ commit } , id) {
    return axios
      .get(`/api/v1/admin/products/${id}/warehouses`)
      .then((response) => {
        commit("setWarehousesStock", response.data.model);
        return response;
      });
  },

  fetchQuantityInWarehouse({ commit } ,item) {
    let warehouseId = item.warehouse_id ? `?warehouseId=${item.warehouse_id}` : ''
    return axios
    .get(`/api/v1/admin/products/${item.product_id}/product-quantities${warehouseId}`)
      .then((response) => {
        commit("setQuantityInWarehouse", response.data.model);
        return response;
      });
  },
  transferStock({ commit }, item) {
    let formData = new FormData()
    formData.append('Quantity', item.Quantity)
    formData.append('ProductQuantityId', item.ProductQuantityId)
    formData.append('OldWarehouseId', item.CurrentWarehouseId)
    formData.append('WarehouseId', item.NewWarehouseId)
    formData.append('Notes', item.Notes)
    return axios
      .put(`/api/v1/admin/products/${item.id}/transfer-quantity`, formData)
      .then((response) => {
        commit('setTransferedStock', response.data.model)
        swal(
          i18n.t("common.operationSuccessful") ,
          i18n.t("Product.stockTransferredSuccessfully"),
          "success");
        return response
      })
        .catch((err) => {
          for (let i = 0; i < Object.keys(err.response.data).length; i++) {
            swal(
              i18n.t("common.operationFaild"),

                Object.values(err.response.data.errors)[i].toString(),
              "error"
            );
          }
          return err
        });

  },
  desrtructStock({ commit }, item) {
    let formData = new FormData()
    formData.append('Quantity', item.Quantity)
    formData.append('ProductQuantityId', item.ProductQuantityId)
    formData.append('OldWarehouseId', item.CurrentWarehouseId)
    formData.append('WarehouseId', item.NewWarehouseId)
    formData.append('Notes', item.Notes)
    return axios
      .put(`/api/v1/admin/products/${item.id}/destruct-quantity`, formData)
      .then((response) => {
        commit('setDestructStock', response.data.model)
        swal(
          i18n.t("common.operationSuccessful") ,
          i18n.t("Product.stockDepreciationSuccessfully"),
          "success");
        return response
      })
      .catch((error) => {
        console.log(error.response.data.errors.messages[0])
        swal(i18n.t("common.error") , i18n.t("common.operationFaild") , 'error')
      })
  },
};

export default {
  namespaced: true,
  name: "ProductStock",
  state,
  getters,
  actions,
  mutations,
};
