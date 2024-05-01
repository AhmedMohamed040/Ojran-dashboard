<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Merchant.joinRequests') }}</div>
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
        :items="getMerchantsRequestes"
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
          <v-toolbar text>
            <div class="d-flex justify-space-between w" style="width: 100%">
              <div class="d-flex align-center">
                <v-text-field
                  v-model="searchFilter.searchString"
                  :label="$t('common.search')"
                  width="20%"
                  style="margin: 18px 0 0 0"
                  clearable
                  outlined
                  hide-details
                  @input="fetchMerchantsRequestes(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchMerchantsRequestes(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>
            </div>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
          <span class="moderators">{{ item.name }}</span>
        </template>
        <template v-slot:item.userName="{ item }">
          <span class="moderators">{{ item.userName }}</span>
        </template>
        <template v-slot:item.phoneNumber="{ item }">
          <span v-if="item.phone" class="moderators">{{ item.phone }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:item.email="{ item }">
          <span v-if="item.email" class="moderators">{{ item.email }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div class="font-weight-bold d-flex align-center text-no-wrap">
            <div v-if="item.status === 'Pending'" class="warning--text">
              <v-icon small color="warning">mdi-circle-medium</v-icon>
              <span>{{ $t(`common.${item.status}`) }}</span>
            </div>
            <div v-if="item.status === 'Declined'" class="secondary--text">
              <v-icon small color="secondary">mdi-circle-medium</v-icon>
              <span>{{ $t(`common.${item.status}`) }}</span>
            </div>
            <div
              v-if="item.status === 'Accepted'"
              class="success--text text--darken-2"
            >
              <v-icon small color="success">mdi-circle-medium</v-icon>
              <span>{{ $t(`common.${item.status}`) }}</span>
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
        <template v-slot:[`item.options`]="{ item }">
          <v-dialog
            v-model="optionsDialog"
            transition="dialog-top-transition"
            max-width="1200"
          >
            <template v-slot:activator="{ attrs }">
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
                    <v-list-item>
                      <v-list-item-title>
                        <v-dialog
                          transition="dialog-top-transition"
                          max-width="600"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              depressed
                              :disabled="
                                item.status === 'Accepted' ||
                                item.status === 'Declined'
                              "
                              elevation="0"
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ $t('Merchant.accept') }}
                            </v-btn>
                            <!--   <v-btn
                v-bind="attrs"
                text
                rounded
                :disabled="
                  item.status === 'Accepted' || item.status === 'Declined'
                "
                height="45"
                class="my-5"
                dark
                color="success"
                v-on="on"
              >
                <v-icon> mdi-checkbox-multiple-marked-circle-outline</v-icon>
              </v-btn> -->
                          </template>
                          <template v-slot:default="dialog">
                            <v-card>
                              <v-toolbar color="success" dark>{{
                                $t('joinRequests.acceptJoinRequests')
                              }}</v-toolbar>
                              <v-card-text>
                                <h4 class="my-3 success--text text--darken-2">
                                  {{
                                    $t(
                                      'joinRequests.AreYouSureYouWantToAcceptThisJoinRequests'
                                    )
                                  }}
                                </h4>
                              </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn
                                  color="success"
                                  dark
                                  @click="
                                    accept(item.id)
                                    dialog.value = false
                                    optionsDialog = false
                                  "
                                >
                                  {{ $t('Merchant.accept') }}
                                </v-btn>
                                <v-btn text @click="dialog.value = false">{{
                                  $t('common.cancel')
                                }}</v-btn>
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <v-dialog
                          transition="dialog-top-transition"
                          max-width="600"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              depressed
                              elevation="0"
                              v-bind="attrs"
                              :disabled="
                                item.status === 'Accepted' ||
                                item.status === 'Declined'
                              "
                              v-on="on"
                            >
                              {{ $t('Merchant.decline') }}
                            </v-btn>
                            <!--    <v-btn
                v-bind="attrs"
                text
                rounded
                :disabled="
                  item.status === 'Accepted' || item.status === 'Declined'
                "
                height="45"
                class="my-5"
                dark
                color="secondary"
                v-on="on"
              >
                <v-icon>mdi-minus-circle-multiple-outline</v-icon>
              </v-btn> -->
                          </template>
                          <template v-slot:default="dialog">
                            <v-card>
                              <v-toolbar color="secondary" dark>{{
                                $t('joinRequests.declineJoinRequests')
                              }}</v-toolbar>
                              <v-card-text>
                                <h4 class="my-3 secondary--text">
                                  {{
                                    $t(
                                      'joinRequests.AreYouSureYouWantToDeclineThisJoinRequests'
                                    )
                                  }}
                                </h4>
                              </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn
                                  color="secondary"
                                  dark
                                  @click="
                                    decline(item.id)
                                    dialog.value = false
                                    optionsDialog = false
                                  "
                                >
                                  {{ $t('Merchant.decline') }}
                                </v-btn>
                                <v-btn text @click="dialog.value = false">{{
                                  $t('common.cancel')
                                }}</v-btn>
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-dialog
                        transition="dialog-top-transition"
                        max-width="600"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            depressed
                            elevation="0"
                            :disabled="
                              item.status === 'Accepted'"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ $t('common.delete') }}
                          </v-btn>
                        </template>
                        <template v-slot:default="dialog">
                          <v-card>
                            <v-toolbar color="red" dark>{{
                              $t('joinRequests.deleteJoinRequests')
                            }}</v-toolbar>
                            <v-card-text>
                              <h4 class="my-3 red--text">
                                {{
                                  $t(
                                    'joinRequests.AreYouSureYouWantToDeleteThisJoinRequests'
                                  )
                                }}
                              </h4>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                              <v-btn
                                color="red"
                                dark
                                @click="
                                  deleted(item.id)
                                  dialog.value = false
                                  optionsDialog = false
                                "
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
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          :to="{
                            name: 'request-details',
                            params: { requestId: item.id }
                          }"
                          depressed
                          elevation="0"
                        >
                          {{ $t('common.details') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-dialog>
        </template>

        <!--      <template v-slot:item.delete="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                rounded
                height="45"
                class="my-5"
                v-bind="attrs"
                dark
                color="red lighten-2"
                v-on="on"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('joinRequests.deleteJoinRequests')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{
                      $t(
                        'joinRequests.AreYouSureYouWantToDeleteThisJoinRequests'
                      )
                    }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    @click="deleted(item.id), (dialog.value = false)"
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
        </template> -->
      </v-data-table>

      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination
                  v-model="pageNumber"
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
      isLoading: false,
      dialog: false,
      loading: true,
      optionsDialog: false,
      pageNumber: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Merchants'),
          to: '/merchents/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      searchFilter: {
        searchString: ''
      },
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
          text: this.$i18n.t('common.stutas'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        }
        /*   {
          text: this.$i18n.t('Merchant.accept'),
          value: 'accept'
        },
        {
          text: this.$i18n.t('Merchant.decline'),
          value: 'decline'
        },
        {
          text: this.$i18n.t('common.delete'),
          value: 'delete'
        } */
      ]
    }
  },
  computed: {
    ...mapGetters('MerchantsRequestes', [
      'getMerchantsRequestes',
      'getFilter',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('MerchantsRequestes', [
      'fetchMerchantsRequestes',
      'acceptMerchantRequest',
      'declineMerchantRequest',
      'deleteMerchantRequest'
    ]),
    ...mapMutations('MerchantsRequestes', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?pageNumber=${event}`) {
        this.$router.push(`?pageNumber=${event}`)
      }
    },
    accept(id) {
      this.acceptMerchantRequest(id)
        .then(() => {
          this.fetchMerchantsRequestes()
        })
        .finally(() => (this.optionsDialog = false))
    },
    decline(id) {
      this.declineMerchantRequest(id)
        .then(() => {
          this.fetchMerchantsRequestes()
        })
        .finally(() => (this.optionsDialog = false))
    },
    deleted(id) {
      this.deleteMerchantRequest(id)
        .then(() => {
          this.fetchMerchantsRequestes()
        })
        .finally(() => (this.optionsDialog = false))
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.pageNumber) {
          await this.$router.replace({
            query: { ...route.query, pageNumber: 1 }
          })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('MerchantsRequestes/fetchMerchantsRequestes', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.pageNumber = Number(this.$route.query.pageNumber)
  }
}
</script>

<style lang="scss" scoped></style>
