<template>

  <v-card>
    <v-card-title>
      {{ $t('dashboard.overDueAmounts') }}
    </v-card-title>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="overDueAmounts"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-0"
      :item-class="cursor"
      @click:row="goToDue"
    >
      <template v-slot:[`item.createdAt`]="{ item }">
        <span dir="ltr">{{ datetimeFormater(item.createdAt) }}</span>
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

      headers: [

        {

          text: this.$i18n.t('dashboard.merchant'),
          value: 'merchantName'

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
    ...mapGetters('Dashboard', ['getOverDueAmounts', 'getLoading']),
    overDueAmounts() {

      return this.getOverDueAmounts
    },
    loading() {
      return this.getLoading
    }
  },
  mounted() {
    this.theOverDueAmounts()

  },

  methods: {
    ...mapActions('Dashboard', ['fetchOverdue']),
    theOverDueAmounts() {

      this.fetchOverdue()
    },
    cursor(item) {
      console.log(item)
      const rowClass = 'cursor'

      return rowClass
    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    goToDue(item) {
      console.log(item)
      this.$router.push({ name:'PotentialMerchant-invoices', params: {singlemerchent_id: item.userId}})

    }
  }

}
</script>

<style>
.cursor {
  cursor: pointer;

}
</style>
