<template>
  <div class="my-5">
    <div>
      <v-card>
        <v-card-title>{{ $t('Product.stockInfo') }}</v-card-title>
        <v-divider class="my-2"></v-divider>
        <v-card-text>
          <v-row class="profile">
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="getQuantityInWarehouse"
                loading-text="جاري تحميل البيانات"
                no-data-text="لا يوجد بيانات"
                hide-default-footer
                disable-filtering
                disable-pagination
                disable-sort
                class="elevation-1"
              >
                <template v-slot:item.createdAt="{ item }">
                  {{ item.createdAt.substr(0, 10) }}
                </template>
                <template v-slot:item.totalUnits="{ item }">
                  {{ item.quantityUnit ? item.quantity / item.quantityUnit.quantityFill: '----' }}
                </template>
                <template v-slot:item.quantityUnit="{ item }">
                  {{ item.quantityUnit ? item.quantityUnit.name : '----' }}
                </template>
                <template v-slot:item.warehouse="{ item }">
                  {{ item.warehouse ? item.warehouse.name : '----' }}
                </template>
                <template v-slot:item.notes="{ item }">
                  {{ item.notes ? item.notes : '---' }}
                </template>
                <template v-slot:item.addedByUser="{ item }">
                  {{ item.addedByUser.name ? item.addedByUser.name : '---' }}
                </template>
             <!--    <template v-slot:item.actions="{ item }">
                  <v-dialog transition="dialog-top-transition" max-width="750">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        depressed
                        height="45"
                        class="my-5"
                        dark
                        color="red lighten-2"
                        v-on="on"
                        @click="attr.ProductQuantityId = item.id;
                                ProductAttributeValue.ProductQuantityId = item.id;
                        "
                      >
                        {{ $t('ProductAttributes.showProductAttributes') }}
                      </v-btn>
                    </template>
                    <template v-slot:default="dialog">
                      <v-card>
                        <v-toolbar color="primary" dark>{{
                          $t('ProductAttributes.productAttributes')
                        }}</v-toolbar>
                        <v-card-text class="my-2">
                          <v-row>
                            <v-col cols="12" class="mt-3">
                              <v-select
                                v-model="attr.ProductAttributeId"

                                append-icon="mdi-sitemap"
                                outlined
                                :items="
                                  item.productAttributes.map(
                                    ({ id, nameAr }) => ({
                                      text: nameAr,
                                      value: id
                                    })
                                  )
                                "
                                :label="
                                  $t('ProductAttributes.productAttributes')
                                "
                                @change="
                                  (ProductAttributeValue.ProductAttributeId =
                                    attr.ProductAttributeId);
                                  showProductAttributeValue();
                                  isColor = item.productAttributes.find(
                                    item => item.id === attr.ProductAttributeId
                                  ).isColor;
                                  isImage = item.productAttributes.find(
                                    item => item.id === attr.ProductAttributeId
                                  ).isImage;
                                "
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="attr.ProductAttributeId" class="my-2" align-content="start" justify="start">
                            <v-col v-if="has" cols="6" md="2">
                              <h3>{{ $t('common.stutas') }}</h3>
                            </v-col>
                            <v-col v-if="has" cols="6" md="4">
                              <v-radio-group v-model="status" row @change="changeProductAttributeValueStatus({id: attr.id , status :status })">
                                <v-radio
                                  :label="$t('common.active')"
                                  color="primary"
                                  :value="true"
                                ></v-radio>
                                <v-radio
                                  :label="$t('common.inactive')"
                                  color="red darken-3"
                                  :value="false"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                            <v-col v-if="has" cols="6" md="2">
                              <h3>{{ $t('common.delete') }}</h3>
                            </v-col>
                            <v-col v-if="has" cols="6" md="4">
                              <v-dialog
                                transition="dialog-top-transition"
                                max-width="600"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    color="error"
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    <v-icon>delete</v-icon>
                                  </v-btn>
                                </template>
                                <template v-slot:default="dialog">
                                  <v-card>
                                    <v-toolbar color="red" dark>{{
                                      $t('ProductAttributes.deleteProductAttributeValue')
                                    }}</v-toolbar>
                                    <v-card-text>
                                      <h4 class="my-3 red--text">
                                        {{
                                          $t(
                                            'ProductAttributes.AreYouSureYouWantToDeleteThisProductAttributeValue'
                                          )
                                        }}
                                      </h4>
                                    </v-card-text>
                                    <v-card-actions class="justify-end">
                                      <v-btn
                                        color="red"
                                        dark
                                        @click="
                                          deleteProductAttributeValue(attr.id);
                                          closeDialog(); (dialog.value = false);"
                                      >
                                        {{ $t('common.delete') }}
                                      </v-btn>
                                      <v-btn
                                        text
                                        @click="(dialog.value = false)"
                                      >{{ $t('common.cancel') }}</v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </template>
                              </v-dialog>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.NameEn"
                                outlined

                                :label="$t('common.nameInEnglish')"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.NameAr"
                                outlined

                                :label="$t('common.nameInArabic')"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.Cost"
                                outlined
                                type="number"

                                :label="$t('Product.productPrice')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-checkbox
                                v-model="attr.IsPreSelected"
                                :label="$t('common.IsPreSelected')"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.DisplayOrder"
                                outlined
                                type="number"

                                :label="$t('Product.DisplayOrder')"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.WeightAdjustment"
                                outlined

                                :label="$t('Product.WeightAdjustment')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.PriceAdjustmentUsePercentage"
                                type="number"
                                outlined

                                :label="
                                  $t('Product.PriceAdjustmentUsePercentage')
                                "
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="attr.PriceAdjustment"
                                type="number"
                                outlined

                                :label="$t('Product.PriceAdjustment')"
                              ></v-text-field>
                            </v-col>

                            <v-col v-if="isColor" cols="12" md="6">
                              <v-color-picker
                                v-model="attr.ColorSquaresHex"
                                mode="hexa"
                                hide-mode-switch
                                elevation="15"
                              ></v-color-picker>
                            </v-col>

                            <v-col v-if="isImage" cols="12" md="6">
                              <div class="photo_content">
                                <v-file-input
                                  v-model="attr.ImageSquaresPicture"
                                  class="my-2 mx-10"
                                  :prepend-icon="
                                    attr.ImageSquaresPicture != null
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
                                  v-if="attr.ImageSquaresPicture != null"
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
                            v-if="has"
                            color="blue darken-1"
                            dark
                            @click="
                              updateProductAttributeValue(attr);
                              closeDialog();
                            "
                          >
                            {{ $t('common.edit') }}
                          </v-btn>
                          <v-btn
                            v-if="!has"
                            color="blue darken-1"
                            dark
                            @click="
                              postProductAttributeValue(attr);
                              closeDialog();
                              (dialog.value = false);
                            "
                          >
                            {{ $t('common.save') }}
                          </v-btn>
                          <v-btn text @click="closeDialog(); (dialog.value = false)">{{
                            $t('common.cancel')
                          }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </template> -->
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
// make card different color when selected & refetch data & add loaing
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      dialog: false,
      src: '',
      status: true,

      has: false,
      isColor: false,
      isImage: false,
      ProductAttributeValue : {
        ProductId: this.$route.params.product_id,
        ProductQuantityId: '',
        ProductAttributeId: ''
      },
      attr: {
        id: '',
        NameEn: '',
        NameAr: '',
        Cost: '',
        DisplayOrder: '',
        IsPreSelected: false,
        ColorSquaresHex: '',
        ImageSquaresPicture: null,
        WeightAdjustment: '',
        PriceAdjustmentUsePercentage: '',
        PriceAdjustment: '',
        ProductAttributeId: '',
        ProductId: this.$route.params.product_id,
        ProductQuantityId: ''
      },
      headers: [
        {
          text: this.$i18n.t('Product.addedDate'),
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('Product.addedBy'),
          value: 'addedByUser'
        },
        {
          text: this.$i18n.t('Product.warehouse'),
          value: 'warehouse'
        },
        {
          text: this.$i18n.t('Product.BoughtPrice'),
          value: 'boughtPrice'
        },
        {
          text: this.$i18n.t('Product.quantity'),
          value: 'quantity'
        },
        {
          text: this.$i18n.t('Product.totalUnits'),
          value: 'totalUnits'
        },
        {
          text: this.$i18n.t('Product.quantityUnit'),
          value: 'quantityUnit'
        },
        {
          text: this.$i18n.t('Product.invoice'),
          value: 'invoice'
        },
        {
          text: this.$i18n.t('Product.notes'),
          value: 'notes'
        },
     /*    {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
          value: 'actions'
        } */
      ]
    }
  },
  computed: {
    ...mapGetters('ProductProps', [
      'getWarehousesList',
      'getQuantityUnitsList'
    ]),
    ...mapGetters('ProductStock', [
      'getWarehousesStock',
      'getQuantityInWarehouse'
    ]),
    ...mapGetters('ProductAttributesValue', ['getProductAttributeValue'])
  },
  methods: {
    ...mapActions('ProductProps', ['fetchWarehouses', 'fetchQuantityUnits']),
    ...mapActions('ProductAttributesValue', ['postProductAttributeValue' , 'changeProductAttributeValueStatus' , 'fetchProductAttributeValue' , 'updateProductAttributeValue' , 'deleteProductAttributeValue']),
    ...mapActions('ProductStock', [
      'transferStock',
      'fetchWarehouseStock',
      'fetchQuantityInWarehouse'
    ]),
    displayPhotos() {
      this.src = URL.createObjectURL(this.attr.ImageSquaresPicture)
    },
    showProductAttributeValue() {
      this.fetchProductAttributeValue(this.ProductAttributeValue).then(() => {
        this.attr.NameAr = this.getProductAttributeValue.nameAr
        this.attr.NameEn = this.getProductAttributeValue.nameEn
        this.attr.Cost = this.getProductAttributeValue.cost
        this.attr.DisplayOrder = this.getProductAttributeValue.displayOrder
        this.attr.IsPreSelected = this.getProductAttributeValue.isPreSelected
        this.attr.ColorSquaresHex = this.getProductAttributeValue.colorSquaresHex
        this.src = this.getProductAttributeValue.imageSquaresPicture
        this.attr.WeightAdjustment = this.getProductAttributeValue.weightAdjustment
        this.attr.PriceAdjustmentUsePercentage = this.getProductAttributeValue.priceAdjustmentUsePercentage
        this.attr.PriceAdjustment = this.getProductAttributeValue.priceAdjustment
        this.attr.id = this.getProductAttributeValue.id
        this.has = true
        console.log(this.attr.id)
      }).catch((err) => {
        console.log(err)
        this.has = false
        this.attr.NameAr = ''
        this.attr.NameEn = ''
        this.attr.Cost = ''
        this.attr.DisplayOrder = ''
        this.attr.IsPreSelected = false
        this.attr.ColorSquaresHex = ''
        this.src = ''
        this.attr.WeightAdjustment = ''
        this.attr.PriceAdjustmentUsePercentage = ''
        this.attr.PriceAdjustment = ''
        this.attr.id = ''

      })
    },
    closeDialog() {
      this.attr.ProductAttributeId = null
      this.attr.NameAr = ''
      this.attr.NameEn = ''
      this.attr.Cost = ''
      this.attr.DisplayOrder = ''
      this.attr.IsPreSelected = false
      this.attr.ColorSquaresHex = ''
      this.src = ''
      this.attr.WeightAdjustment = ''
      this.attr.PriceAdjustmentUsePercentage = ''
      this.attr.PriceAdjustment = ''
      this.attr.id = ''

    }

  },
  mounted() {
    this.fetchQuantityInWarehouse({ product_id: this.$route.params.product_id })
  }
}
</script>
<style scoped>
.product_quantity_area {
  height: 8 70vh;
  overflow-y: scroll;
}
</style>
