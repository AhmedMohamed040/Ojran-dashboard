/* eslint-disable */
import axios from '../../axios'
import swal from 'sweetalert'
import router from '../../router'
import i18n from '../../plugins/vue-i18n'

const state = {
  filter: { PageNumber: 1 },
  last_page: 0,
  Products: [],
  Product: {},
  Errors: {},
  ProductStatus: [],
  ProductImages: [],
  attachAttribute: {},
  detachAttribute: {},
  priceForPriceCategory: {}
}

const getters = {
  getLastPage: (state) => state.last_page,
  getFilter: (state) => state.filter,
  getProductsList: (state) => state.Products,
  getProduct: (state) => state.Product,
  getErrors: (state) => state.Errors,
  getProductStatus: (state) => state.ProductStatus,
  getProductImages: (state) => state.ProductImages,
  getAttachAttribute: (state) => state.attachAttribute,
  getDetachAttribute: (state) => state.detachAttribute,
  getPriceForPriceCategory: (state) => state.priceForPriceCategory
}

const mutations = {
  setLastPage(state, payload) {
    state.last_page = payload
  },
  setFilter(state, payload) {
    state.filter = payload
  },
  setProductsList(state, payload) {
    state.Products = payload
  },
  setProduct(state, payload) {
    state.Product = payload
  },
  setErrors(state, payload) {
    state.Errors = payload
  },
  setProductStatus(state, payload) {
    state.ProductStatus = payload
  },
  setProductImages(state, payload) {
    state.ProductImages = payload
  },
  setAttachAttribute(state, payload) {
    state.attachAttribute = payload
  },
  setDetachAttribute(state, payload) {
    state.detachAttribute = payload
  },
  setPriceForPriceCategory(state, payload) {
    state.priceForPriceCategory = payload
  }
}

