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
        class="elevation-1" >
        <template v-slot:top>
          <div class="py-2">
            <v-row class="px-2">
              <v-col cols="12" md="4" sm="4">
                <v-autocomplete
                  v-model="searchFilter.agentId"
                  clearable
                  :label="$t('users.delegateName')"
                  :items="
                    getDelegateList.map(({ name, userId }) => ({
                      text: name,
                      value: userId
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="my-2"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="4" sm="4">
                <v-autocomplete
                  v-model="searchFilter.UserID"
                  clearable
                  :label="$t('users.customerName')"
                  :items="
                    getMerchantList.map(({ name, userId }) => ({
                      text: name,
                      value: userId
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="my-2"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="4" sm="4">
                <v-text-field
                  v-model="searchFilter.searchString"
                  clearable
                  outlined
                  :label="$t('common.orderId')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                </v-text-field></v-col>
              <v-col cols="12" md="4" sm="4">
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
                      :label="$t('Orders.orderedAt')"
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
              <v-col cols="12" md="4" sm="3">
                <v-autocomplete
                  v-model="searchFilter.status"
                  clearable
                  :items="[
                    'Pending',
                    'Accepted',
                    'Prepared',
                    'Delivered',
                    'Canceled',
                    'Rejected'
                  ]"
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
                        v-if="data.item === 'Prepared'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Delivered'"
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
                      <span
                        v-if="data.item === 'Canceled'"
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
                        v-if="data.item === 'Prepared'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Delivered'"
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
                      <span
                        v-if="data.item === 'Canceled'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="4" sm="3">
                <v-autocomplete
                  v-model="searchFilter.role"
                  clearable
                  :items="[
                    'Merchant',
                    'User',
                  ]"
                  outlined
                  dense
                  :label="$t('common.role')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                  <template v-slot:selection="data" class="selection">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Merchant'"
                        class="m-0 green--text text--darken-4"
                      >
                        {{ $t(`Orders.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'User'"
                        class="m-0 warning--text text--darken-2"
                      >
                        {{ $t(`Orders.${data.item}`) }}
                      </span>

                    </v-list-item-content>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Merchant'"
                        class="m-0 green--text text--darken-4"
                      >
                        {{ $t(`Orders.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'User'"
                        class="m-0 warning--text text--darken-2"
                      >
                        {{ $t(`Orders.${data.item}`) }}
                      </span>

                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="4" sm="3">
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
                    <v-btn color="primary" class="mx-2" @click="emptyFilters()">
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
        <template  v-slot:[`item.agent`]="{ item }">
          {{ item.agent? item.agent.name: "-" }}
        </template>
        <template v-slot:[`item.customer`]="{ item }">
          {{ item.user.name }}
        </template>
        <template v-slot:[`item.orderedAt`]="{ item }">
          <span dir="ltr">{{ datetimeFormater(item.orderedAt) }}</span>
        </template>
        <template v-slot:[`item.totalItems`]="{ item }">
          {{ item.totalItems }}
        </template>
        <template  v-slot:[`item.totalPrice`]="{ item }">

          {{ item.invoice? item.invoice.customPrice.toFixed(2) : 0 }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <span :class="`m-0 `+ item.status+`--text`">
            {{ $t(`common.${item.status}`) }}
          </span>
        </template>

        <template v-slot:[`item.Details`]="{ item }">

          <v-btn
            color="primary"
            dark
            class="my-2"
            :to="{
              name: 'details-of-order',
              params: { orderId: item.id }
            }"
            depressed
          >
            {{ $t('common.details') }}
          </v-btn>
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
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import payments from '../../components/orders/Payments'
export default {
  components: {
    CopyLabel,
    loading,
    payments
  },
  data() {
    return {
      searchFilter: {
        agentId: '',
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1,
        role: ''
      },
      confirmText: '',
      menu: false,
      isLoading: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.sales'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.orders')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('common.orderId'),
          value: 'number'
        },
        {
          text: this.$i18n.t('users.delegateName'),
          value: 'agent'
        },
        {
          text: this.$i18n.t('users.customerName'),
          value: 'customer'
        },
        {
          text: this.$i18n.t('Orders.orderedAt'),
          value: 'orderedAt'
        },
        {
          text: this.$i18n.t('common.productsNumbers'),
          value: 'totalItems'
        },
        {
          text: this.$i18n.t('ecommerce.price'),
          value: 'totalPrice'
        },
        {
          text: this.$i18n.t('common.status'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        }
      ],
      rejectReason: '',
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
     /*    {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
          value: 'productQuantities'
        }, */
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
    ...mapGetters('AllOrders', ['getOrdersList', 'getLastPage', 'getOrder']),
    ...mapGetters('Delegates', ['getDelegateList']),
    ...mapGetters('Merchant', ['getMerchantList'])
  },

  methods: {
    ...mapActions('Delegates', ['fetchDelegates']),
    ...mapActions('Merchant', ['fetchMerchants']),
    ...mapActions('AllOrders', [
      'fetchOrders',
      'fetchOrder',
      'acceptOrder',
      'prepareOrder',
      'deliverOrder',
      'rejectOrder',
      'cancelOrder'
    ]),

    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    searchFilters() {
      console.log(this.searchFilter)
      this.isLoading = true
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    emptyFilters() {
      this.isLoading = true
      this.searchFilter = {
        agentId: '',
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        role: '',
        PageNumber: 1
      }
      this.$router.push('?page=1')
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    acceptThisOrder(item) {
      this.loading = true
      item.status = 'Accepted'
      this.acceptOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    prepareThisOrder(item) {
      this.loading = true
      item.status = 'Prepared'
      this.prepareOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    deliverThisOrder(item) {
      this.loading = true
      item.status = 'Delivered'
      this.deliverOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    confirmAction(item) {
      if (item.status === 'Pending') {
        this.acceptThisOrder(item)
      } else if (item.status === 'Accepted') {
        this.prepareThisOrder(item)
      } else {
        this.deliverThisOrder(item)
      }
    },
    rejectThisOrder(item) {
      this.loading = true
      const obj = {
        id: item.id,
        reason: this.rejectReason
      }

      if (item.status === 'Pending') {
        item.status = 'Rejected'
        this.rejectOrder(obj).finally(() => {
          this.loading = false
        })
      } else {
        item.status = 'Canceled'
        this.cancelOrder(obj).finally(() => {
          this.loading = false
        })
      }
    },
    datetimeFormater(date){
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
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
          .dispatch('AllOrders/fetchOrders', this.searchFilter)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.agentId == null) this.searchFilter.agentId = ''
        if (searchFilter.UserID == null) this.searchFilter.UserID = ''
        if (searchFilter.createdDate == null) this.searchFilter.createdDate = ''
        if (searchFilter.status == null) this.searchFilter.status = ''
        if (searchFilter.role == null) this.searchFilter.role = ''
        if (searchFilter.searchString == null)
          this.searchFilter.searchString = ''
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchDelegates()
    this.fetchMerchants()
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
