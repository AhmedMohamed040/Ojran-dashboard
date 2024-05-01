<template>

  <v-card>
    <v-card-title>
      {{ $t('dashboard.receipts') }}
    </v-card-title>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="receipts"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-0"
      :item-class="cursor"
      @click:row="goToReceipt"

    >
      <template v-slot:[`item.createdAt`]="{ item }">
        <span dir="auto">{{ datetimeFormater(item.createdAt) }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment'

import loading from '@/components/common/loading'

import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    loading
  },

  data () {
    return {
      isLoading: false,
      loading: true,
      headers: [

        {

          text: this.$i18n.t('dashboard.agent'),
          value: 'agentName'

        },
        {
          text: this.$i18n.t('dashboard.merchantCompanyName'),
          value: 'merchantCompanyName'

        },
        {
          text: this.$i18n.t('dashboard.amount'),
          value: 'amount'

        },
        {
          text: this.$i18n.t('dashboard.overdueDeadline'),
          value: 'createdAt'

        }

      ]

    }
  },
  computed: {
    ...mapGetters('Dashboard', ['getReceipts']),
    receipts() {

      return this.getReceipts
    }

  },
  mounted() {
    this.theRecipts()
  },

  methods: {
    ...mapActions('Dashboard', ['fetchReceipts']),
    theRecipts() {

      this.fetchReceipts().finally(() => {
        this.loading = false
      })

    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    cursor(item) {
      const rowClass = 'cursor'

      return rowClass
    },
    goToReceipt(item) {
      console.log(item)
      this.$router.push({ name:'merchents-bills', params: { bill_id: item.userId}})
    }

  }

}
</script>

<style>
.cursor {
  cursor: pointer;

}
</style>
