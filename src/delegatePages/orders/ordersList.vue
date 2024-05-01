<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.orders') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>

    <div v-if="!loading">
      <div class="my-1 d-flex justify-end">
        <v-dialog transition="dialog-top-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="fetchPotentialMerchant"
            >
              {{ $t('Orders.createOrder') }}
            </v-btn>
          </template>
          <template v-slot:default="createdialog">
            <v-card>
              <v-toolbar color="primary" dark>{{
                $t('Orders.createOrder')
              }}</v-toolbar>
              <v-card-text>
                <v-row class="my-2">
                  <v-col cols="12">
                    {{ $t('Orders.selectMerchantToCreateOrderForHim') }}
                  </v-col>
                  <v-col cols="12" md="6" offset-md="4">
                    <v-autocomplete
                      v-model="selectedMerchantId"
                      :label="$t('PotentialMerchantVisit.merchantName')"
                      :items="
                        getPotentialMerchantList.map(({ name, userId }) => ({
                          text: name,
                          value: userId
                        }))
                      "
                      style="margin: 18px 0 0 0"
                      outlined
                      :loading="isLoadingMerchant"
                      :search-input.sync="searchMerchant"
                      :no-filter="true"
                      class="my-2"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="primary"
                  class="mx-2"
                  :disabled="!selectedMerchantId"
                  :to="{
                    name: 'create-order',
                    params: { merchant: selectedMerchantId }
                  }"
                >
                  {{ $t('Orders.makeOrderForThisMerchant') }}
                </v-btn>
                <v-btn text @click="createdialog.value = false">{{
                  $t('common.cancel')
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-data-table
        dense
        :loading="isLoading"
        :headers="headers"
        :items="getOrdersList"
        item-key="id"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <div class="py-2">
            <v-row class="px-2">
              <v-col cols="12" md="2" sm="4">
                <v-autocomplete
                  v-model="searchFilter.merchantId"
                  clearable
                  :label="$t('PotentialMerchantVisit.merchantName')"
                  :items="
                    getPotentialMerchantList.map(({ name, id }) => ({
                      text: name,
                      value: id
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="my-2"
                  :loading="isLoadingMerchant"
                  :search-input.sync="searchMerchantSelected"
                  :no-filter="true"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="3" sm="4">
                <v-text-field
                  v-model="searchFilter.searchString"
                  clearable
                  outlined
                  :label="$t('common.orderId')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                </v-text-field></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="searchFilter.createdDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchFilter.createdDate"
                      clearable
                      :label="$t('Orders.creationDate')"
                      readonly
                      outlined
                      v-bind="attrs"
                      style="margin: 18px 0 0 0"
                      class="my-2"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchFilter.createdDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(searchFilter.createdDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-autocomplete
                  v-model="searchFilter.status"
                  clearable
                  :items="['Pending', 'Accepted', 'Rejected']"
                  outlined
                  dense
                  :label="$t('common.status')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                  <template v-slot:selection="data" class="selection">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Pending'"
                        class="m-0deep-orange--text text--darken-4"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Accepted'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Pending'"
                        class="m-0 deep-orange--text text--darken-4"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Accepted'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                </v-autocomplete></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-row class="my-2">
                  <v-col cols="6">
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      small
                      color="primary"
                      @click="searchFilters()"
                    >
                      <v-icon dark> mdi-magnify </v-icon>
                    </v-btn></v-col>
                  <v-col cols="6">
                    <v-btn
                      color="primary"
                      class="mx-2"
                      @click="fetchPotentialMerchant()"
                    >
                      {{ $t('common.showAll') }}
                    </v-btn></v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:[`item.number`]="{ item }">
          <copy-label :text="item.number" />
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt.substr(0, 10) }}
        </template>
        <template v-slot:[`item.customPrice`]="{ item }">
          {{ item.customPrice.toFixed(2) }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <span
            v-if="item.status === 'Pending'"
            class="m-0 deep-orange--text text--darken-4"
          >
            {{ $t(`common.${item.status}`) }}
          </span>
          <span
            v-if="item.status === 'Accepted'"
            class="m-0 success--text text--darken-2"
          >
            {{ $t(`common.${item.status}`) }}
          </span>
          <span v-if="item.status === 'Rejected'" class="m-0 red--text">
            {{ $t(`common.${item.status}`) }}
          </span>
        </template>

        <template v-slot:[`item.Details`]="{ item }">
          <!-- v-model="dialog" -->
          <v-dialog max-width="1200" transition="dialog-bottom-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="my-2"
                v-bind="attrs"
                @click="x(item.id)"
                v-on="on"
              >
                {{ $t('common.details') }}
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title class="primary white--text">
                  <span class="text-h5">{{ $t('common.details') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    dark
                    text
                    @click="
                      dialog.value = false
                      updatePriceAndItemsNumber(item)
                    "
                  >
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row class="my-2">
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.orderId') }}
                      </v-col>

                      <v-col cols="9">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.number }}
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.creationDate') }}
                      </v-col>
                      <v-col cols="9">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.createdAt.substr(0, 10) }}
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.status') }}
                      </v-col>
                      <v-col cols="9">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span
                              v-if="item.status === 'Pending'"
                              class="m-0 deep-orange--text text--darken-4"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                            <span
                              v-if="item.status === 'Accepted'"
                              class="m-0 success--text text--darken-2"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                            <span
                              v-if="item.status === 'Rejected'"
                              class="m-0 red--text"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.totalPrice') }}
                      </v-col>
                      <v-col cols="9">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.totalPrice.toFixed(2) }}
                          {{ $t('common.sar') }}
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.customDiscount') }}
                      </v-col>
                      <v-col cols="9">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span>
                              {{ getOrder.customDiscount.toFixed(2) }}
                              {{ $t('common.sar') }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.customPrice"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.customPrice') }}
                      </v-col>
                      <v-col v-if="getOrder.customPrice" cols="9">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span>
                              {{ getOrder.customPrice.toFixed(2) }}
                              {{ $t('common.sar') }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.rejectReason"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.rejectReason') }}
                      </v-col>
                      <v-col v-if="getOrder.rejectReason" cols="9">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span> {{ getOrder.rejectReason }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.tableOfProducts') }}
                      </v-col>

                      <v-col cols="12">
                        <v-data-table
                          dense
                          :loading="isLoading"
                          :headers="headers2"
                          :items="getOrder.orderRequestItems"
                          item-key="id"
                          hide-default-footer
                          disable-filtering
                          disable-pagination
                          disable-sort
                          class="elevation-1"
                        >
                          <template v-slot:[`item.name`]="{ item }">
                            {{ item.product.name }}
                          </template>
                          <template v-slot:[`item.imageUrl`]="{ item }">
                            <img
                              v-if="item.product.imageUrl"
                              :src="item.product.imageUrl"
                              width="77"
                              height="77"
                              class="elevation-1"
                              alt="User"
                              style="border-radius: 5px"
                            />
                            <template v-else>
                              {{ $t('Orders.noPhoto') }}
                            </template>
                          </template>
                          <template v-slot:[`item.category`]="{ item }">
                            <template v-if="item.product.category">
                              {{ item.product.category.name }}
                            </template>
                            <template v-else>
                              {{ $t('Orders.unknown') }}
                            </template>
                          </template>

                          <template v-slot:[`item.manufacturer`]="{ item }">
                            <template v-if="item.product.manufacturer">
                              {{ item.product.manufacturer.name }}
                            </template>
                            <template v-else>
                              {{ $t('Orders.unknown') }}
                            </template>
                          </template>
                          <template v-slot:[`item.quantity`]="{ item }">
                            <template v-if="item.quantity">
                              {{ item.quantity }}
                            </template>
                            <template v-else>
                              {{ $t('Orders.unknown') }}
                            </template>
                          </template>
                          <template v-slot:[`item.price`]="{ item }">
                            <div>
                              {{ item.price }} × {{ item.quantity }}<br />
                              {{ item.price * item.quantity }}
                              {{ $t('common.sar') }}
                            </div>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <hr class="header-divider primary" />
              </v-card>
            </template>
          </v-dialog>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="900">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="mr-2"
                v-bind="attrs"
                :disabled="item.status != 'Pending'"
                @click="assign(item)"
                v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>{{
                  $t('common.edit')
                }}</v-toolbar>
                <v-card-text>
                  <v-row class="my-2">
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="editedOrder.merchantId"
                        :label="$t('PotentialMerchantVisit.merchantName')"
                        :items="
                          getPotentialMerchantList.map(({ name, userId }) => ({
                            text: name,
                            value: userId
                          }))
                        "
                        style="margin: 18px 0 0 0"
                        outlined
                        dense
                        class="my-2"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4" class="py-2">
                      <v-text-field
                        v-model="editedOrder.CustomPrice"
                        outlined
                        :label="$t('Product.customPrice')"
                        :rules="[rules.required]"
                        @input="displayCustomDiscount(item.totalPrice)"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" class="py-2">
                      <v-text-field
                        v-model="editedOrder.CustomDiscount"
                        outlined
                        :label="$t('Product.customDiscount')"
                        :rules="[
                          rules.cDMax(
                            editedOrder.CustomDiscount,
                            item.totalPrice
                          )
                        ]"
                        @input="displayCustomPrice(item.totalPrice)"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedOrder.CustomDiscountDetails"
                        outlined
                        rows="4"
                        prepend-icon="mdi-pen"
                        :label="$t('Product.CustomDiscountDetails')"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="primary"
                    :loading="isLoading"
                    dark
                    @click="editOrder(item), (dialog.value = false)"
                  >
                    {{ $t('common.edit') }}
                  </v-btn>
                  <v-btn text @click="dialog.value = false">{{
                    $t('common.cancel')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>

        <template v-slot:[`item.delete`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon :disabled="item.status != 'Pending'">delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('Orders.deleteOrder')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{ $t('Orders.AreYouSureYouWantToDeleteThisOrder') }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    @click="deleteThisOrder(item.id), (dialog.value = false)"
                  >
                    {{ $t('common.delete') }}
                  </v-btn>
                  <v-btn text @click="dialog.value = false">{{
                    $t('common.cancel')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
    </div>
  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading
  },

  data() {
    return {
      searchFilter: {
        merchantId: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      },
      menu: false,
      selectedMerchantId: '',
      isLoading: false,
      isLoadingMerchant: false,
      searchMerchant: null,
      searchMerchantSelected: null,
      loading: true,
      page: this.getCurr_page,
      editedOrder: {
        id: '',
        merchantId: '',
        CustomPrice: '',
        CustomDiscount: '',
        CustomDiscountDetails: ''
      },

      breadcrumbs: [
        {
          text: this.$i18n.t('menu.orders'),
          disabled: false,
          href: '/orders/list'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],

      searchQuery: '',
      selectedUsers: [],
      headers: [
        {
          text: this.$i18n.t('common.orderId'),
          value: 'number'
        },
        {
          text: this.$i18n.t('common.date'),
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('PotentialMerchantVisit.merchantName'),
          value: 'merchant.name'
        },
        {
          text: this.$i18n.t('common.productsNumbers'),
          value: 'totalItems'
        },
        {
          text: this.$i18n.t('ecommerce.price'),
          value: 'customPrice'
        },
        {
          text: this.$i18n.t('common.status'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        },
        {
          text: this.$i18n.t('common.edit'),
          value: 'actions'
        },
        {
          text: this.$i18n.t('common.delete'),
          value: 'delete'
        }
      ],
      headers2: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('Product.productImage'),
          value: 'imageUrl'
        },
        {
          text: this.$i18n.t('Product.category'),
          value: 'category'
        },

        {
          text: this.$i18n.t('Product.manufacturer'),
          value: 'manufacturer'
        },
        {
          text: this.$i18n.t('Product.quantity'),
          value: 'quantity'
        },

        {
          text: this.$i18n.t('Product.price'),
          value: 'price'
        }
      ],
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required'),
        cDMax: (value, total) =>
          value <= total / 2 ||
          this.$i18n.t(
            'Orders.valueOfCustomDiscountShouldNotExceedTheHalfOfTotal'
          )
      }
    }
  },
  computed: {
    ...mapGetters('Order', ['getOrdersList', 'getLastPage', 'getOrder']),
    ...mapGetters('PotentialMerchant', ['getPotentialMerchantList'])
  },

  methods: {
    ...mapActions('PotentialMerchant', ['fetchPotentialMerchant']),
    ...mapActions('Order', [
      'fetchOrders',
      'fetchOrder',
      'updateeOrder',
      'deleteOrder',
      'increaseOrder',
      'decreaseOrder',
      'deleteItem'
    ]),
    x(id) {
      this.fetchOrder(id).then(() => {
        console.log(this.getOrder)
      })
    },
    ...mapMutations('Order', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    close() {
      this.dialog = false
    },
    searchFilters() {
      this.isLoading = true
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    emptyFilters() {
      this.isLoading = true
      this.searchFilter = {
        merchantId: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      }
      this.$router.push('?page=1')
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    increaseThisOrder(item, orderId) {
      if (item.quantity <= item.productQuantity.quantity) {
        this.isLoading = true
        this.increaseOrder({ item, orderId })
          .then(() => {
            item.quantity++
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    decreaseThisOrder(item, orderId) {
      this.isLoading = true
      this.decreaseOrder({ item, orderId })
        .then(() => {
          item.quantity--
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deleteThisItem(item, orderId) {
      this.isLoading = true
      this.deleteItem({ item, orderId })
        .then(() => {
          if (this.getOrder.orderRequestItems.length === 1) {
            this.deleteThisOrder(orderId)
          } else {
            this.getOrder.orderRequestItems.forEach((element, index) => {
              if (item.id === element.id) {
                this.getOrder.orderRequestItems.splice(index, 1)
              }
            })
          }
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
          console.log(err)
        })
    },
    updatePriceAndItemsNumber(item) {
      item.totalPrice = this.getOrder.totalPrice
      item.totalItems = this.getOrder.orderRequestItems.length
    },
    deleteThisOrder(id) {
      this.isLoading = true
      this.deleteOrder(id)
        .then(() => {
          this.isLoading = false
          this.getOrdersList.forEach((element, index) => {
            if (element.id === id) {
              this.getOrdersList.splice(index, 1)
            }
          })
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    assign(item) {
      this.editedOrder.id = item.id
      this.editedOrder.MerchantId = item.merchant.id
      this.editedOrder.CustomPrice = item.customPrice
      this.editedOrder.CustomDiscount = item.customDiscount
      this.editedOrder.CustomDiscountDetails = item.customDiscountDetails
    },
    editOrder(item) {
      this.isLoading = true
      this.updateeOrder(this.editedOrder)
        .then(() => {
          this.isLoading = false
          item.customPrice = this.editedOrder.CustomPrice
          item.customDiscount = this.editedOrder.CustomDiscount
          item.customDiscountDetails = this.editedOrder.CustomDiscountDetails
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    displayCustomDiscount(total) {
      this.editedOrder.CustomDiscount = total - this.editedOrder.CustomPrice
    },
    displayCustomPrice(total) {
      this.editedOrder.CustomPrice = total - this.editedOrder.CustomDiscount
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.page) {
          await this.$router.replace({ query: { ...route.query, page: 1 } })

          return
        }
        this.searchFilter.PageNumber = route.query.page
        this.$store
          .dispatch('Order/fetchOrders', this.searchFilter)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.merchantId == null) this.searchFilter.merchantId = ''
        if (searchFilter.createdDate == null) this.searchFilter.createdDate = ''
        if (searchFilter.status == null) this.searchFilter.status = ''
        if (searchFilter.searchString == null)
          this.searchFilter.searchString = ''
      },
      deep: true,
      immediate: true
    },
    searchMerchant(val) {
      this.isLoadingMerchant = true
      this.fetchPotentialMerchant({ SearchString: val })
      this.isLoadingMerchant = false
    },
    searchMerchantSelected(val) {
      console.log(val)
      this.isLoadingMerchant = true
      this.fetchPotentialMerchant({ SearchString: val })
      this.isLoadingMerchant = false
    }
  },
  mounted() {
    this.fetchPotentialMerchant()
    this.page = Number(this.$route.query.page)
  }
}
</script>

<style lang="scss" scoped>
.visitPhotos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.filterBox {
  background-color: #fff;
  padding: 5px;
}
</style>
