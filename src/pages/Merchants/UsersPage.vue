<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Merchants') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/merchents/create">
        {{ $t('Merchant.createMerchant') }}
      </v-btn>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        dense
        :loading="isLoading"
        :headers="headers"
        :items="getMerchantList"
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
              @input="fetchMerchants(searchFilter)"
            ></v-text-field>
            <v-btn
              color="primary"
              class="mx-2"
              @click="
                searchFilter = {
                  searchString: ''
                }
                fetchMerchants(searchFilter)
              "
            >
              {{ $t('common.showAll') }}
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span class="moderators">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.userName`]="{ item }">
          <span class="moderators">{{ item.userName }}</span>
        </template>
        <template v-slot:[`item.phoneNumber`]="{ item }">
          <span v-if="item.phone" class="moderators">{{ item.phone }}</span>
          <span v-else class="moderators">{{ $t('common.notSet') }}</span>
        </template>
        <template v-slot:[`item.agent`]="{ item }">
          <span v-if="item.agent" class="moderators">{{ item.agent.name }}</span>
          <span v-else class="moderators">{{ $t('common.notSet') }}</span>
        </template>
        <template v-slot:[`item.email`]="{ item }">
          <span v-if="item.email" class="moderators">{{ item.email }}</span>
          <span v-else class="moderators">{{ $t('common.notSet') }}</span>
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
            <div v-if="item.address" class="warning--text">
              <v-icon small color="warning">mdi-circle-medium</v-icon>
              <span>{{ $t('common.address') }} : {{ item.address }}</span>
            </div>

            <div v-if="item.region" class="secondary--text">
              <v-icon small color="secondary">mdi-circle-medium</v-icon>
              <span>{{ $t('geography.region') }} : {{ item.region.name }}</span>
            </div>

            <div v-if="item.city" class="success--text text--darken-2">
              <v-icon small color="success">mdi-circle-medium</v-icon>
              <span>{{ $t('geography.city') }} : {{ item.city.name }}</span>
            </div>
          </div>
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-switch
            v-if="item.isActive === false"
            v-model="item.isActive"
            inset
            @change="unblockUser(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.isActive === true"
            v-model="item.isActive"
            inset
            @change="blockUser(item.id)"
          ></v-switch>
        </template>
        <template v-slot:[`item.options`]="{ item }">
          <v-dialog
            v-model="optionsDialog"
            transition="dialog-top-transition"
            max-width="1200"
          >
            <template v-slot:activator="{  attrs }">
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
import { mapGetters, mapActions, mapMutations } from 'vuex'
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
      optionsDialog: false,
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
      optionsList: [
        this.$i18n.t('Bills.bills'),
        this.$i18n.t('Merchant.invoices'),

        this.$i18n.t('common.details')
      ],
      searchQuery: '',
      selectedUsers: [],
      headers: [
        {
          text: this.$i18n.t('Merchant.companyName'),
          value: 'companyName'
        },
        {
          text: this.$i18n.t('users.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('users.phoneNumber'),
          value: 'phoneNumber'
        },
        {
          text: this.$i18n.t('users.delegateName'),
          value: 'agent'
        },
        {
          text: this.$i18n.t('common.address'),
          value: 'address'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },
        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getMerchantList', 'getFilter', 'getLastPage'])
  },

  methods: {
    ...mapActions('Merchant', ['fetchMerchants', 'changeMerchantStatus']),
    ...mapMutations('Merchant', ['setFilter', 'setMerchantId']),
    handlingRoute(event) {
      if (this.$route.path != `?pageNumber=${event}`) {
        this.$router.push(`?pageNumber=${event}`)
      }
    },
    blockUser(id) {
      this.changeMerchantStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeMerchantStatus({
        id: id,
        status: true
      })
    },
    optionsClick(item, index) {
      console.log(item)
      if (index === 0) {
        this.$route.params.singlemerchent_id = item.id
        this.setMerchantId(item.id)
        this.$router.push(`/merchents/bills/${item.userId}`)
      } else if (index === 1) {
        this.$router.push({name:'merchant-invoices', params: { singlemerchent_id: item.userId} })
      } else {

        this.$router.push(`/merchents/edit/${item.id}`)
      }
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.pageNumber) {
          await this.$router.replace({ query: { ...route.query, pageNumber: 1 } })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('Merchant/fetchMerchants', route.query)
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
  },
  mounted() {
    this.page = Number(this.$route.query.pageNumber)
  }
}
</script>

<style lang="scss" scoped></style>
