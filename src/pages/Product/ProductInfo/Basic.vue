<template>
  <div class="my-2">
    <div>
      <v-card>
        <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row class="my-2">
            <v-col cols="12" md="3">
              <div class="photo_content">
                 <img
                  v-if="Product.imageUrl"
                  :src="Product.imageUrl"
                  width="87"
                  height="87"
                  class="elevation-1 mx-5 my-2"
                  alt="User"
                  style="border-radius: 5px"
                />
                <v-img
                  v-else
                  src="/images/avatars/avatar1.svg"
                  max-width="70"
                  class="my-2"
                >
                </v-img>
                <h3 class="mx-5 mb-4">{{ $t('Product.productImage') }}</h3>
              </div>
            </v-col>
            <v-col cols="12" md="8">
              <v-row class="profile">
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.nameEn"
                    outlined
                    disabled
                    rounded
                    :label="$t('common.nameInEnglish')"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.nameAr"
                    outlined
                    disabled
                    rounded
                    :label="$t('common.nameInArabic')"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.quantity"
                    outlined
                    disabled
                    rounded
                    :label="$t('Product.productQuantity')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.category.name"
                    rounded
                    disabled
                    append-icon="mdi-sitemap"
                    outlined
                    :label="$t('Product.category')"
                  ></v-text-field>

                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                     v-model="Product.warehouse.name"
                    rounded
                    disabled
                    append-icon="mdi-warehouse"
                    outlined
                    :label="$t('Product.warehouse')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.manufacturer.name"
                    rounded
                    append-icon="mdi-account-reactivate-outline"
                    outlined
                    disabled

                    :label="$t('Product.manufacturer')"
                  ></v-text-field>

                </v-col>

                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.shortDetails"
                    outlined
                    disabled
                    rounded
                    :label="$t('Product.shortDescription')"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.details"
                    outlined
                    disabled
                    rounded
                    :label="$t('Product.productDetails')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.boughtPrice"
                    outlined
                    disabled
                    rounded
                    :label="$t('Product.BoughtPrice')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-checkbox
                    v-model="Product.isGiftedCard"
                    disabled
                    :label="$t('Product.isGiftedCard')"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.defaultPrice"
                    outlined
                    rounded
                    disabled
                    :label="$t('Product.productPrice')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="py-1">
                  <v-text-field
                    v-model="Product.defaultMerchantPrice"
                    outlined
                    rounded
                    disabled
                    :label="$t('Product.priceForMerchant')"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3" class="py-1">
                  <h3>{{ $t('Product.showForCustomer') }}</h3>
                </v-col>
                <v-col cols="12" md="3" class="py-1">
                  <v-switch disabled v-model="Product.showForCustomer"></v-switch>
                </v-col>

                <v-col cols="12" md="3" class="py-1">
                  <h3>{{ $t('Product.showForMerchant') }}</h3>
                </v-col>
                <v-col cols="12" md="3" class="py-1">
                  <v-switch disabled v-model="Product.showForMerchant"></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
   props : {
    Product : {
      type : Object,
      default : () => ({
       id: '',
        NameAr: '',
        NameEn: '',
        CategoryId: '',
        ShortDetails: '',
        Details: '',
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
        ProductImages: []
      })
    }
  },
  data() {
    return {
      more: false,

      panel: [],
      dialog: false,
      deleteDialog: false,
      disableDialog: false,

    }
  },
  computed: {

  },
  methods: {



  },
  mounted() {


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
