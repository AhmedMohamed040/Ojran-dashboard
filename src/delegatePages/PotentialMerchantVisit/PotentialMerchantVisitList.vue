<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.todoList') }}</div>
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
        :items="getPotentialMerchantVisitsList"
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
            <v-select
              v-model="searchFilter.workPlanId"
              :label="$t('menu.todo')"
              :items="
                getWorkPlans.map(({ name, id }) => ({
                  text: name,
                  value: id
                }))
              "
              width="20%"
              style="margin: 18px 0 0 0"
              outlined
              dense
              class="my-2"
              @change="fetchPotentialMerchantVisits(searchFilter)"
            ></v-select>
          </v-toolbar>
        </template>
        <template v-slot:[`item.merchantName`]="{ item }">
          <span class="moderators">{{
            item.merchantDetail ? item.merchantDetail.name : ''
          }}</span>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt.substr(0, 10) }}
        </template>
        <template v-slot:[`item.Details`]="{ item }">
          <v-dialog
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="my-2" v-bind="attrs" v-on="on">
                {{ $t('common.details') }}
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title class="primary white--text">
                  <span class="text-h5">{{ $t('common.details') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn dark text @click="dialog.value = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <h3 class="my-2">
                      <v-icon>mdi-account</v-icon>
                      {{ $t('Merchant.Merchantinfo') }}
                    </h3>

                    <v-divider></v-divider>
                    <v-row class="my-2">
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.name') }}
                      </v-col>
                      <v-col cols="9">
                        {{ item.merchantDetail.name }}
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.phone') }}
                      </v-col>
                      <v-col cols="9">
                        {{ item.merchantDetail.phone }}
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.email') }}
                      </v-col>
                      <v-col cols="9">
                        {{ item.merchantDetail.email }}
                      </v-col>
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.address') }}
                      </v-col>
                      <v-col cols="9">
                        <div>
                          <div v-if="item.merchantDetail.address">
                            <span> {{ item.merchantDetail.address }}</span>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <h3 class="my-2">
                      <v-icon>mdi-format-list-checkbox</v-icon>
                      {{ $t('menu.todo') }}
                    </h3>
                    <v-divider></v-divider>
                    <v-row class="my-2">
                      <v-col cols="12">
                        <v-icon small>mdi-circle-medium</v-icon>
                        <span class="cyan--text">
                          {{ $t('profile.name') }} :
                        </span>
                        {{ item.workPlan.name }}
                      </v-col>
                      <v-col cols="12">
                        <v-icon small>mdi-calendar</v-icon>
                        <span class="cyan--text">
                          {{ $t('Commission.StartAt') }}
                        </span>
                        {{ item.workPlan.startDate.substr(0, 10) }}
                      </v-col>
                      <v-col cols="12">
                        <v-icon small>mdi-calendar</v-icon>
                        <span class="cyan--text">
                          {{ $t('Commission.EndAt') }}
                        </span>
                        {{ item.workPlan.endDate.substr(0, 10) }}
                      </v-col>
                      <v-col cols="6">
                        <v-icon small>mdi-target</v-icon>
                        <span class="cyan--text">
                          {{ $t('WorkPlan.target') }} :
                        </span>
                        {{ item.workPlan.target }}
                      </v-col>
                      <v-col cols="12">
                        <v-icon small>mdi-pen</v-icon>
                        <span class="cyan--text">
                          {{ $t('common.details') }} :
                        </span>
                        {{ item.workPlan.goals }}
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <h3 class="my-2">
                      <v-icon>mdi-image-multiple</v-icon>
                      {{ $t('PotentialMerchantVisit.visitPhotos') }}
                    </h3>
                    <v-divider></v-divider>
                    <div class="my-2 visitPhotos">
                      <img
                        v-for="img in item.images"
                        :key="img.url"
                        :src="img.url"
                        height="200"
                        class="elevation-1 my-2 mx-2"
                        alt="User"
                        style="border-radius: 5px"
                      />
                    </div>
                    <v-divider></v-divider>
                    <h3 class="my-2">
                      <v-icon>mdi-file-document</v-icon>
                      {{ $t('common.Attachments') }}
                    </h3>
                    <div class="my-2"></div>
                    <v-divider></v-divider>
                  </v-container>
                </v-card-text>
                <hr class="header-divider primary" />
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="red darken-1"
                    dark
                    class="my-2 mx-2 px-3 py-3"
                    @click="dialog.value = false"
                  >
                    {{ $t('common.cancel') }}
                  </v-btn>
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
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading
  },
  data() {
    return {
      searchFilter: {
        workPlanId: '',
        PageNumber: 1
      },
      isLoading: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.todoList'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],

      searchQuery: '',
      selectedUsers: [],
      headers: [
        {
          text: this.$i18n.t('Invoices.movementDate'),
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('PotentialMerchantVisit.merchantName'),
          value: 'merchantName'
        },
        {
          text: this.$i18n.t('PotentialMerchantVisit.workPlan'),
          value: 'workPlan.name'
        },

        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('PotentialMerchantVisit', [
      'getPotentialMerchantVisitsList',
      'getLastPage',
      'getWorkPlans'
    ])
  },

  methods: {
    ...mapActions('PotentialMerchantVisit', [
      'fetchPotentialMerchantVisits',
      'createPotentialMerchantVisit',
      'fetchWorkPlans'
    ]),
    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    }
  },
  mounted() {
    this.fetchWorkPlans()
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
            'PotentialMerchantVisit/fetchPotentialMerchantVisits',
            this.searchFilter
          )
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
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
