<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.todo') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getWorkPlansList"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:[`item.Period`]="{ item }">
          <div>
            <div>
              <v-icon small>mdi-calendar</v-icon>
              <span>{{ $t('Commission.StartAt') }} :
                {{ item.startDate.substr(0, 10) }}</span>
            </div>
            <div>
              <v-icon small>mdi-calendar</v-icon>
              <span>{{ $t('Commission.EndAt') }} :
                {{ item.endDate.substr(0, 10) }}</span>
            </div>
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div
            :class="[
              item.status == 'Started' ? 'success--text text--darken-2' : '',
              item.status == 'Finished' ? 'danger--text' : '',
              item.status == 'Pending' ? 'warning--text' : ''
            ]"
          >
            {{ $t('WorkPlan.' + item.status) }}
          </div>
        </template>
        <template v-slot:[`item.Details`]="{ item }">
          <v-dialog
            v-model="item.dialog"
            max-width="600px"
            hide-overlay
            scrollable
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="error"
                dark
                class="my-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ $t('common.details') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="primary white--text">
                <span class="text-h5">{{ $t('common.details') }}</span>
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <h3 class="cyan--text my-2">
                    <v-icon class="mx-2">mdi-content-paste</v-icon>
                    {{ item.name }}
                  </h3>
                  <v-divider></v-divider>
                  <v-row class="my-2">
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-calendar</v-icon>
                      <span class="cyan--text">
                        {{ $t('Commission.StartAt') }}
                      </span>
                      {{ item.startDate.substr(0, 10) }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-calendar</v-icon>
                      <span class="cyan--text">
                        {{ $t('Commission.EndAt') }}
                      </span>
                      {{ item.endDate.substr(0, 10) }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-target</v-icon>
                      <span class="cyan--text">
                        {{ $t('WorkPlan.target') }} :
                      </span>
                      {{ item.target }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-pen</v-icon>
                      <span class="cyan--text">
                        {{ $t('common.details') }} :
                      </span>
                      {{ item.goals }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-target</v-icon>
                      <span class="cyan--text">
                        {{ $t('menu.WorkPlanType') }} :
                      </span>
                      {{ item.workPlanType.name }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-target</v-icon>
                      <span class="cyan--text">
                        {{ $t('WorkPlan.target') }} :
                      </span>
                      {{ $t('WorkPlan.' + item.workPlanType.target) }}
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-icon small color="cyan">mdi-target</v-icon>
                      <span class="cyan--text">
                        {{ $t('common.stutas') }} :
                      </span>
                      <span
                        :class="[
                          item.status == 'Started' ? 'success--text text--darken-2' : '',
                          item.status == 'Finished' ? 'danger--text' : '',
                          item.status == 'Pending' ? 'warning--text' : ''
                        ]"
                      >
                        {{ $t('WorkPlan.' + item.status) }}
                      </span>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div>
                        <div v-if="item.country" class="cyan--text">
                          <v-icon small color="cyan">mdi-map</v-icon>
                          <span>{{ $t('geography.country') }} :
                            {{ item.country.name }}</span>
                        </div>
                        <div v-if="item.region" class="cyan--text">
                          <v-icon small color="cyan">mdi-map</v-icon>
                          <span>{{ $t('geography.region') }} :
                            {{ item.region.name }}</span>
                        </div>

                        <div v-if="item.city" class="cyan--text">
                          <v-icon small color="cyan">mdi-map</v-icon>
                          <span>{{ $t('geography.city') }} :
                            {{ item.city.name }}</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <hr class="header-divider primary" />
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="red darken-1"
                  dark
                  class="my-2 mx-2 px-3 py-3"
                  @click="item.dialog = false"
                >
                  {{ $t('common.cancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:[`item.workPlanType.target`]="{ item }">
          {{ $t('WorkPlan.' + item.workPlanType.target) }}
        </template>
        <template v-slot:[`item.Action`]="{ item }">
          <!-- accept -->
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                dark
                color="primary"
                class="mx-3 my-1"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mt-1 my-1">mdi-check-all</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>{{
                  $t('WorkPlan.AccepWorkPlan')
                }}</v-toolbar>
                <v-card-text>
                  <h3 class="my-3">
                    {{ $t('WorkPlan.doYouWantToAccepThisWorkPlan') }}
                  </h3>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="primary"
                    dark
                    @click="accept(item.id), (dialog.value = false)"
                  >
                    {{ $t('WorkPlan.AccepWorkPlan') }}
                  </v-btn>
                  <v-btn text @click="dialog.value = false">{{
                    $t('common.cancel')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <!-- decline -->
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                color="#E07979"
                fab
                small
                dark
                class="mx-3 my-1"
                v-on="on"
              >
                <v-icon class="mt-1 my-1">mdi mdi-close-outline</v-icon></v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('WorkPlan.DeclineWorkPlan')
                }}</v-toolbar>
                <v-card-text>
                  <v-row class="my-2">
                    <v-col cols="12">
                      {{ $t('common.enterReason') }}
                    </v-col>
                    <v-col cols="12" md="6" offset-md="4">
                      <v-text-field
                        v-model="rejectReason"
                        clearable
                        outlined
                        :label="$t('common.reason')"
                        style="margin: 18px 0 0 0"
                        class="my-2"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-dialog transition="dialog-top-transition" max-width="600">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="!rejectReason || rejectReason === ''"
                        color="red"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ $t('WorkPlan.DeclineWorkPlan') }}
                      </v-btn>
                    </template>
                    <template v-slot:default="dialog2">
                      <v-card>
                        <v-toolbar color="red" dark>{{
                          $t('WorkPlan.DeclineWorkPlan')
                        }}</v-toolbar>
                        <v-card-text>
                          <h4 class="my-3 red--text">
                            {{ $t('WorkPlan.doYouWantToDeclineThisWorkPlan') }}
                          </h4>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            color="red"
                            dark
                            @click="decline(item.id), (dialog.value = false)"
                          >
                            {{ $t('WorkPlan.DeclineWorkPlan') }}
                          </v-btn>
                          <v-btn text @click="dialog2.value = false">{{
                            $t('common.cancel')
                          }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>

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
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    loading
  },
  data() {
    return {
      Status: 'pending',
      isLoading: false,
      loading: true,
      dialog: false,
      dialogDelete: false,
      DetailsDialog: false,
      page: this.getFilter,
      rejectReason: '',

      breadcrumbs: [
        {
          text: this.$i18n.t('menu.todo'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],

      searchQuery: '',
      headers: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },
        // {
        //   text: this.$i18n.t('common.details'),
        //   value: 'goals'
        // },
        {
          text: this.$i18n.t('WorkPlan.targetAchieved'),
          value: 'targetAchieved'
        },
        {
          text: this.$i18n.t('WorkPlan.target'),
          value: 'target'
        },
        {
          text: this.$i18n.t('menu.WorkPlanType'),
          value: 'workPlanType.name'
        },
        {
          text: this.$i18n.t('WorkPlanType.target'),
          value: 'workPlanType.target'
        },
        {
          text: this.$i18n.t('users.Period'),
          value: 'Period'
        },
        // {
        //   text: this.$i18n.t('geography.city'),
        //   value: 'city.name'
        // },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        },
        {
          text: this.$i18n.t('WorkPlan.acceptOrdecline'),
          value: 'Action'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('DelegateWorkPlan', [
      'getWorkPlansList',
      'getFilter',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('DelegateWorkPlan', [
      'fetchWorkPlans',
      'acceptWorkPlan',
      'declineWorkPlan'
    ]),
    ...mapMutations('DelegateWorkPlan', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    close() {
      (this.dialog = false),
      (this.dialogDelete = false),
      (this.createdialog = false),
      (this.DetailsDialog = false)
    },
    accept(id) {
      this.acceptWorkPlan(id).then(() => {
        this.fetchWorkPlans({
          page: this.page,
          status: this.Status
        })
      })
    },
    decline(id) {
      const obj = {
        id,
        rejectReason: this.rejectReason
      }

      this.declineWorkPlan(obj).then(() => {
        this.fetchWorkPlans({
          page: this.page,
          status: this.Status
        })
      })
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.PageNumber) {
          await this.$router.replace({
            query: { ...route.query, PageNumber: 1 }
          })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch(
            'DelegateWorkPlan/fetchWorkPlans',
            { status: this.Status },
            route.query
          )
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    dialog(val) {
      if (!val) {
        this.CountryId = ''
        this.CityId = ''
        this.RegionId = ''
      }
    }
  },
  mounted() {
    this.page = Number(this.$route.query.page)
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
