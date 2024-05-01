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
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="Product.NameEn"
                    :error-messages="getErrors.NameEn"
                    outlined
                    :label="$t('common.nameInEnglish') + ' *'"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
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

                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="Product.Category"
                    :error-messages="getErrors.CategoryId"
                    :label="$t('Product.category') + ' *'"
                    outlined
                    append-icon="mdi-sitemap"
                    :loading="isLoadingCategory"
                    :search-input.sync="searchCategory"
                    clearable
                    return-object
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
                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="Product.subCategory"
                    :label="$t('Product.subCategory') + ' *'"
                    outlined
                    append-icon="mdi-sitemap"
                    :loading="isLoadingSubCategory"
                    :search-input.sync="searchSubCategory"
                    clearable
                    return-object
                    :no-filter="true"
                    :items="
                      getSubCategoriesList.map(({ id, nameAr }) => ({
                        text: nameAr,
                        value: id
                      }))
                    "
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-expansion-panels v-model="panel" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Product.priceDetails')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="profile my-2">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.BoughtPrice"
                  outlined
                  :label="$t('Product.BoughtPrice') + ' *'"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.DefaultPrice"
                  outlined
                  :label="$t('Product.productPrice') + ' *'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.DefaultMerchantPrice"
                  outlined
                  :label="$t('Product.priceForMerchant') + ' *'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.Discount"
                  outlined
                  :label="$t('Product.discount')"
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="3" class="d-flex align-center">
                <h3>{{ $t('Product.showForCustomer') }}</h3>
                <v-switch
                  v-model="Product.IsShowForCustomer"
                  class="mx-4"
                ></v-switch>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.MaxStock"
                  :disabled="!Product.IsShowForCustomer"
                  outlined
                  :label="$t('Product.maxStock')"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="3" class="d-flex align-center">
                <h3>{{ $t('Product.showForMerchant') }}</h3>
                <v-switch
                  v-model="Product.IsShowForMerchant"
                  class="mx-4"
                ></v-switch>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.MaxMerchantStock"
                  :disabled="!Product.IsShowForMerchant"
                  outlined
                  :label="$t('Product.maxMerchantStock')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox
                  v-model="Product.IsGiftedCard"
                  :label="$t('Product.isGiftedCard')"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="Product.GiftCardId"
                  :disabled="!Product.IsGiftedCard"
                  append-icon="mdi-gift"
                  outlined
                  :items="
                    getGiftCardsList.map(({ id, nameAr }) => ({
                      text: nameAr,
                      value: id
                    }))
                  "
                  :label="$t('Product.giftCard')"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('menu.PriceCategories')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="my-2">
              <v-col cols="12">
                <v-data-table
                  :headers="PriceCategoriesHeaders"
                  :items="getPriceCategoriesList"
                  loading-text="جاري تحميل البيانات"
                  no-data-text="لا يوجد بيانات"
                  hide-default-footer
                  disable-filtering
                  disable-pagination
                  disable-sort
                  class="elevation-1"
                >
                  <template v-slot:[`item.add`]="{ item }">
                    <v-checkbox
                      :value="item.id"
                      :disabled="!item.price"
                      indeterminate
                      @change="
                        pushPriceCategory({
                          id: item.id,
                          price: item.price
                        })
                      "
                    ></v-checkbox>
                  </template>
                  <template v-slot:[`item.price`]="{ item }">
                    <v-text-field
                      v-model="item.price"
                      class="my-2"
                      outlined
                      type="number"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Product.warehouseDetails')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="profile my-2">
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="Product.WarehouseId"
                  :error-messages="getErrors.WarehouseId"
                  :label="$t('Product.warehouse') + ' *'"
                  outlined
                  append-icon="mdi-warehouse"
                  :loading="isLoadingWarehouse"
                  :search-input.sync="searchWarehouse"
                  clearable
                  return-object
                  :no-filter="true"
                  :items="
                    getWarehousesList.map(({ id, name }) => ({
                      text: name,
                      value: id
                    }))
                  "
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.Quantity"
                  outlined
                  :label="$t('Product.quantity')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
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

              <v-col cols="12" md="3">
                <v-chip
                  v-if="countedUnits"
                  label
                >{{ countedUnits }}</v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Product.searchEngineOptimization')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="profile my-2">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.MetaDetails"
                  outlined
                  label="Meta Details"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.MetaKeywords"
                  outlined
                  label="Meta Keywords"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.MetaTitle"
                  outlined
                  label="Meta Title"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Product.moreDetails')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="profile my-2">
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="Product.ManufacturerId"
                  :error-messages="getErrors.ManufacturerId"
                  :label="$t('Product.manufacturer') + ' *'"
                  outlined
                  append-icon="mdi-account-reactivate-outline"
                  :loading="isLoadingManufacturer"
                  :search-input.sync="searchManufacturer"
                  clearable
                  return-object
                  :no-filter="true"
                  :items="
                    getManfuctersList.map(({ id, name }) => ({
                      text: name,
                      value: id
                    }))
                  "
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.ShortDetailsAr"
                  :error-messages="getErrors.ShortDetailsAr"
                  outlined
                  :label="$t('Product.shortDescriptionAr') + ' *'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="Product.ShortDetailsEn"
                  :error-messages="getErrors.ShortDetailsEn"
                  outlined
                  :label="$t('Product.shortDescriptionEn') + ' *'"
                ></v-text-field>
              </v-col>

              <v-row cols="12" md="6" class="ma-0">
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="Product.DetailsAr"
                    :error-messages="getErrors.DetailsAr"
                    outlined
                    :label="$t('Product.productDetailsAr') + ' *'"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="Product.DetailsEn"
                    :error-messages="getErrors.DetailsEn"
                    outlined
                    :label="$t('Product.productDetailsEn') + ' *'"
                  ></v-textarea>
                </v-col>

              </v-row>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      <!--   <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('ProductAttributes.productAttributes')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
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
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="my-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ $t('ProductAttributes.createProductAttribute') }}
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="primary white--text">
                        <span class="text-h5">{{
                          $t('ProductAttributes.createProductAttribute')
                        }}</span>
                      </v-card-title>

                      <v-card-text class="mt-2">
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                v-model="NameEn"
                                hint="Accept only Character"
                                :label="$t('common.nameInEnglish')"
                              ></v-text-field>
                              <v-text-field
                                v-model="NameAr"
                                hint="Accept only Character"
                                :label="$t('common.nameInArabic')"
                              ></v-text-field>
                              <v-text-field
                                v-model="DetailsAr"
                                hint="Accept only Character"
                                :label="$t('common.detailsInArabic')"
                              ></v-text-field>
                              <v-text-field
                                v-model="DetailsEn"
                                hint="Accept only Character"
                                :label="$t('common.detailsInEnglish')"
                              ></v-text-field>
                              <v-checkbox
                                v-model="IsColor"
                                :label="$t('ProductAttributes.isColor')"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="IsImage"
                                :label="$t('ProductAttributes.isImage')"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <hr class="header-divider primary" />
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          dark
                          class="my-2 px-3 py-3"
                          @click="save()"
                        >
                          {{ $t('common.save') }}
                        </v-btn>

                        <v-btn
                          color="red darken-1"
                          dark
                          class="my-2 mx-2 px-3 py-3"
                          @click="close()"
                        >
                          {{ $t('common.cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:[`item.add`]="{ item }">
                <v-dialog transition="dialog-top-transition" max-width="750" @click:outside="closeDialog">
                  <template v-slot:activator="{ on, attrs }">
                    <v-checkbox
                      v-model="ProductAttributeIds"
                      :value="item.id"
                      v-on=" !ProductAttributeIds.includes(item.id) && on "
                      @click="openAttrDialog(item, attrs)"
                    ></v-checkbox>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>{{
                        $t('ProductAttributes.productAttributes')
                      }}</v-toolbar>
                      <v-card-text class="my-2">
                        <v-row>
                          <v-col cols="12" class="mt-3">
                          </v-col>
                        </v-row>
                        <v-row class="my-2" align-content="start" justify="start">
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.nameEn"
                              outlined
                              :label="$t('common.nameInEnglish')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.nameAr"
                              outlined
                              :label="$t('common.nameInArabic')"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.cost"
                              outlined
                              type="number"
                              :label="$t('Product.productPrice')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-checkbox
                              v-model="attr.isPreSelected"
                              :label="$t('common.IsPreSelected')"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.displayOrder"
                              outlined
                              type="number"
                              :label="$t('Product.DisplayOrder')"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.weightAdjustment"
                              outlined
                              :label="$t('Product.WeightAdjustment')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.priceAdjustmentUsePercentage"
                              type="number"
                              outlined
                              :label="
                                $t('Product.PriceAdjustmentUsePercentage')
                              "
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="attr.priceAdjustment"
                              type="number"
                              outlined
                              :label="$t('Product.PriceAdjustment')"
                            ></v-text-field>
                          </v-col>

                          <v-col v-if="isColor" cols="12" md="6">
                            <v-color-picker
                              v-model="attr.colorSquaresHex"
                              mode="hexa"
                              hide-mode-switch
                              elevation="15"
                            ></v-color-picker>
                          </v-col>

                          <v-col v-if="isImage" cols="12" md="6">
                            <div class="photo_content">
                              <v-file-input
                                v-model="attr.imageSquaresPicture"
                                class="my-2 mx-10"
                                :prepend-icon="
                                  attr.imageSquaresPicture != null
                                    ? 'mdi-camera primary'
                                    : 'mdi-camera'
                                "
                                hide-input
                                :label="$t('Product.productImage')"
                                @change="displayPhotos()"
                              ></v-file-input>

                              <h3 class="mx-5 mb-4">
                                {{ $t('Product.productImage') }}
                              </h3>
                              <v-img
                                v-if="attr.imageSquaresPicture != null"
                                width="87"
                                height="87"
                                class="elevation-1 mx-6 my-2"
                                alt="User"
                                style="border-radius: 5px"
                                :src="src"
                              ></v-img>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          dark
                          @click="
                            handleAddProductAttr(item);
                            (dialog.value = false);
                          "
                        >
                          {{ $t('common.save') }}
                        </v-btn>
                        <v-btn
                          text
                          @click="
                            (dialog.value = false)
                          "
                        >{{
                          $t('common.cancel')
                        }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
            </v-data-table>

          </v-expansion-panel-content>
        </v-expansion-panel> -->
      </v-expansion-panels>
    </div>
    <div class="saveProductbtn">
      <v-btn
        height="50px"
        width="100px"
        color="primary"
        class="btn-save"
        @click="saveProduct()"
      >
        {{ $t('common.save') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
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
      more: false,
      src: [],
      photosCounter: 0,
      panel: [],
      dialog: false,
      deleteDialog: false,
      disableDialog: false,
      isLoadingWarehouse: false,
      isLoadingCategory: false,
      isLoadingSubCategory: false,
      isLoadingManufacturer: false,
      searchWarehouse: null,
      searchCategory: null,
      searchSubCategory: null,
      searchManufacturer: null,
      showAttrDialog: false,
      NameEn: null,
      NameAr: null,
      DetailsAr: null,
      DetailsEn: null,
      IsColor: false,
      IsImage: false,
      add: false,
      searchQuantityUnit: null,
      isLoadingQuantityUnit: false,
      ProductAttributeValue : {
        ProductId: this.$route.params.product_id,
        ProductQuantityId: '',
        productAttributeId: ''
      },
      attr: {
        id: '',
        nameEn: '',
        nameAr: '',
        cost: '',
        displayOrder: '',
        isPreSelected: false,
        weightAdjustment: '',
        priceAdjustmentUsePercentage: '',
        priceAdjustment: '',
        imageSquaresPicture: null,
        colorSquaresHex: '',
        productAttributeId: '',
        ProductId: this.$route.params.product_id,
        ProductQuantityId: ''
      },
      has: true,
      status: true,
      isColor: false,
      ProductAttributeIds: [],
      attributes: [],
      isImage: false,
      Product: {
        id: '',
        NameAr: '',
        NameEn: '',
        Category: null,
        subCategory: null,
        CategoryId: '',
        ShortDetailsEn: '',
        ShortDetailsAr: '',
        DetailsEn: '',
        DetailsAr: '',
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
      },
      PriceCategoriesHeaders: [
        {
          text: this.$i18n.t('ecommerce.price'),
          value: 'price'
        },
        {
          text: this.$i18n.t('common.name'),
          value: 'nameAr'
        },
        {
          text: this.$i18n.t('common.add'),
          value: 'add'
        }
      ],
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
      ]
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
    ...mapGetters('ProductAttributes', [
      'getProductAttributesList',
      'getFilter'
    ]),
    ...mapGetters('Product', ['getErrors']),
    countedUnits() {
      if (this.Product.QuantityUnitId != '' && this.Product.QuantityUnitId != null) {
        return this.Product.Quantity * this.Product.QuantityUnitId.value + ' ' + this.$t('common.unit')
      }

      return ''
    }
  },
  methods: {
    ...mapActions('Categories', ['fetchSubCategory']),
    ...mapActions('ProductProps', [
      'fetchPriceCategorys',
      'fetchCategories',
      'fetchWarehouses',
      'fetchManfucters',
      'fetchGiftCards',
      'fetchQuantityUnits'
    ]),
    ...mapActions('Product', ['postProduct', 'updateProduct']),
    ...mapActions('ProductAttributes', [
      'fetchProductAttributes',
      'postProductAttribute',
      'changeProductAttributeStatus'
    ]),
    ...mapMutations('ProductAttributes', ['setFilter']),
    saveProduct() {
      const x = { ...this.Product, ProductAttributeValues: this.attributes }

      // console.log(this.Product)
      this.postProduct(x)
    },
    editProduct() {
      this.updateProduct(this.Product)
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
    },
    close() {
      this.dialog = false
    },
    save() {
      this.addProductAttribute()

      this.close()
    },
    addProductAttribute() {
      this.postProductAttribute({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        DetailsAr: this.DetailsAr,
        DetailsEn: this.DetailsEn,
        IsColor: this.IsColor,
        IsImage: this.IsImage
      }).then(() => {
        this.fetchProductAttributes()
      })
    },
    pushPriceCategory(item) {
      this.Product.ProductPriceCategories.push({
        priceCategoryId: item.id,
        price: item.price
      })
      console.table(this.Product.ProductPriceCategories)
    },
    openAttrDialog(item, attrs) {
      this.resetAttrs()
      this.attr.id = item.id
      this.attributes.map( (x) => {
        if (x.id == item.id) {
          this.attr = { ...x }
        }
      })
      attrs.ProductQuantityId = item.id
      this.ProductAttributeValue.ProductQuantityId = item.id
      this.isColor = item.isColor
      this.isImage = item.isImage
    },
    closeDialog(d) {
      d.value = false
    },
    resetAttrs() {
      this.attr.productAttributeId = null
      this.attr.nameAr = ''
      this.attr.nameEn = ''
      this.attr.cost = ''
      this.attr.displayOrder = ''
      this.attr.isPreSelected = false
      this.attr.colorSquaresHex = ''
      this.attr.weightAdjustment = ''
      this.attr.priceAdjustmentUsePercentage = ''
      this.attr.priceAdjustment = ''
      this.attr.id = ''
    },
    handleAddProductAttr(item) {
      const data = JSON.parse(JSON.stringify(this.attr))

      this.attributes = this.attributes.filter( (x) => x.id != item.id)
      this.attributes = [{ ...data, id: data.id }, ...this.attributes]
      this.resetAttrs()
    }
  },
  watch: {
    ProductAttributeIds(val) {
      const selectedAttrs = this.getProductAttributesList.filter( (attr) => val.includes(attr.id))
    },
    searchQuantityUnit (val) {
      this.isLoadingQuantityUnit = true
      this.fetchQuantityUnits({ 'SearchString': val })
      this.isLoadingQuantityUnit = false
    },
    searchWarehouse(val) {
      this.isLoadingWarehouse = true
      this.fetchWarehouses({ 'SearchString': val })
      this.isLoadingWarehouse = false
    },
    searchCategory(val) {
      this.isLoadingCategory = true
      this.fetchCategories({ 'SearchString': val })
      this.isLoadingCategory = false
    },
    // searchSubCategory(val) {
    //   this.isLoadingSubCategory = true;
    //   this.fetchWarehouses({'SearchString': val})
    //   this.isLoadingSubCategory = false
    // },
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
    this.fetchProductAttributes()
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
.plus {
  cursor: pointer;
}
</style>
