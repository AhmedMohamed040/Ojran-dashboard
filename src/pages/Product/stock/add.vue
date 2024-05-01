<template>
  <div class="my-5">
    <div>
      <v-card>
        <v-card-title>{{ $t('Product.addStock') }}</v-card-title>
        <v-divider class="my-2"></v-divider>
        <v-card-text>
          <v-row class="profile">
            <v-col cols="12" md="3" >
              <v-text-field
                v-model="Product.quantity"
                outlined
                :label="$t('Product.productQuantity')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" >
              <v-select
                v-model="Product.QuantityUnit"
                outlined
                append-icon="mdi-cash-check"
                :items="
                  getQuantityUnitsList.map(({ id, nameAr }) => ({
                    text: nameAr,
                    value: id
                  }))
                "
                :label="$t('Product.quantityUnit')"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="3" >
              {{ $t('Product.theNumberOfPiece') }}
              <p v-if="Product.QuantityUnit">{{ piece  *  Product.quantity}}</p>
              <p v-else> 0 </p>
            </v-col>
            <v-col cols="12" md="3" >
              <v-text-field
                v-model="Product.BoughtPrice"
                outlined
                :label="$t('Product.BoughtPrice')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" >
              <v-select
                v-model="Product.WarehouseId"
                outlined
                append-icon="mdi-warehouse"
                :items="
                  getWarehousesList.map(({ id, nameAr }) => ({
                    text: nameAr,
                    value: id
                  }))
                "
                :label="$t('Product.warehouse')"
              >
              </v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="Product.AdditionType"
                outlined
                append-icon="mdi-plus-circle"
                :items="
                  AdditionType.map(({ text, val }) => ({
                    text: text,
                    value: val
                  }))
                "
                :label="$t('Product.AdditionType')"
              >
              </v-select>
            </v-col>
            <v-col cols="0" md="9"></v-col>
            <v-col cols="12" md="4" >
              <v-textarea
                v-model="Product.Notes"
                outlined
                rows="4"
                prepend-icon="mdi-pen"
                :label="$t('Product.notes')"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="4" >
              <v-textarea
                v-model="Product.Invoice"
                rows="4"
                outlined
                prepend-icon="mdi-clipboard-edit-outline"
                :label="$t('Product.invoice')"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="4" offset-md="4" >
              <v-btn
                color="primary"
                block
                height="50"
                class="my-3"
                @click="addNewStock"
                :disabled="
                  Product.quantity === '' ||
                  Product.BoughtPrice === '' ||
                  Product.WarehouseId === '' ||
                  Product.QuantityUnit === '' ||
                  Product.AdditionType === ''
                "
              >
                <v-icon left>mdi-plus</v-icon>
                {{ $t('common.add') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      Product: {
        quantity: '',
        BoughtPrice: '',
        WarehouseId: '',
        QuantityUnit: '',
        AdditionType: '',
        Notes: null,
        Invoice: null
      },
      AdditionType: [
        { text: this.$i18n.t('AdditionType.Open'), val: 'Open' },
        { text: this.$i18n.t('AdditionType.Invoice'), val: 'Invoice' },
        { text: this.$i18n.t('AdditionType.StockExcess'), val: 'StockExcess' }
      ]
    }
  },
  computed: {
    ...mapGetters('ProductProps', [
      'getWarehousesList',
      'getQuantityUnitsList'
    ]),
    ...mapGetters('ProductStock', ['getAddedStock']),
    piece() {
      const quantityUnit = this.getQuantityUnitsList.find((item) => item.id == this.Product.QuantityUnit)
      console.log(quantityUnit)
      return quantityUnit.quantityFill
    },
  },
  methods: {
    ...mapActions('ProductProps', ['fetchWarehouses', 'fetchQuantityUnits']),
    ...mapActions('ProductStock', ['addStock']),
    addNewStock() {
      this.addStock({
        id: this.$route.params.product_id,
        Quantity: this.Product.quantity,
        BoughtPrice: this.Product.BoughtPrice,
        WarehouseId: this.Product.WarehouseId,
        QuantityUnitId: this.Product.QuantityUnit,
        AdditionType: this.Product.AdditionType,
        Notes: this.Product.Notes,
        Invoice: this.Product.Invoice
      })
    }
  },
  mounted() {
    this.fetchWarehouses()
    this.fetchQuantityUnits()
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
