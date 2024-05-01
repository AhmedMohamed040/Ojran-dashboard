<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Merchants') }}</div>
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
        :items="getPotentialMerchantList"
        item-key="id"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat class="d-flex py-2 mb-2 justify-start">
            <v-text-field
              v-model="searchFilter.searchString"
              :label="$t('common.search')"
              width="20%"
              style="margin: 18px 0 0 0"
              clearable
              outlined
              class="my-2"
              @input="fetchPotentialMerchant(searchFilter)"
            ></v-text-field>
            <v-btn
              color="primary"
              class="mx-2"
              @click="
                searchFilter = {
                  searchString: '',
                  PageNumber: 1
                }
                fetchPotentialMerchant(searchFilter)
              "
            >
              {{ $t('common.showAll') }}
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
          <span class="moderators">{{ item.name }}</span>
        </template>
        <template v-slot:item.userName="{ item }">
          <span class="moderators">{{ item.userName }}</span>
        </template>
        <template v-slot:item.phoneNumber="{ item }">
          <span class="moderators" v-if="item.phone">{{ item.phone }}</span>
          <span class="moderators" v-else>----</span>
        </template>
        <template v-slot:item.email="{ item }">
          <span class="moderators" v-if="item.email">{{ item.email }}</span>
          <span class="moderators" v-else>----</span>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div class="font-weight-bold d-flex align-center text-no-wrap">
            <div v-if="item.status === 'Pending'" class="warning--text">
              <v-icon small color="warning">mdi-circle-medium</v-icon>
              <span>Pending</span>
            </div>
            <div v-if="item.status === 'Declined'" class="secondary--text">
              <v-icon small color="secondary">mdi-circle-medium</v-icon>
              <span>Declined</span>
            </div>
            <div v-if="item.status === 'Accepted'" class="success--text text--darken-2">
              <v-icon small color="success">mdi-circle-medium</v-icon>
              <span>Accepted</span>
            </div>
          </div>
        </template>
        <template v-slot:[`item.address`]="{ item }">
          <div>
            <div v-if="item.address">
              <v-icon small color="warning">mdi-circle-medium</v-icon>
              <span>{{ $t('common.address') }} : {{ item.address }}</span>
            </div>

            <div v-if="item.region">
              <v-icon small color="secondary">mdi-circle-medium</v-icon>
              <span>{{ $t('geography.region') }} : {{ item.region.name }}</span>
            </div>

            <div v-if="item.city" class="success--text text--darken-2">
              <v-icon small color="success">mdi-circle-medium</v-icon>
              <span>{{ $t('geography.city') }} : {{ item.city.name }}</span>
            </div>
          </div>
        </template>
        <template v-slot:item.options="{ item }">
          <v-dialog
            transition="dialog-top-transition"
            max-width="1200"
            v-model="optionsDialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <div class="text-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="my-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t('common.options') }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(option, index) in optionsList"
                      :key="index"
                      style="cursor: pointer"
                      v-bind="attrs"
                      @click="optionsClick(item, index)"
                    >
                      <v-list-item-title>{{ option }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
            <template>
              <v-card>
                <v-toolbar color="primary" dark>
                  <span>{{ $t('common.setLocationOnMap') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn dark text @click="optionsDialog = false">
                    <v-icon>close</v-icon>
                  </v-btn></v-toolbar
                >
                <v-card-title>
                  <h4 class="my-3 primary--text">
                    {{ $t('common.clickToSetLocationOnMap') }}
                  </h4>
                </v-card-title>
                <v-card-text>
                  <GoogleMap
                    @update-location="updateLocaiton"
                    :location="item.location"
                  />
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn color="primary" dark @click="setNewLocation(item)">
                    {{ $t('common.set') }}
                  </v-btn>
                  <v-btn
                    text
                    :loading="loading"
                    @click="optionsDialog = false"
                    >{{ $t('common.cancel') }}</v-btn
                  >
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
import GoogleMap from '../../components/Map/GoogleMap'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading,
    GoogleMap
  },
  data() {
    return {
      isLoading: false,
      loading: true,
      searchFilter: {
        searchString: '',
        PageNumber: 1
      },
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Merchants'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      optionsDialog: false,
      searchQuery: '',
      selectedUsers: [],
      headers: [
        {
          text: this.$i18n.t('users.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('Merchant.companyName'),
          value: 'companyName'
        },
        {
          text: this.$i18n.t('users.phoneNumber'),
          value: 'phoneNumber'
        },
        {
          text: this.$i18n.t('Merchant.activity'),
          value: 'activity'
        },
        {
          text: this.$i18n.t('common.address'),
          value: 'address'
        },
        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        }
      ],
      newLocation: {},
      optionsList: [
        this.$i18n.t('common.setLocation'),
        this.$i18n.t('Merchant.mechantOrders'),
        this.$i18n.t('Merchant.invoices'),
        this.$i18n.t('Bills.bills')
      ]
    }
  },
  computed: {
    ...mapGetters('PotentialMerchant', [
      'getPotentialMerchantList',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('PotentialMerchant', [
      'fetchPotentialMerchant',
      'setLocation'
    ]),
    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    updateLocaiton(location) {
      this.newLocation = location
    },
    setNewLocation(item) {
      this.loading = true
      this.newLocation.merchantId = item.userId
      this.setLocation(this.newLocation)
        .then(() => {
          item.location.lat = this.newLocation.lat
          item.location.long = this.newLocation.lng
        })
        .finally(() => {
          this.loading = false
        })
    },
    optionsClick(item, index) {
      if (index === 0) {
        this.optionsDialog = true
      } else if (index === 1) {
        console.log(item.id)
        this.$router.push(`/PotentialMerchants/orders/${item.userId}`)
      } else if (index === 2) {
        this.$router.push(`/PotentialMerchants/invoices/${item.userId}`)
      } else {
        this.$router.push(`/PotentialMerchants/bills/${item.userId}`)
      }
    }
  },
  mounted() {
    this.page = Number(this.$route.query.page)
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
          .dispatch(
            'PotentialMerchant/fetchPotentialMerchant',
            this.searchFilter
          )
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.searchString == null)
          this.searchFilter.searchString = ''
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
