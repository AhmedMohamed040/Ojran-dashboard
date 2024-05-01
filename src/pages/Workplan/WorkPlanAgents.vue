<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex flex-lg-row flex-column">
      <div class="width-fill">
        <div class="d-flex align-center py-3">
          <div>
            <div class="display-1">{{ $t('menu.agents') }}</div>
            <v-breadcrumbs
              :items="breadcrumbs"
              class="pa-0 py-2"
              link
            ></v-breadcrumbs>
          </div>
        </div>
        <div v-if="loading" class="loading">
          <loading />
        </div>
        <div v-if="!loading">
          <v-data-table
            :headers="headers"
            :items="getWorkPlanAgentsList"
            loading-text="جاري تحميل البيانات"
            no-data-text="لا يوجد بيانات"
            hide-default-footer
            disable-filtering
            disable-pagination
            disable-sort
            mobile-breakpoint="0"
            class="elevation-1"
          >
            <template v-slot:[`item.phone`]="{ item }">
              <span dir="ltr">{{ item.phone }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-badge bordered color="green darken-2" icon="mdi-lock" overlap>
                <span slot="badge">{{ item.merchantVisitsCount }}</span>
                <v-btn
                  :disabled="item.merchantVisitsCount == 0"
                  outlined
                  color="indigo"
                  :to="`/workplans/` + $route.params.id + `/agents/` + item.id"
                >
                  <v-icon left> mdi-cards </v-icon>
                  {{ $t('WorkPlan.targetAchieved') }}
                </v-btn>
              </v-badge>
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
    </div>
  </div>
</template>

<script>
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Workplantasks',
  components: {
    loading
  },
  data() {
    return {
      isLoading: false,
      loading: true,
      dialog: false,
      dialogDelete: false,
      page: this.getFilter,
      menu1: false,
      menu: false,
      id: '',
      Name: '',
      StartDate: '',
      EndDate: '',
      WorkPlanTypeId: '',
      Goals: '',
      Target: '',
      CountryId: '',
      CityId: '',
      RegionId: '',
      AgentIds: [],
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.workplans'),
          to: '/workplans',
          replace: true,
          'active-class': ''
        },
        {
          text: this.$i18n.t('menu.agents')
        }
      ],
      searchQuery: '',
      headers: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('profile.phone'),
          value: 'phone'
        },
        {
          text: this.$i18n.t('common.edit'),
          value: 'actions'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getDelegateList']),
    ...mapGetters('WorkPlanAgent', [
      'getWorkPlanAgentsList',
      'getFilter',
      'getLastPage',
      'getErrors'
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('WorkPlan.createWorkPlan')
        : this.$i18n.t('WorkPlan.updateWorkPlan')
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
          .dispatch('WorkPlanAgent/fetchWorkPlanAgents', route.params.id)
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
  methods: {
    ...mapActions('Merchant', ['fetchDelegates']),
    ...mapActions('WorkPlanAgent', ['fetchWorkPlans', 'deleteWorkPlan']),
    ...mapMutations('WorkPlanAgent', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path !== `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    }
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
.width-fill {
  width: -webkit-fill-available;
}
</style>
