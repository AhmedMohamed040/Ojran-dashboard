<template>
  <div class="my-5">
    <div>
      <v-card>
        <v-card-title>{{ $t('Product.transferStock') }}</v-card-title>
        <v-divider class="my-2"></v-divider>
        <v-card-text>
          <v-row class="profile">
            <v-col cols="12" md="4" class="py-1">
              <v-select
                v-model="Product.CurrentWarehouseId"
                append-icon="mdi-warehouse"
                outlined
                :items="
                  getWarehousesStock.map(({ id, name }) => ({
                    text: name,
                    value: id
                  }))
                "
                @change="QuantityInWarehouse()"
                :label="$t('Product.warehouse')"
              >
              </v-select>
            </v-col>

            <v-col cols="12" md="4" class="py-1">
              <v-select
                v-model="Product.NewWarehouseId"
                :disabled="Product.QuantityUnitId == ''"
                append-icon="mdi-warehouse"
                outlined
                :items="
                  getWarehousesList.map(({ id, nameAr }) => ({
                    text: nameAr,
                    value: id
                  }))
                "
                :label="$t('Product.newwarehouse')"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="4" class="py-1">
              <v-text-field
                v-model="Product.Quantity"
                outlined
                :label="$t('Product.productQuantity')"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="8" class="py-1">
              <p class="red--text" v-if="Product.CurrentWarehouseId == ''">{{$t('Product.pleaseChooseWarehouse')}}</p>
              <div
                class="product_quantity_area"
                v-if="Product.CurrentWarehouseId != ''"
              >
                <v-card
                  v-for="item in getQuantityInWarehouse
                    ? getQuantityInWarehouse
                    : []"
                  :key="item.id"
                  class="mx-auto my-2"
                  max-width="344"
                  :color="
                    item.id == Product.ProductQuantityId
                      ? 'primary lighten-1'
                      : ''
                  "
                  :dark="item.id == Product.ProductQuantityId"
                >
                  <v-card-text>
                    <div>
                      {{ $t('Product.addedDate') }}
                      {{ item.createdAt.substr(0, 10) }}
                    </div>
                    <p class="text-h4 text--primary my-2">
                      {{ $t('Product.quantity') }} {{ item.quantity }}
                    </p>
                    <p>
                      {{ $t('Product.addedBy') }}
                      {{ item.addedByUser ? item.addedByUser.name : '---' }}
                    </p>
                    <p>
                      {{ $t('Product.BoughtPrice') }} {{ item.boughtPrice }}
                    </p>
                    <p>
                      {{ $t('Product.quantityUnit') }}
                      {{ item.quantityUnit ? item.quantityUnit.name : '----' }}
                    </p>
                    <p>
                      {{ $t('Product.invoice') }}
                      {{ item.invoice ? item.invoice : '----' }}
                    </p>
                    <p>
                      {{ $t('Product.notes') }}
                      {{ item.notes ? item.notes : '----' }}
                    </p>
                  </v-card-text>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      class="my-2 mx-2"
                      height="40"
                      v-if="item.id != Product.ProductQuantityId"
                      @click="selectProductQuantity(item.id)"
                    >
                      {{ $t('common.select') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="py-1">
              <v-textarea
                v-model="Product.Notes"
                outlined
                :label="$t('Product.notes')"
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="4" offset-md="4" class="py-1">
              <v-btn
                color="primary"
                block
                height="50"
                class="my-3"
                @click="transferThisStock()"
                :disabled="
                  Product.quantity === '' ||
                  Product.CurrentWarehouseId === '' ||
                  Product.QuantityUnitId === '' ||
                  Product.NewWarehouseId === ''
                "
              >
                <v-icon left>mdi-package-up</v-icon>
                {{ $t('common.transfer') }}
              </v-btn>
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
      reveal: false,
      Product: {
        Quantity: '',
        CurrentWarehouseId: '',
        ProductQuantityId: '',
        NewWarehouseId: '',
        Notes:''
      }
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
    ])
  },
  methods: {
    ...mapActions('ProductProps', ['fetchWarehouses', 'fetchQuantityUnits']),
    ...mapActions('ProductStock', [
      'transferStock',
      'fetchWarehouseStock',
      'fetchQuantityInWarehouse'
    ]),
    selectProductQuantity(id) {
      this.Product.ProductQuantityId = id
    },
    QuantityInWarehouse() {
      this.fetchQuantityInWarehouse({
        product_id: this.$route.params.product_id,
        warehouse_id: this.Product.CurrentWarehouseId
      })
    },
    async transferThisStock() {
      let res = await this.transferStock({
        id: this.$route.params.product_id,
        Quantity: this.Product.Quantity,
        ProductQuantityId: this.Product.ProductQuantityId,
        CurrentWarehouseId: this.Product.CurrentWarehouseId,
        NewWarehouseId: this.Product.NewWarehouseId,
        Notes: this.Product.Notes,
      })
      if(res.status == 200){
        this.Product = {
        Quantity: '',
        CurrentWarehouseId: '',
        ProductQuantityId: '',
        NewWarehouseId: '',
        Notes:''
      };
        this.QuantityInWarehouse()
      }
    }
  },
  mounted() {
    this.fetchWarehouses()
    this.fetchQuantityUnits()
    this.fetchWarehouseStock(this.$route.params.product_id)
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
.product_quantity_area {
  height: 80vh;
  overflow-y: scroll;
}
</style>
