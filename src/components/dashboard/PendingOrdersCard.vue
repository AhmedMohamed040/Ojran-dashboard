<template>

  <v-card>
    <v-card-title class="d-flex justify-space-between">
      {{ $t('Orders.pendingOrders') }}
      <v-btn color="primary" @click="goToOrders()">{{ $t('common.showAll') }}</v-btn>
    </v-card-title>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="orders"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      :height="360"
      :item-class="cursor"

      class="elevation-0"
      @click:row="goToOrder"
    >
      <template v-slot:[`item.number`]="{ item }">
        <copy-label :text="item.number" />
      </template>
      <template v-slot:[`item.agent`]="{ item }">
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
      <template v-slot:[`item.totalPrice`]="{ item }">

        {{ item.invoice? item.invoice.customPrice.toFixed(2) : 0 }}
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <span :class="`m-0 `+ item.status+`--text`">
          {{ $t(`common.${item.status}`) }}
        </span>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment'

import CopyLabel from '../common/CopyLabel'
import loading from '@/components/common/loading'

import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading
  },

  data () {
    return {
      role: '',
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
        }
      ]

    }
  },
  computed: {
    ...mapGetters('Dashboard', ['getOrders', 'getLoading']),
    orders() {

      return this.getOrders
    },
    loading() {
      return this.getLoading
    }
  },
  mounted() {
    this.theOrders()
  },

  methods: {
    ...mapActions('Dashboard', ['fetchOrders', 'fetchAgentOrders', 'fetchAgentMerchantOrders']),
    theOrders() {
      const role = localStorage.getItem('role')

      this.role = role
      if (role == 'Admin') {

        this.fetchOrders()
      } else if ( role == 'Agent') {
        // this.fetchAgentOrders()
        this.fetchAgentMerchantOrders()
      }
      else {
        this.fetchOrders()
      }

    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    goToOrders() {
      if (this.role == 'Admin') {

        this.$router.push({ name: 'all-orders' })
      } else if (this.role == 'Agent') {
        this.$router.push({ name: 'orders-list' })
      }
    },
    goToOrder(item) {
      if (this.role == 'Admin') {
        this.$router.push({ name: 'details-of-order', params: { orderId: item.id } })
      } else if (this.role == 'Agent') {
        this.$router.push({ name: 'orders-list' })
      }
    },
    cursor(item) {
      console.log(item)
      const rowClass = 'cursor'

      return rowClass
    }
  }

}
</script>

<style>
div > .v-data-table__wrapper {
  height: 100%;
}
</style>
