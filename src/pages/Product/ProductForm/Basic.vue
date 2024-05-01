<template>
  <div class="my-2">
    <div @keyup="$emit('fillProduct', Product)">
      <v-card>
        <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row class="my-2">
            <v-col cols="12" md="3">
              <div class="photo_contentt mb-md-0 mb-6 pa-2">
                <div class="d-flex flex-column align-center">
                  <v-file-input
                    v-model="Product.image"
                    :error-messages="getErrors.ProductImages"
                    class="my-1"
                    :prepend-icon="
                      Product.ProductImages != []
                        ? 'mdi-camera primary'
                        : 'mdi-camera'
                    "
                    hide-input
                    multiple
                    :label="$t('Product.productImage') + ' *'"
                    @change="displayPhotos"
                  ></v-file-input>

                  <h3 class="my-1">{{ $t('Product.productImage') }}</h3>
                  <h4 v-if="photosCounter == 5" class="my-1">5 صور كحد اقصى</h4>
                </div>
                <div class="d-flex flex-row flex-md-column align-center flex-wrap" style="gap: 1rem">
                  <v-img
                    v-for="item in src"
                    :key="item.url"
                    width="87"
                    height="87"
                    class="elevation-1 flex-grow-0"
                    alt="User"
                    style="border-radius: 5px"
                    :src="item.url"
                  >
                    <v-icon dark @click="handleDeleteImage(item)">
                      mdi-close
                    </v-icon>
                  </v-img>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="9">
              <v-row class="profile">
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.NameEn"
                    :error-messages="getErrors.NameEn"
                    outlined
                    :label="$t('common.nameInEnglish') + ' *'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.NameAr"
                    :error-messages="getErrors.NameAr"
                    outlined
                    :label="$t('common.nameInArabic') + ' *'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.Code"
                    :error-messages="getErrors.Code"
                    outlined
                    :label="$t('common.productCode') + ' *'"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.Quantity"
                    outlined
                    :label="$t('Product.productQuantity') + ' *'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    v-model="Product.QuantityUnitId"
                    :error-messages="getErrors.QuantityUnitId"
                    :items="
                      getQuantityUnitsList.map(({ quantityFill, name, id }) => ({
                        text: name,
                        value: quantityFill,
                        id
                      }))
                    "
                    :label="$t('Product.quantityUnit')"
                    outlined
                    clearable
                    :loading="isLoadingQuantityUnit"
                    :search-input.sync="searchQuantityUnit"
                    append-icon="mdi-cash-check"
                    return-object
                    :no-filter="true"
                  ></v-autocomplete>
                </v-col>
  
                <v-col cols="12" sm="6" md="4">
                  <v-chip
                    v-if="countedUnits"
                    label
                  >{{ countedUnits }}</v-chip>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete v-model="Product.WarehouseId" :error-messages="getErrors.WarehouseId"
                    :label="$t('Product.warehouse') + ' *'" outlined append-icon="mdi-warehouse" :loading="isLoadingWarehouse"
                    :search-input.sync="searchWarehouse" return-object clearable :no-filter="true" :items="
                                      getWarehousesList.map(({ id, name }) => ({
                                        text: name,
                                        value: id
                                      }))
                                    "></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                  <v-autocomplete
                    v-model="Product.Category"                    
                    :error-messages="getErrors.CategoryId"
                    :label="$t('Product.category') + ' *'"
                    outlined
                    append-icon="mdi-sitemap"
                    :loading="isLoadingCategory"
                    :search-input.sync="searchCategory"
                    return-object
                    clearable
                    :no-filter="true"
                    :items="
                      getCategoriesList.map(({ id, nameAr }) => ({
                        text: nameAr,
                        value: id
                      }))
                    "
                    @change="fetchSubCategory(Product.Category.value)"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                  <v-autocomplete
                    v-model="Product.subCategory"
                    :label="$t('Product.subCategory')"
                    outlined
                    append-icon="mdi-sitemap"
                    :loading="isLoadingSubCategory"
                    :search-input.sync="searchSubCategory"
                    return-object
                    clearable
                    :no-filter="true"
                    :items="
                      getSubCategoriesList.map(({ id, nameAr }) => ({
                        text: nameAr,
                        value: id
                      }))
                    "
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-autocomplete
                    v-model="Product.ManufacturerId"
                    :error-messages="getErrors.ManufacturerId"
                    :label="$t('Product.manufacturer') + ' *'"
                    outlined
                    append-icon="mdi-account-reactivate-outline"
                    :loading="isLoadingManufacturer"
                    :search-input.sync="searchManufacturer"
                    return-object
                    clearable
                    :no-filter="true"
                    :items="
                      getManfuctersList.map(({ id, name }) => ({
                        text: name,
                        value: id
                      }))
                    "
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.ShortDetailsAr"
                    :error-messages="getErrors.ShortDetailsAr"
                    outlined
                    :label="$t('Product.shortDescriptionAr') + ' *'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.ShortDetailsEn"
                    :error-messages="getErrors.ShortDetailsEn"
                    outlined
                    :label="$t('Product.shortDescriptionEn') + ' *'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.BoughtPrice"
                    outlined
                    :label="$t('Product.BoughtPrice')"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.DefaultPrice"
                    outlined
                    :label="$t('Product.productPrice')"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="4" class="d-flex justify-space-between align-center">
                  <h3>{{ $t('Product.showForCustomer') }}</h3>
                  <v-switch v-model="Product.ShowForCustomer"></v-switch>
                </v-col>
                <v-col cols="12" sm="6" md="4" >
                  <v-text-field
                    v-model="Product.DefaultMerchantPrice"
                    outlined
                    :label="$t('Product.priceForMerchant')"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="4" class="d-flex justify-space-between align-center">
                  <h3>{{ $t('Product.showForMerchant') }}</h3>
                  <v-switch v-model="Product.ShowForMerchant"></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" >
                  <v-textarea
                    v-model="Product.DetailsAr"
                    :error-messages="getErrors.DetailsAr"
                    outlined
                    auto-grow
                    :label="$t('Product.productDetailsAr') + ' *'"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" >
                  <v-textarea
                    v-model="Product.DetailsEn"
                    :error-messages="getErrors.DetailsEn"
                    outlined
                    auto-grow
                    :label="$t('Product.productDetailsEn') + ' *'"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="saveProductbtn">
        <v-btn
          height="50px"
          width="100px"
          color="primary"
          class="btn-save"
          @click="saveProduct"
          :loading="saving"
        >
          {{ $t('common.save') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { throws } from 'assert'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    ProductEdit: {
      type: Object,
      default: () => ({})
    },
    newProduct: {
      type: Object,
      default: () => ({})
    }

  },
  data() {
    return {
      src: [],
      photosCounter: 0,
      dialog: false,
      deleteDialog: false,
      saving: false,
      disableDialog: false,
      isLoadingWarehouse: false,
      isLoadingCategory: false,
      isLoadingSubCategory: false,
      isLoadingManufacturer: false,
      isLoadingQuantityUnit: false,
      searchQuantityUnit: null,
      searchWarehouse: null,
      searchCategory: null,
      searchSubCategory: null,
      searchManufacturer: null,
      Product: {
        id: '',
        NameAr: '',
        NameEn: '',
        Category: null,
        Code: null,
        subCategory: null,
        ShortDetailsAr: '',
        ShortDetailsEn: '',
        DetailsAr: '',
        DetailsEn: '',
        ShowForCustomer: false,
        ShowForMerchant: false,
        MaxStock: '',
        MaxMerchantStock: '',
        DefaultPrice: '',
        DefaultMerchantPrice: '',
        WarehouseId: '',
        BoughtPrice: '',
        Quantity: '',
        QuantityUnitId: '',
        IsGiftedCard: false,
        AdditionType: '',
        GiftCardId: '',
        DeliveryDaysId: '',
        ManufacturerId: '',
        Discount: '',
        ColorHex: '',
        MetaDetails: '',
        MetaKeywords: '',
        MetaTitle: '',
        ProductPriceCategories: [],
        ProductImages: [],
        image: null,
        ProductAttributeValues: []
      }
    }
  },
  computed: {
    ...mapGetters('ProductProps', [
      'getPriceCategoriesList',
      'getCategoriesList',
      'getWarehousesList',
      'getManfuctersList',
      'getGiftCardsList',
      'getQuantityUnitsList'
    ]),
    ...mapGetters('Categories', ['getSubCategoriesList']),
    ...mapGetters('Product', ['getErrors']),
    countedUnits() {
      if (this.Product.QuantityUnitId != '' && this.Product.QuantityUnitId != null) {
        return this.Product.Quantity * this.Product.QuantityUnitId.value + ' ' + this.$t('common.unit')
      }

      return ''
    }
  },
  methods: {
    ...mapActions('ProductProps', [
      'fetchPriceCategorys',
      'fetchCategories',
      'fetchWarehouses',
      'fetchManfucters',
      'fetchGiftCards',
      'fetchQuantityUnits'
    ]),
    ...mapActions('Categories', [
      'fetchSubCategory'
    ]),
    ...mapActions('Product', ['postProduct', 'updateProduct']),
    async saveProduct() {
      this.saving = true;
      await this.postProduct(this.Product);
      this.saving = false;
    },
    editProduct() {
      this.updateProduct(this.Product)
    },
    setProduct() {
      if (this.ProductEdit.nameAr) {
        this.Product.id = this.$route.params.editProduct_id
        this.Product.NameAr = this.ProductEdit.nameAr
        this.Product.Code = this.ProductEdit.code
        this.Product.NameEn = this.ProductEdit.nameEn
        this.Product.CategoryId = this.ProductEdit.category.id
        this.Product.ShortDetailsAr = this.ProductEdit.shortDetailsAr
        this.Product.ShortDetailsEn = this.ProductEdit.shortDetailsEn
        this.Product.Details = this.ProductEdit.details
        this.Product.ShowForCustomer = this.ProductEdit.showForCustomer
        this.Product.ShowForMerchant = this.ProductEdit.showForMerchant
        this.Product.MaxStock = this.ProductEdit.maxStock
        this.Product.MaxMerchantStock = this.ProductEdit.maxMerchantStock
        this.Product.DefaultPrice = this.ProductEdit.defaultPrice
        this.Product.DefaultMerchantPrice =
          this.ProductEdit.defaultMerchantPrice
        this.Product.WarehouseId = this.ProductEdit.warehouse.id
        this.Product.BoughtPrice = this.ProductEdit.boughtPrice
        this.Product.Quantity = this.ProductEdit.quantity
        //      this.Product.IsGiftedCard = this.ProductEdit.isGiftedCard;
        this.Product.AdditionType = this.ProductEdit.additionType
        this.ProductEdit.giftCard ? this.Product.GiftCardId = this.ProductEdit.giftCard.id : ''
        this.Product.ManufacturerId = this.ProductEdit.manufacturer.id
        this.Product.Discount = this.ProductEdit.discount
        this.Product.ColorHex = this.ProductEdit.colorHex
        this.Product.MetaDetails = this.ProductEdit.metaDetails
        this.Product.MetaKeywords = this.ProductEdit.metaKeywords
        this.Product.MetaTitle = this.ProductEdit.metaTitle
        this.Product.ProductPriceCategories = this.ProductEdit.productPriceCategories
        this.Product.ProductImages = this.ProductEdit.imageUrl
      } else {
        this.Product = this.newProduct
      }
    },
    displayPhotos(x) {
      console.log(x)
      if (this.photosCounter <= 5) {
        for (let i = 0; i < this.Product.image?.length; i++) {
          const isExist = this.Product.ProductImages?.filter( (img) => this.Product.image[i].name == img.name)?.length > 0
  
          if (!isExist) {
            this.Product.ProductImages.push(this.Product.image[i])
            this.src.push({ 'url': URL.createObjectURL(this.Product.image[i]), 'name':this.Product.image[i].name })
            this.photosCounter++
            if (this.photosCounter == 5) break
          }
        }
      }
    },
    handleDeleteImage(item) {
      this.Product.ProductImages = this.Product.ProductImages.filter((img) => item.name != img.name)
      this.src = this.src.filter((img) => item.url != img.url)
      this.photosCounter--
    }
  },
  watch: {
    searchWarehouse(val) {
      this.isLoadingWarehouse = true
      this.fetchWarehouses({ 'SearchString': val })
      this.isLoadingWarehouse = false
    },
    searchQuantityUnit (val) {
      this.isLoadingQuantityUnit = true
      this.fetchQuantityUnits({ 'SearchString': val })
      this.isLoadingQuantityUnit = false
    },
    searchCategory(val) {
      this.isLoadingCategory = true
      this.fetchCategories({ 'SearchString': val })
      this.isLoadingCategory = false
    },
    searchSubCategory(val) {
      this.isLoadingSubCategory = true
      this.fetchWarehouses({ 'SearchString': val })
      this.isLoadingSubCategory = false
    },
    searchManufacturer(val) {
      this.isLoadingManufacturer = true
      this.fetchManfucters({ 'SearchString': val })
      this.isLoadingManufacturer = false
    }
  },
  mounted() {
    this.fetchPriceCategorys()
    this.fetchCategories()
    this.fetchWarehouses()
    this.fetchManfucters()
    this.fetchGiftCards()
    this.fetchQuantityUnits()
    // setTimeout(() => {
    //   this.setProduct()
    //   console.log(this.Product)
    // }, 1000)
  }
}
</script>
<style>
.photo_contentt {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  width: auto;
  margin: 10px auto;
}
.saveProduct {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.saveProductbtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
