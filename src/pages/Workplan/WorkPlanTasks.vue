<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex flex-lg-row flex-column">
      <div class="width-fill">
        <div class="d-flex align-center py-3">
          <div>
            <div class="display-1">{{ $t('menu.todo') }}</div>
            <v-breadcrumbs
              :items="breadcrumbs"
              class="pa-0 py-2"
            ></v-breadcrumbs>
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
            mobile-breakpoint="0"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat class="d-flex justify-end">
                <v-dialog v-model="dialog" max-width="750">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="my-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t('WorkPlan.createWorkPlan') }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text class="mt-2">
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="4" sm="6">
                            <v-text-field
                              v-model="Name"
                              :error-messages="getErrors.Name"
                              outlined
                              hint="Accept only Character"
                              :label="$t('common.name') + ' *'"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="4" sm="6">
                            <v-text-field
                              v-model="Target"
                              :error-messages="getErrors.Target"
                              outlined
                              type="number"
                              hint="Accept only number"
                              :label="$t('WorkPlan.target') + ' *'"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-select
                              v-model="WorkPlanTypeId"
                              :error-messages="getErrors.WorkPlanTypeId"
                              outlined
                              :items="
                                getWorkPlanTypesList.map(({ id, name }) => ({
                                  text: name,
                                  value: id
                                }))
                              "
                              :label="$t('menu.WorkPlanType') + ' *'"
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="StartDate"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                              class="pb-2"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="StartDate"
                                  :error-messages="getErrors.StartDate"
                                  :label="$t('Commission.StartAt') + ' *'"
                                  prepend-icon="mdi-calendar"
                                  outlined
                                  hide-details
                                  class="pb-2"
                                  clearable
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="StartDate"
                                color="green lighten-1"
                                year-icon="mdi-calendar-blank"
                                prev-icon="mdi-skip-previous"
                                next-icon="mdi-skip-next"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(StartDate)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-menu
                              ref="menu1"
                              v-model="menu1"
                              :close-on-content-click="false"
                              :return-value.sync="EndDate"
                              transition="scale-transition"
                              offset-y
                              class="pb-2"
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="EndDate"
                                  :error-messages="getErrors.EndDate"
                                  :label="$t('Commission.EndAt') + ' *'"
                                  prepend-icon="mdi-calendar"
                                  outlined
                                  hide-details
                                  clearable
                                  class="pb-2"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="EndDate"
                                color="green lighten-1"
                                header-color="primary"
                                year-icon="mdi-calendar-blank"
                                prev-icon="mdi-skip-previous"
                                next-icon="mdi-skip-next"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu1 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu1.save(EndDate)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <Countries
                              :country-id="CountryId"
                              :error-messages="getErrors.EndDate"
                              is-required
                              @SelectCountryId="CountryId = $event"
                            ></Countries>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <Regions
                              :disabled="CountryId ? false : true"
                              :country-id="CountryId"
                              :region-id="RegionId"
                              @SelectRegionId="RegionId = $event"
                            ></Regions>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <Cities
                              :disabled="
                                CountryId
                                  ? false
                                  : true && RegionId
                                    ? false
                                    : true
                              "
                              :country-id="CountryId"
                              :region-id="RegionId"
                              :city-id="CityId"
                              @SelectCityId="CityId = $event"
                            ></Cities>
                          </v-col>
                          <v-col cols="12" md="4" sm="6">
                            <v-select
                              v-model="AgentIds"
                              :error-messages="getErrors.AgentIds"
                              :label="$t('Merchant.ItsDelegate')"
                              :items="
                                getDelegateList.map(({ name, id }) => ({
                                  text: name,
                                  value: id
                                }))
                              "
                              multiple
                              outlined
                            ></v-select>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-textarea
                              v-model="Goals"
                              :error-messages="getErrors.Goals"
                              rows="4"
                              prepend-icon="mdi-pen"
                              outlined
                              :label="$t('common.details') + ' *'"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                      <h4>*{{ $t('WorkPlan.hint') }}</h4>
                    </v-card-text>
                    <hr class="header-divider primary" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        dark
                        class="my-2 px-3 py-3"
                        @click="save()"
                      >
                        {{ $t('common.save') }}
                      </v-btn>

                      <v-btn
                        color="red darken-1"
                        dark
                        class="my-2 mx-2 px-3 py-3"
                        @click="close()"
                      >
                        {{ $t('common.cancel') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              {{ $t(`WorkPlan.${item.status}`) }}
            </template>
            <template v-slot:[`item.details`]="{ item }">
              <v-dialog transition="dialog-top-transition" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="my-1 primary"
                    dark
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('common.details') }}
                  </v-btn>
                </template>
                <template v-slot:default="createDialog">
                  <v-card>
                    <v-toolbar>
                      <h3 class="cyan--text">
                        <v-icon class="mx-2">mdi-content-paste</v-icon>
                        {{ item.name }}
                      </h3>
                    </v-toolbar>
                    <v-card-text>
                      <v-row class="my-2">
                        <v-col cols="12" md="6">
                          <v-icon small color="warning">mdi-calendar</v-icon>
                          <span class="cyan--text">
                            {{ $t('Commission.StartAt') }}
                          </span>
                          {{ item.startDate.substr(0, 10) }}
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-icon small color="warning">mdi-calendar</v-icon>
                          <span class="cyan--text">
                            {{ $t('Commission.EndAt') }}
                          </span>
                          {{ item.endDate.substr(0, 10) }}
                        </v-col>
                        <v-col cols="6">
                          <v-icon small color="warning">mdi-target</v-icon>
                          <span class="cyan--text">
                            {{ $t('WorkPlan.target') }} :
                          </span>
                          {{ item.target }}
                        </v-col>
                        <v-col cols="12">
                          <v-icon small color="warning">mdi-pen</v-icon>
                          <span class="cyan--text">
                            {{ $t('common.details') }} :
                          </span>
                          {{ item.goals }}
                        </v-col>

                        <v-col cols="6">
                          <div>
                            <div v-if="item.country" class="purple--text">
                              <v-icon small color="purple accent-3">mdi-map</v-icon>
                              <span>{{ $t('geography.country') }} :{{ item.country.name }}</span>
                            </div>
                            <div v-if="item.region" class="secondary--text">
                              <v-icon small color="secondary">mdi-map</v-icon>
                              <span>{{ $t('geography.region') }} :{{ item.region.name }}</span>
                            </div>

                            <div
                              v-if="item.city"
                              class="success--text text--darken-2"
                            >
                              <v-icon small color="success">mdi-map</v-icon>
                              <span>{{ $t('geography.city') }} :{{ item.city.name }}</span>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="createDialog.value = false">{{
                        $t('common.cancel')
                      }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                :to="`/workplans/` + item.id + `/agents`"
              >
                <v-icon left> mdi-face-agent </v-icon>
                {{ $t('menu.agents') }}
              </v-btn>
              <v-btn icon color="green darken-2">
                <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
              </v-btn>
              <v-dialog transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="error" icon v-bind="attrs" v-on="on">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </template>
                <template v-slot:default="deleteDialog">
                  <v-card>
                    <v-toolbar color="red" dark>{{
                      $t('WorkPlan.deleteWorkPlan')
                    }}</v-toolbar>
                    <v-card-text>
                      <h4 class="my-3 red--text">
                        {{
                          $t('WorkPlan.AreYouSureYouWantToDeleteThisWorkPlan')
                        }}
                      </h4>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        color="red"
                        dark
                        @click="
                          deleteThisWorkPlan(item.id), (deleteDialog.value = false)
                        "
                      >
                        {{ $t('common.delete') }}
                      </v-btn>
                      <v-btn text @click="deleteDialog.value = false">{{
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
    </div>
  </div>
</template>

<script>
import Countries from '../../components/Geography/Countries.vue'
import Regions from '../../components/Geography/Region.vue'
import Cities from '../../components/Geography/Cities.vue'
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Workplantasks',
  components: {
    Countries,
    Regions,
    Cities,
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
      id: this.$route.params.id,
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
        {
          text: this.$i18n.t('common.details'),
          value: 'details'
        },
        {
          text: this.$i18n.t('common.status'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.actions'),
          value: 'actions'
        }
      ],
      editedIndex: -1
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getDelegateList']),
    ...mapGetters('WorkPlan', [
      'getWorkPlansList',
      'getFilter',
      'getLastPage',
      'getWorkPlanTypesList',
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
          .dispatch('WorkPlan/fetchWorkPlans', route.query)
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
    this.fetchWorkPlanTypes()
    this.fetchDelegates()
  },
  methods: {
    ...mapActions('Merchant', ['fetchDelegates']),
    ...mapActions('WorkPlan', [
      'fetchWorkPlans',
      'fetchWorkPlanTypes',
      'postWorkPlan',
      'updateWorkPlan',
      'changeWorkPlanStatus',
      'deleteWorkPlan'
    ]),
    ...mapMutations('WorkPlan', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path !== `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    editItem(item) {
      this.AgentIds = item.agentDetailWorkPlans.map((i) => {
        return i.agentId
      })
      console.log(this.AgentIds)
      this.editedIndex = 500
      this.id = item.id
      this.Name = item.name
      this.StartDate = item.startDate
      this.EndDate = item.endDate
      this.WorkPlanTypeId = item.workPlanType.id
      this.Goals = item.goals
      this.Target = item.target
      this.CountryId = item.country.id
      this.CityId = item.city?.id
      this.RegionId = item.region?.id
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.id = ''
      this.Name = ''
      this.StartDate = ''
      this.EndDate = ''
      this.WorkPlanTypeId = ''
      this.Goals = ''
      this.Target = ''
      this.CountryId = ''
      this.CityId = ''
      this.RegionId = ''
      this.AgentIds = []
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editWorkPlan()
      } else {
        this.addWorkPlan()
      }
    },
    addWorkPlan() {
      this.postWorkPlan({
        Name: this.Name,
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        WorkPlanTypeId: this.WorkPlanTypeId,
        Goals: this.Goals,
        Target: this.Target,
        CountryId: this.CountryId,
        CityId: this.CityId,
        RegionId: this.RegionId,
        AgentIds: this.AgentIds
      })
        .then(() => {
          // if success
          if (this.getErrors.length === 0) {
            this.Name = ''
            this.StartDate = ''
            this.EndDate = ''
            this.WorkPlanTypeId = ''
            this.Goals = ''
            this.Target = ''
            this.fetchWorkPlans()
            this.dialog = false
          }
        })
        .catch(() => {})
    },
    editWorkPlan() {
      console.log(this.AgentIds)
      this.updateWorkPlan({
        id: this.id,
        Name: this.Name,
        StartDate: this.StartDate,
        EndDate: this.EndDate,
        WorkPlanTypeId: this.WorkPlanTypeId,
        Goals: this.Goals,
        Target: this.Target,
        CountryId: this.CountryId,
        CityId: this.CityId,
        RegionId: this.RegionId,
        AgentIds: this.AgentIds
      }).then(() => {
        this.Name = ''
        this.StartDate = ''
        this.EndDate = ''
        this.WorkPlanTypeId = ''
        this.Goals = ''
        this.Target = ''
        this.fetchWorkPlans()
        this.fetchWorkPlans()
      })
    },

    blockUser(id) {
      this.changeWorkPlanStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeWorkPlanStatus({
        id: id,
        status: true
      })
    },
    deleteThisWorkPlan(id) {
      this.deleteWorkPlan(id).then(() => {
        this.fetchWorkPlans()
      })
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
