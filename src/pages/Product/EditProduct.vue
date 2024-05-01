<template>
  <div class="my-2">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Product.updateProduct') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div class="my-2" v-if="Product.id != ''">
      <div @keyup="$emit('fillProduct', Product)">
        <v-card>
          <v-card-title>{{ $t('Product.productInfo') }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="my-2">
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.Code"
                  outlined
                  :label="$t('common.productCode')"
                  hint=""
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.NameEn"
                  outlined
                  :label="$t('common.nameInEnglish')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.NameAr"
                  outlined
                  :label="$t('common.nameInArabic')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="Product.Category"
                  append-icon="mdi-sitemap"
                  outlined
                  :items="
                    getCategoriesList.map(({ id, nameAr }) => ({
                      text: nameAr,
                      value: id
                    }))
                  "
                  :label="$t('Product.category')"
                  @change="fetchSubCategory(Product.Category)"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="Product.subCategory"
                  append-icon="mdi-sitemap"
                  outlined
                  :items="
                    getSubCategoriesList.map(({ id, nameAr }) => ({
                      text: nameAr,
                      value: id
                    }))
                  "
                  :label="$t('Product.subCategory')"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-select
                  v-model="Product.WarehouseId"
                  append-icon="mdi-warehouse"
                  outlined
                  :items="
                    getWarehousesList.map(({ id, name }) => ({
                      text: name,
                      value: id
                    }))
                  "
                  :label="$t('Product.warehouse')"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-select
                  v-model="Product.ManufacturerId"
                  append-icon="mdi-account-reactivate-outline"
                  outlined
                  :items="
                    getManfuctersList.map(({ id, name }) => ({
                      text: name,
                      value: id
                    }))
                  "
                  :label="$t('Product.manufacturer')"
                >
                </v-select>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.ShortDetailsAr"
                  outlined
                  :label="$t('Product.shortDescriptionAr')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.ShortDetailsEn"
                  outlined
                  :label="$t('Product.shortDescriptionEn')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.DetailsAr"
                  outlined
                  :label="$t('Product.productDetailsAr')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.DetailsEn"
                  outlined
                  :label="$t('Product.productDetailsEn')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.BoughtPrice"
                  outlined
                  :label="$t('Product.BoughtPrice')"
                  :hint="$t('Product.BoughtPriceDetails')"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.DefaultPrice"
                  outlined
                  :label="$t('Product.productPrice')"
                  :hint="$t('Product.productPriceDetails')"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.DefaultMerchantPrice"
                  outlined
                  :label="$t('Product.priceForMerchant')"
                  :hint="$t('Product.priceForMerchantDetails')"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.Discount"
                  outlined
                  :label="$t('Product.discount')"
                  :hint="$t('Product.discountDetails')"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="3" class="py-1 d-flex">
                <h3>{{ $t('Product.showForCustomer') }}</h3>
                <v-switch
                  class="mx-4"
                  v-model="Product.ShowForCustomer"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  :disabled="!Product.ShowForCustomer"
                  v-model="Product.MaxStock"
                  outlined
                  :label="$t('Product.maxStock')"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="3" class="py-1 d-flex">
                <h3>{{ $t('Product.showForMerchant') }}</h3>
                <v-switch
                  class="mx-4"
                  v-model="Product.ShowForMerchant"
                ></v-switch>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  :disabled="!Product.ShowForMerchant"
                  v-model="Product.MaxMerchantStock"
                  outlined
                  :label="$t('Product.maxMerchantStock')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-title>{{ $t('menu.PriceCategories') }}
            <v-spacer/>
            <v-btn color="info" @click="priceCatDialog = true">{{$t('common.add')}}</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="my-2">
              <v-col cols="12" md="5">
                <v-data-table
                  :headers="PriceCategoriesHeaders"
                  :items="getProduct.productPriceCategories"
                  loading-text="جاري تحميل البيانات"
                  no-data-text="لا يوجد بيانات"
                  hide-default-footer
                  disable-filtering
                  disable-pagination
                  disable-sort
                  class="elevation-1"
                >
                  <template v-slot:[`item.nameAr`]="{ item }">
                    {{ item.priceCategory.name }}
                  </template>
                  <template v-slot:[`item.price`]="{ item }">
                    <v-text-field
                      class="my-2"
                      v-model="item.price"
                      outlined
                      type="number"
                    ></v-text-field>
                  </template>

                  <template v-slot:[`item.add`]="{ item }">
                    <v-btn
                      color="primary"
                      dark
                      small
                      :disabled="!item.price"
                      @click="updatePriceCategory(item)"
                    >
                      {{ $t('common.edit') }}
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="my-2">
          <v-card-title>{{
            $t('Product.searchEngineOptimization')
          }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="my-2">
              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.MetaDetails"
                  outlined
                  label="Meta Details"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.MetaKeywords"
                  outlined
                  label="Meta Keywords"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" class="py-1">
                <v-text-field
                  v-model="Product.MetaTitle"
                  outlined
                  label="Meta Title"
                ></v-text-field>
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
            @click="editProduct()"
          >
            {{ $t('common.edit') }}
          </v-btn>
        </div>
        <v-divider class="my-3"></v-divider>
    <!--     <v-card class="my-2">
          <v-card-title>{{
            $t('ProductAttributes.productAttributes')
          }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="my-2">
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="getProductAttributesList"
                  loading-text="جاري تحميل البيانات"
                  no-data-text="لا يوجد بيانات"
                  hide-default-footer
                  disable-filtering
                  disable-pagination
                  disable-sort
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat class="d-flex justify-end">
                      <v-btn
                        color="primary"
                        dark
                        class="my-2"
                        :to="{
                          name: 'ProductAttributes-list'
                        }"
                      >
                        {{ $t('ProductAttributes.createProductAttribute') }}
                      </v-btn>
                    </v-toolbar>
                  </template>
                  <template v-slot:[`item.add`]="{ item }">
                    <v-checkbox
                      v-model="Product.ProductAttributeIds"
                      :value="item.id"
                    ></v-checkbox>
                  </template>
                </v-data-table>

                <div class="text-center">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="8">
                        <v-container class="max-width">
                          <v-pagination
                            v-model="page"
                            circle
                            total-visible="7"
                            class="my-4"
                            :length="getLastPage"
                            @input="handlingRoute($event)"
                          ></v-pagination>
                        </v-container>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card> -->
      </div>
    </div>
    <price-category-dialog :data="priceCategoryList" :headers="PriceCategoriesHeaders"  :dialog="priceCatDialog" @close="priceCatDialog = false" @updatePriceCategory="updatePriceCategory"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PriceCategoryDialog from './components/PriceCategoryDialog.vue'

export default {
  components: {
    PriceCategoryDialog
  },
  data() {
    return {
      more: false,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Products'),
          to: '/Products/list',
          exact: true
        },
        {
          text: this.$i18n.t('Product.updateProduct')
        }
      ],
      page: this.getCurr_page,
      priceCatDialog: false,
      Product: {
        id: '',
        NameAr: '',
        NameEn: '',
        Category: '',
        subCategory: '',
        CategoryId: '',
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
        ProductAttributeIds: [],
        AdditionType: '',
        ManufacturerId: '',
        Discount: '',
        ColorHex: '',
        MetaDetails: '',
        MetaKeywords: '',
        MetaTitle: ''
      },
      headers: [
        {
          text: this.$i18n.t('common.nameInEnglish'),
          value: 'nameEn'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr'
        },
        {
          text: this.$i18n.t('common.detailsInArabic'),
          value: 'detailsAr'
        },
        {
          text: this.$i18n.t('common.detailsInEnglish'),
          value: 'detailsEn'
        },
        {
          text: this.$i18n.t('common.add'),
          value: 'add'
        }
      ],
      PriceCategoriesHeaders: [
        {
          text: this.$i18n.t('Product.priceCategoryName'),
          value: 'nameAr'
        },
        {
          text: this.$i18n.t('Product.productPrice'),
          value: 'price'
        },
        {
          text: this.$i18n.t('common.add')+"/"+this.$i18n.t('common.edit'),
          value: 'add'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Product', ['getProduct']),
    ...mapGetters('Categories', ['getSubCategoriesList']),
    ...mapGetters('ProductProps', [
      'getPriceCategoriesList',
      'getCategoriesList',
      'getWarehousesList',
      'getManfuctersList',
      'getGiftCardsList',
      'getQuantityUnitsList'
    ]),
    ...mapGetters('ProductAttributes', [
      'getProductAttributesList',
      'getFilter',
      'getLastPage'
    ]),
    priceCategoryList(){
      if(this.getProduct.productPriceCategories == undefined) return [];
      else{
        let arr = this.getPriceCategoriesList;
        this.getProduct.productPriceCategories.forEach(element => {
          arr = arr.filter(item => item.id != element.priceCategoryId)
        });
        return arr;
      }
    }
  },
  methods: {
    ...mapActions('Product', [
      'fetchProduct',
      'updateProduct',
      'update_Price_for_PriceCategory'
    ]),
    ...mapActions('Categories', ['fetchSubCategory']),
    ...mapActions('ProductProps', [
      'fetchPriceCategorys',
      'fetchCategories',
      'fetchWarehouses',
      'fetchManfucters',
      'fetchGiftCards',
      'fetchQuantityUnits'
    ]),
    ...mapActions('ProductAttributes', [
      'fetchProductAttributes',
      'changeProductAttributeStatus'
    ]),
    ...mapMutations('ProductAttributes', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    editProduct() {
      this.updateProduct(this.Product)
    },
    setProduct() {
      this.Product.id = this.$route.params.editProduct_id
      this.Product.Code = this.getProduct.code
      this.Product.NameAr = this.getProduct.nameAr
      this.Product.NameEn = this.getProduct.nameEn
      if (this.getProduct.category.parentCategory != null) {
        this.fetchSubCategory(this.getProduct.category.parentCategory.id).then(
          () => {
            this.Product.subCategory = this.getProduct.category.id
            this.Product.Category = this.getProduct.category.parentCategory.id
          }
        )
      } else {
        this.Product.Category = this.getProduct.category.id
      }
      this.Product.CategoryId = this.getProduct.category.id
      // this.Product.ShortDetails = this.getProduct.shortDetails
      // this.Product.Details = this.getProduct.details
      this.Product.ShortDetailsAr = this.getProduct.shortDetailsAr
      this.Product.ShortDetailsEn = this.getProduct.shortDetailsEn
      this.Product.DetailsEn = this.getProduct.detailsEn
      this.Product.DetailsAr = this.getProduct.detailsAr
      this.Product.ShowForCustomer = this.getProduct.showForCustomer
      this.Product.ShowForMerchant = this.getProduct.showForMerchant
      this.Product.MaxStock = this.getProduct.maxStock
      this.Product.MaxMerchantStock = this.getProduct.maxMerchantStock
      this.Product.DefaultPrice = this.getProduct.defaultPrice
      this.Product.DefaultMerchantPrice = this.getProduct.defaultMerchantPrice
      this.Product.WarehouseId = this.getProduct.warehouse.id
      this.Product.BoughtPrice = this.getProduct.boughtPrice
      this.Product.ManufacturerId = this.getProduct.manufacturer.id
      this.Product.Discount = this.getProduct.discount
      this.Product.ColorHex = this.getProduct.colorHex
      this.Product.MetaDetails = this.getProduct.metaDetails
      this.Product.MetaKeywords = this.getProduct.metaKeywords
      this.Product.MetaTitle = this.getProduct.metaTitle
    this.Product.ProductAttributeIds = this.getProduct.productAttributes
    },
    async updatePriceCategory(item) {
      console.log(item)
      var id = item.id
      if(item.priceCategoryId != undefined) id = item.priceCategoryId
      let obj = {
        ProductId: this.$route.params.editProduct_id,
        PriceCategoryId: id,
        Price: item.price
      }
      let res = await this.update_Price_for_PriceCategory(obj)
      if(res.status == 200){
        this.fetchProduct(this.$route.params.editProduct_id)
        this.priceCatDialog = false
      }
    }
  },
  mounted() {
    this.page = Number(this.$route.query.PageNumber)
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.PageNumber) {
          await this.$router.replace({
            query: { ...route.query, PageNumber: 1 }
          })
          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('ProductAttributes/fetchProductAttributes', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchProduct(this.$route.params.editProduct_id)
    this.fetchPriceCategorys()
    this.fetchCategories()
    this.fetchWarehouses()
    this.fetchManfucters()
    this.fetchGiftCards()
    this.fetchQuantityUnits()

    setTimeout(() => {
      this.setProduct()
      console.log(this.Product)
    }, 1000)
  }
}
</script>
<style>
.photo_content {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  width: fit-content;
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