const actions = {
  // Get All Products

  fetchProducts({ state, commit }, searchParams = {}) {
    return axios
      .get(`/api/v1/admin/products`, { params: {...state.filter, ...searchParams} })
      .then((response) => {
        commit('setProductsList', response.data.model)
        commit('setLastPage', response.data.totalPages)
        return response
      })
  },

  // Get Product By Id
  fetchProduct({ commit }, id) {
    return axios.get(`/api/v1/admin/products/${id}`).then((response) => {
      commit('setProduct', response.data.model)
      return response
    })
  },
  // Craete Product

  postProduct({ commit }, item) {
    let formData = new FormData()
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.Code ? formData.append('Code', item.Code) : null
    item.subCategory
      ? formData.append('CategoryId', item.subCategory?.value)
      : formData.append('CategoryId', item.Category?.value)
    item.ShortDetailsAr ? formData.append('ShortDetailsAr', item.ShortDetailsAr) : null
    item.ShortDetailsEn ? formData.append('ShortDetailsEn', item.ShortDetailsEn) : null
    item.DetailsAr ? formData.append('DetailsAr', item.DetailsAr) : null
    item.DetailsEn ? formData.append('DetailsEn', item.DetailsEn) : null
    item.ShowForCustomer
      ? formData.append('ShowForCustomer', item.ShowForCustomer)
      : null
    item.ShowForMerchant
      ? formData.append('ShowForMerchant', item.ShowForMerchant)
      : null
    item.MaxStock ? formData.append('MaxStock', item.MaxStock) : null
    item.MaxMerchantStock
      ? formData.append('MaxMerchantStock', item.MaxMerchantStock)
      : null
    item.DefaultPrice
      ? formData.append('DefaultPrice', item.DefaultPrice)
      : null
    item.DefaultMerchantPrice
      ? formData.append('DefaultMerchantPrice', item.DefaultMerchantPrice)
      : null
    item.WarehouseId ? formData.append('WarehouseId', item.WarehouseId?.value) : null
    item.BoughtPrice ? formData.append('BoughtPrice', item.BoughtPrice) : null
    item.Quantity ? formData.append('Quantity', item.Quantity) : null
    item.QuantityUnitId
      ? formData.append('QuantityUnitId', item.QuantityUnitId?.id)
      : null
    item.IsGiftedCard
      ? formData.append('IsGiftedCard', item.IsGiftedCard)
      : null
    item.AdditionType
      ? formData.append('AdditionType', item.AdditionType)
      : null
    item.GiftCardId ? formData.append('GiftCardId', item.GiftCardId) : null
    item.DeliveryDaysId
      ? formData.append('DeliveryTimeId', item.DeliveryDaysId)
      : null
    item.ManufacturerId
      ? formData.append('ManufacturerId', item.ManufacturerId?.value)
      : null
    item.Discount ? formData.append('Discount', item.Discount) : null
    item.MetaDetails ? formData.append('MetaDetails', item.MetaDetails) : null
    item.MetaKeywords
      ? formData.append('MetaKeywords', item.MetaKeywords)
      : null
    item.MetaTitle ? formData.append('MetaTitle', item.MetaTitle) : null

    for (let i = 0; i < item.ProductImages.length; i++) {
      formData.append('ProductImages', item.ProductImages[i])
    }
    // item.ProductImages
    //   ? formData.append('ProductImages', item.ProductImages)
    //   : null
    item.AdditionalType
      ? formData.append('AdditionalType', item.AdditionalType)
      : null
    item.Invoice
      ? formData.append('Invoice', item.Invoice)
      : null
    item.Notes
      ? formData.append('Notes', item.Notes)
      : null
    for (let i = 0; i < item.ProductAttributeValues.length; i++) {
      formData.append(
        'ProductAttributeValues',
        item.ProductAttributeValues[i]
      )
    }

    if (item.ProductPriceCategories) {
      for (let i = 0; i < item.ProductPriceCategories.length; i++) {
        formData.append(
          'ProductPriceCategories[' + i + ']',
          JSON.stringify(item.ProductPriceCategories[i])
        )
      }
    }

    return axios
      .post(`/api/v1/admin/products`, formData)
      .then((response) => {
        commit('setProduct', response.data.model)
        swal(
          i18n.t('Product.productCreatedSuccessfully'),
          response.data.message,
          'success'
        ).then( () => router.go(-1))
        return response
      })
      .catch((err) => {
        commit('setErrors', err.response.data.errors)
      })
  },

  // Update Product

  updateProduct({ commit }, item) {
    let formData = new FormData()
    let id = item.id
    item.NameAr ? formData.append('NameAr', item.NameAr) : null
    item.NameEn ? formData.append('NameEn', item.NameEn) : null
    item.Code ? formData.append('Code', item.Code) : null
    item.subCategory
      ? formData.append('CategoryId', item.subCategory)
      : formData.append('CategoryId', item.Category)
    item.ShortDetails
      ? formData.append('ShortDetailsEn', item.ShortDetailsEn)
      : null

      ? formData.append('ShortDetailsAr', item.ShortDetailsAr)
      : null
    item.Details ? formData.append('DetailsAr', item.DetailsAr) : null

    item.Details ? formData.append('DetailsEn', item.DetailsEn) : null
    item.ShowForCustomer
      ? formData.append('ShowForCustomer', item.ShowForCustomer)
      : null
    item.ShowForMerchant
      ? formData.append('ShowForMerchant', item.ShowForMerchant)
      : null
    item.MaxStock ? formData.append('MaxStock', item.MaxStock) : null
    item.MaxMerchantStock
      ? formData.append('MaxMerchantStock', item.MaxMerchantStock)
      : null
    item.DefaultPrice
      ? formData.append('DefaultPrice', item.DefaultPrice)
      : null
    item.DefaultMerchantPrice
      ? formData.append('DefaultMerchantPrice', item.DefaultMerchantPrice)
      : null
    item.WarehouseId ? formData.append('WarehouseId', item.WarehouseId) : null
    item.BoughtPrice ? formData.append('BoughtPrice', item.BoughtPrice) : null
    item.Quantity ? formData.append('Quantity', item.Quantity) : null
    item.QuantityUnitId
      ? formData.append('QuantityUnitId', item.QuantityUnitId.value)
      : null
    item.IsGiftedCard
      ? formData.append('IsGiftedCard', item.IsGiftedCard)
      : null
    item.AdditionType
      ? formData.append('AdditionType', item.AdditionType)
      : null
    item.GiftCardId ? formData.append('GiftCardId', item.GiftCardId) : null
    item.DeliveryDaysId
      ? formData.append('DeliveryDaysId', item.DeliveryDaysId)
      : null
    item.ManufacturerId
      ? formData.append('ManufacturerId', item.ManufacturerId)
      : null
    item.Discount ? formData.append('Discount', item.Discount) : null
    item.MetaDetails ? formData.append('MetaDetails', item.MetaDetails) : null
    item.MetaKeywords
      ? formData.append('MetaKeywords', item.MetaKeywords)
      : null
    item.MetaTitle ? formData.append('MetaTitle', item.MetaTitle) : null
    if (item.ProductAttributeIds) {
      for (let i = 0; i < item.ProductAttributeIds.length; i++) {
        formData.append(
          'ProductAttributeIds[' + i + ']',
          item.ProductAttributeIds[i]
        )
      }
    }

    if (item.ProductPriceCategories) {
      for (let i = 0; i < item.ProductPriceCategories.length; i++) {
        formData.append(
          'ProductPriceCategories[' + i + ']',
          item.ProductPriceCategories[i]
        )
      }
    }
    return axios
      .post(`/api/v1/admin/products/${id}`, formData)
      .then((response) => {
        commit('setProduct', response.data.model)
        swal(
          i18n.t('Product.productUpdatedSuccessfully'),
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

  // Put Product Status

  changeProductStatus({ commit }, item) {
    let formData = new FormData()
    formData.append('id ', item.id)
    formData.append('status', item.status)
    let id = item.id
    return axios
      .put(`/api/v1/admin/products/${id}/update-status`, formData)
      .then((response) => {
        commit('setProductStatus', response.data.model)
        return response
      })
  },

  // Delete Product

  deleteProduct({ commit }, id) {
    return axios.delete(`/api/v1/admin/products/${id}`).then((response) => {
      commit('setProduct', response.data.model)
      return response
    })
  },
  delete_product_image({ commit }, id) {
    return axios
      .delete(`/api/v1/admin/products/RemoveImage/${id}`)
      .then((response) => {
        commit('setProductImages', response.data.model)
        return response
      })
  },
  add_product_image({ commit }, item) {
    let formData = new FormData()
    for (let i = 0; i < item.productImages.length; i++) {
      formData.append('productImages', item.productImages[i])
    }
    return axios
      .post(`/api/v1/admin/products/${item.id}/AddImages`, formData)
      .then((response) => {
        commit('setProductImages', response.data.model)
        return response
      })
  },
  attach_Attribute_to_Product({ commit }, item) {
    let formData = new FormData()
    formData.append('prodId', item.prodId)
    formData.append('attrId', item.attrId)
    return axios
      .put(`/api/v1/admin/products/attach-attribute`, formData)
      .then((response) => {
        commit('setAttachAttribute', response.data.model)
        return response
      })
  },
  detach_Attribute_from_Product({ commit }, item) {
    let formData = new FormData()
    formData.append('prodId', item.prodId)
    formData.append('attrId', item.attrId)
    return axios
      .put(`/api/v1/admin/products/detach-attribute`, formData)
      .then((response) => {
        commit('setDetachAttribute', response.data.model)
        return response
      })
  },
  set_Price_for_PriceCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('PriceCategoryId', item.PriceCategoryId)
    formData.append('Price', item.Price)
    return axios
      .post(`/api/v1/admin/products/${item.ProductId}/set-price`, formData)
      .then((response) => {
        commit('setPriceForPriceCategory', response.data.model)
        return response
      })
  },
  update_Price_for_PriceCategory({ commit }, item) {
    let formData = new FormData()
    formData.append('PriceCategoryId', item.PriceCategoryId)
    formData.append('Price', item.Price)
    return axios
      .put(`/api/v1/admin/products/${item.ProductId}/set-price`, formData)
      .then((response) => {
        commit('setPriceForPriceCategory', response.data.model)
        swal(
          i18n.t('PriceCategory.priceCategoryUpdatedSuccessfully'),
          response.data.message,
          'success'
        )
        return response
      })
      .catch((err) => {
        swal(
          i18n.t('common.error'),
          i18n.t('common.informationIsIncorrect'),
          'error'
        )
        console.log(err)
      })
  }
}

export default {
  namespaced: true,
  name: 'Product',
  state,
  getters,
  actions,
  mutations
}
