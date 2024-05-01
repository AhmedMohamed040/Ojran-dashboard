<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Orders.addItem') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div class="my-2">
      <v-row class="my-2">
        <v-col cols="12"
          ><h3>{{ $t('Orders.selectProduct') }}</h3></v-col
        >
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="orderItem"
            :items="getProducts"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
            :label="$t('Orders.selectProduct')"
            :disabled="OrdersList.length !== 0"
            @change="addOrderItem"
          >
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar>
                  <img :src="data.item.imageUrl" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    >{{ $t('ecommerce.price') }} :
                    {{ data.item.salePrice }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      dense
      :loading="isLoading"
      :headers="headers"
      :items="OrdersList"
      item-key="subId"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-1"
    >
      <template v-slot:[`item.imageUrl`]="{ item }">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          width="77"
          height="77"
          class="elevation-1"
          alt="User"
          style="border-radius: 5px"
        />
      </template>
    <!--   <template v-slot:[`item.productQuantities`]="{ item }">
        <v-autocomplete
          v-model="item.productQuantity"
          :items="item.productQuantities"
          item-text="name"
          item-value="id"
          return-object
          outlined
          dense
          :rules="[rules.required]"
          :label="$t('ProductAttributes.productAttributes')"
          :disabled="item.added"
        >
          <template v-slot:selection="data" class="selection">
            <template v-if="data.item.productAttributeValues.length !== 0">
              <template v-for="attribute in data.item.productAttributeValues">
                <v-list-item-content>
                  <strong>{{ attribute.productAttribute.name }}:</strong>
                  {{ attribute.name }}
                </v-list-item-content>
              </template>
            </template>
            <template v-else>
              <template>
                <v-list-item-content>
                  {{ $t('Orders.noProperties') }}</v-list-item-content
                >
              </template>
            </template>
          </template>
          <template v-slot:item="data">
            <template v-if="data.item.productAttributeValues.length !== 0">
              <template v-for="attribute in data.item.productAttributeValues">
                <v-list-item-content>
                  <strong>{{ attribute.productAttribute.name }}:</strong>
                  {{ attribute.name }}
                </v-list-item-content>
              </template>
            </template>
            <template v-else>
              <template>
                <v-list-item-content>
                  {{ $t('Orders.noProperties') }}</v-list-item-content
                >
              </template>
            </template>
          </template>
        </v-autocomplete>
      </template> -->
      <template v-slot:[`item.quantity`]="{ item }">
        <v-text-field
          v-if="item.productQuantity"
          :disabled="item.added"
          outlined
          :rules="[
            rules.required,
            rules.quantityMin,
            rules.quantityMax(
              item.productQuantity.quantity,
              item.selectedquantity
            )
          ]"
          type="number"
          min-width="50"
          v-model="item.selectedquantity"
          :label="$t('Product.quantity')"
        ></v-text-field>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <span v-if="item.selectedquantity">
          {{ subTotal(item.selectedquantity, item.salePrice) }}
        </span>
      </template>
      <template v-slot:[`item.remove`]="{ item }">
        <v-btn color="error" :disabled="item.added" @click="removeItem(item)">
          {{ $t('common.remove') }}
        </v-btn>
      </template>
      <template v-slot:[`item.add`]="{ item }">
        <v-btn
          v-if="!item.added"
          color="primary"
          :disabled="!item.selectedquantity || item.productQuantity === null"
          @click="
            Add(
              item.id,
              item.selectedquantity,
              item.productQuantity.id,
              subTotal(item.selectedquantity, item.salePrice),
              item
            )
          "
        >
          {{ $t('common.add') }}
        </v-btn>
        <v-btn
          color="error"
          v-else
          @click="remove(item.id, item, item.selectedquantity, item.salePrice)"
        >
          {{ $t('common.delete') }}
        </v-btn>
      </template>
    </v-data-table>
    <div class="d-flex justify-end my-2">
      <v-btn
        color="primary"
        :disabled="Order.OrderRequestItems.length < 1"
        @click="addItem(OrdersList[0])"
      >
        {{ $t('Orders.addItem') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      subId: 0,
      MerchantId: '',
      dialog: false,
      createdialog: false,
      isLoading: false,
      loading: true,
      values: [],
      page: this.getCurr_page,
      OrdersList: [],
      orderItem: {},
      total: 0,
      headers: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('Product.productImage'),
          value: 'imageUrl'
        },
        {
          text: this.$i18n.t('Product.productPrice'),
          value: 'salePrice'
        },
     /*    {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
          value: 'productQuantities'
        }, */
        {
          text: this.$i18n.t('Product.quantity'),
          value: 'quantity'
        },
        {
          text: this.$i18n.t('Product.price'),
          value: 'price'
        },
        {
          text: this.$i18n.t('common.remove'),
          value: 'remove'
        },
        {
          text: this.$i18n.t('common.add'),
          value: 'add'
        }
      ],
      CustomPrice: null,
      CustomDiscount: null,
      Order: {
        OrderRequestItems: [],
        MerchantId: this.$route.params.merchant,
        CustomDiscount: 0,
        CustomDiscountDetails: ''
      },

      breadcrumbs: [
        {
          text: this.$i18n.t('menu.orders'),
          to: '/orders/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],

      searchQuery: '',
      selectedUsers: [],
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required'),
        quantityMin: (value) =>
          value >= 1 || this.$i18n.t('Orders.quantityShouldBeAtLeast1'),
        quantityMax: (quantity, value) =>
          value <= quantity || this.$i18n.t('Orders.thisQuantityIsUnavailable'),
        cDMax: (value) =>
          value <= this.total / 2 ||
          this.$i18n.t(
            'Orders.valueOfCustomDiscountShouldNotExceedTheHalfOfTotal'
          )
      }
    }
  },
  computed: {
    ...mapGetters('Order', ['getProducts'])
  },

  methods: {
    ...mapActions('Order', ['fetchProducts', 'addProduct']),
    subTotal(quantity, price) {
      return quantity * price
    },
    Add(id, quantity, productQuantityId, price, item) {
      let obj = {
        productId: id,
        productQuantityId: productQuantityId,
        quantity: quantity
      }
      this.Order.OrderRequestItems.push(obj)
      this.total += price
      const index = this.OrdersList.indexOf(item)
      item.added = true
      this.$set(this.OrdersList, index, item)
      this.CustomPrice = this.total
      this.CustomDiscount = 0
    },
    remove(id, item, quantity, price) {
      this.Order.OrderRequestItems.splice(
        this.Order.OrderRequestItems.findIndex(
          (OrderRequestItems) => OrderRequestItems.id === id
        ),
        1
      )
      const index = this.OrdersList.indexOf(item)
      item.added = false
      this.$set(this.OrdersList, index, item)
      this.total -= quantity * price
    },
    addItem(item) {
      this.isLoading = true
      let obj = {
        orderId: this.$route.params.orderId,
        ProductId: item.id,
        productQuantityId: item.productQuantity.id,
        quantity: item.selectedquantity
      }
      this.addProduct(obj)
        .then(() => {
          this.isLoading = false
          this.$router.push('/orders/list')
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    addOrderItem() {
      if (this.orderItem !== {}) {
        let item = Object.assign({}, this.orderItem)
        item.subId = Math.random(0, 10000)
        item.productQuantity = null
        this.OrdersList.push(item)
        this.orderItem = {}
      }
    },
    removeItem(item) {
      const index = this.OrdersList.indexOf(item)
      this.OrdersList.splice(index, 1)
    },
    displayCustomDiscount() {
      this.CustomDiscount = this.total - this.CustomPrice
      this.Order.CustomDiscount = this.CustomDiscount
    },
    displayCustomPrice() {
      this.CustomPrice = this.total - this.CustomDiscount
      this.Order.CustomDiscount = this.CustomDiscount
    }
  },
  mounted() {
    this.fetchProducts(this.$route.params.merchant)
  }
}
</script>
