<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Bills.bills') + ' - ' + getBillsList.merchantName }}</div>
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
        :items="getBillsList.payments.model"
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
              <v-col cols="12" md="4" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="searchFilter.DateFrom"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchFilter.DateFrom"
                      clearable
                      :label="$t('Bills.dateFrom')"
                      readonly
                      outlined
                      v-bind="attrs"
                      style="margin: 18px 0 0 0"
                      class="my-2"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchFilter.DateFrom"
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
                      @click="$refs.menu.save(searchFilter.DateFrom)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu></v-col>
              <v-col cols="12" md="4" sm="6">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="searchFilter.DateTo"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchFilter.DateTo"
                      clearable
                      :label="$t('Bills.dateTo')"
                      readonly
                      outlined
                      v-bind="attrs"
                      style="margin: 18px 0 0 0"
                      class="my-2"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchFilter.DateTo"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu2.save(searchFilter.DateTo)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu></v-col>
              <v-col cols="12" md="4" sm="6">
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
            <v-row class="pa-2">
              <v-col cols="12" md="3" sm="4" style="font-weight: bold">
                {{ $t('Bills.numberOfMovements') }}:
                {{ getBillsList.numberOfMovements }}</v-col>
              <v-col cols="12" md="3" sm="4" style="font-weight: bold">
                {{ $t('common.total') }}:
                {{
                  getBillsList.total ? getBillsList.total.toFixed(2) : 0
                }}</v-col>
              <v-col cols="12" md="3" sm="4" style="font-weight: bold">
                {{ $t('Bills.balance') }}:
                {{
                  getBillsList.balance ? getBillsList.balance.toFixed(2) : 0
                }}</v-col>
            </v-row>
          </div>
        </template>
        <template v-slot:[`item.sid`]="{ item }">
          <copy-label :text="String(item.sid)" />
        </template>
        <template v-slot:[`item.invoiceSid`]="{ item }">
          <copy-label :text="item.invoiceSid" />
        </template>
        <template v-slot:[`item.movement`]="{ item }">
          {{
            item.paymentType ? item.paymentType.name : $t('common.doesnotExist')
          }}
        </template>
        <template v-slot:[`item.paidAt`]="{ item }">
          {{ item.createdAt ? item.createdAt.substr(0, 10) : '' }}
        </template>
        <template v-slot:[`item.method`]="{ item }">
          {{
            item.paymentMethod
              ? item.paymentMethod.name
              : $t('common.doesnotExist')
          }}
        </template>
        <template v-slot:[`item.debtor`]="{ item }">
          {{ item.debtor ? item.debtor.toFixed(2) : 0 }}
        </template>
        <template v-slot:[`item.creditor`]="{ item }">
          {{ item.creditor ? item.creditor.toFixed(2) : 0 }}
        </template>
        <template v-slot:[`item.balance`]="{ item }">
          {{ item.balance ? item.balance.toFixed(2) : 0 }}
        </template>

        <template v-slot:[`item.notes`]="{ item }"> 
          
          <div v-if="item.notes" class="text-center"> {{ item.notes }}  </div>
          <div v-else class="text-center"> - </div>
        </template>
        <template v-slot:[`item.attachment`]="{ item }"> 
          <v-btn v-if="item.attachment" :href="item.attachment" target="_blank" elevation="0" >{{$t('common.download')}}</v-btn>
          <div v-else class="text-center"> - </div>
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
export default {
  components: {
    CopyLabel,
    loading
  },
  data() {
    return {
      searchFilter: {
        UserID: '',
        DateFrom: '',
        DateTo: '',
        PageNumber: 1
      },
      menu: false,
      menu2: false,
      isLoading: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Merchants'),
          disabled: false,
          to: '/PotentialMerchants/list'
        },
        {
          text: this.$i18n.t('Bills.bills')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('Invoices.id'),
          value: 'sid'
        },
        {
          text: this.$i18n.t('Invoices.documentId'),
          value: 'invoiceSid'
        },
        {
          text: this.$i18n.t('Invoices.typeOfMovement'),
          value: 'movement'
        },
        {
          text: this.$i18n.t('Invoices.movementDate'),
          value: 'paidAt',
          width: '100px'
        },
        {
          text: this.$i18n.t('Invoices.paymentMethod'),
          value: 'method'
        },
        {
          text: this.$i18n.t('Bills.debtor'),
          value: 'debtor'
        },
        {
          text: this.$i18n.t('Bills.creditor'),
          value: 'creditor'
        },
        {
          text: this.$i18n.t('Bills.balance'),
          value: 'balance'
        },
        {
          text: this.$i18n.t('common.notes'),
          value: 'notes'
        },
        {
          text: this.$i18n.t('common.Attachments'),
          value: 'attachment'
        }
      ],
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required')
      }
    }
  },
  computed: {
    ...mapGetters('PotentialMerchant', ['getBillsList', 'getLastPage'])
  },

  methods: {
    ...mapActions('PotentialMerchant', ['fetchBills']),

    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    searchFilters() {
      this.isLoading = true
      this.fetchBills(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    emptyFilters() {
      this.isLoading = true
      this.searchFilter = {
        UserID: '',
        DateFrom: '',
        DateTo: '',
        PageNumber: 1
      }
      this.searchFilter.UserID = this.$route.params.singlemerchent_id
      this.fetchBills(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.page) {
          await this.$router.replace({ query: { ...route.query, page: 1 } })

          return
        }
        this.searchFilter.UserID = route.params.singlemerchent_id
        this.searchFilter.PageNumber = route.query.page
        this.loading = true
        this.$store
          .dispatch('PotentialMerchant/fetchBills', this.searchFilter)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.UserID == null) this.searchFilter.UserID = ''
        if (searchFilter.DateFrom == null) this.searchFilter.DateFrom = ''
        if (searchFilter.DateTo == null) this.searchFilter.DateTo = ''
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
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
