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
        <template v-slot:[`item.workPlanType.target`]="{ item }">
          {{ $t('WorkPlan.' + item.workPlanType.target) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div
            :class="[
              item.status == 'Started' ? 'success--text text--darken-2' : '',
              item.status == 'Finished' ? 'red--text' : '',
              item.status == 'Pending' ? 'deep-orange--text text--darken-4' : ''
            ]"
          >
            {{ $t('WorkPlan.' + item.status) }}
          </div>
        </template>
        <template v-slot:[`item.addVisit`]="{ item }">
          <v-dialog
            v-model="item.visitDialog"
            max-width="85%"
            scrollable
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :loading="isLoading"
                color="primary"
                dark
                class="my-2"
                :disabled="item.status !== 'Started'"
                v-bind="attrs"
                v-on="on"
                @click="
                  WorkPlanId = item.id
                  item.workPlanType.target == 'PotentialMerchant'
                    ? (Potential = true)
                    : (Potential = false)
                "
              >
                {{ $t('PotentialMerchantVisit.addVisit') }}
              </v-btn>
            </template>
            <template>
              <v-card>
                <v-card-title class="primary white--text">
                  <span class="text-h5">{{
                    $t('PotentialMerchantVisit.createPotentialMerchantVisit')
                  }}</span>
                </v-card-title>

                <v-card-text class="mt-2">
                  <v-container>
                    <v-form ref="form" v-model="isFormValid" lazy-validation>
                      <v-row class="my-2">
                        <v-col cols="12">
                          <v-textarea
                            v-model="Details"
                            rows="4"
                            prepend-icon="mdi-pen"
                            outlined
                            :rules="[rules.required]"
                            :label="$t('common.details')"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            v-model="Images"
                            show-size
                            prepend-icon="mdi-image"
                            counter
                            multiple
                            outlined
                            :label="$t('PotentialMerchantVisit.visitPhotos')"
                          ></v-file-input>
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-file-input
                            v-model="Attachments"
                            show-size
                            counter
                            multiple
                            :rules="[rules.required]"
                            outlined
                            :label="$t('common.Attachments')"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <h3 class="my-2">
                        <v-icon>mdi-account</v-icon>
                        {{ $t('Merchant.Merchantinfo') }}
                      </h3>

                      <v-divider></v-divider>
                      <v-row v-if="!Potential" class="my-2">
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="MerchantDetailId"
                            prepend-icon="mdi-account-cash"
                            :label="$t('menu.Merchants')"
                            :rules="[rules.required]"
                            :items="
                              getAllPotentialMerchantList.map(
                                ({ name, id }) => ({
                                  text: name,
                                  value: id
                                })
                              )
                            "
                            width="10%"
                            style="margin: 18px 0 0 0"
                            outlined
                            dense
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-row v-else class="my-2">
                        <v-col cols="6">
                          <v-text-field
                            v-model="PotentialMerchant.CompanyName"
                            :label="$t('Merchant.companyName')"
                            :rules="[rules.required]"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="PotentialMerchant.Name"
                            :rules="[
                              rules.required,
                              rules.chractersOnly,
                              rules.enterTrionym
                            ]"
                            :label="$t('Merchant.personInResponseTrionym')"
                            outlined
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="PotentialMerchant.Email"
                            :rules="[rules.required, rules.email]"
                            :label="$t('users.email')"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <VuePhoneNumberInput
                            v-model="PotentialMerchant.Phone"
                            style="direction: ltr"
                            required
                            size="lg"
                            color="#0096c7"
                            error-color="red"
                            :error="requiredPhoneNumber"
                            :translations="phoneNumberInputTranslations"
                            valid-color="#0096c7"
                            default-country-code="SA"
                            @update="validateNumber($event)"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="PotentialMerchant.Activity"
                            :label="$t('Merchant.NatureOfTheActivity')"
                            :rules="[rules.required]"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="PotentialMerchant.Address"
                            :label="$t('Merchant.address')"
                            :rules="[rules.required]"
                            outlined
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6">
                          <Countries
                            :required-rule="[rules.required]"
                            :country-id="PotentialMerchant.CountryId"
                            @SelectCountryId="
                              PotentialMerchant.CountryId = $event
                            "
                          ></Countries>
                        </v-col>
                        <v-col cols="6">
                          <Regions
                            :required-rule="[rules.required]"
                            :disabled="
                              PotentialMerchant.CountryId ? false : true
                            "
                            :country-id="PotentialMerchant.CountryId"
                            :region-id="PotentialMerchant.RegionId"
                            @SelectRegionId="
                              PotentialMerchant.RegionId = $event
                            "
                          ></Regions>
                        </v-col>
                        <v-col cols="6">
                          <Cities
                            :required-rule="[rules.required]"
                            :disabled="
                              PotentialMerchant.CountryId
                                ? false
                                : true && PotentialMerchant.RegionId
                                  ? false
                                  : true
                            "
                            :country-id="PotentialMerchant.CountryId"
                            :region-id="PotentialMerchant.RegionId"
                            :city-id="PotentialMerchant.CityId"
                            @SelectCityId="PotentialMerchant.CityId = $event"
                          ></Cities>
                        </v-col>
                        <v-col cols="6">
                          <v-dialog
                            v-model="item.mapDialog"
                            transition="dialog-top-transition"
                            max-width="1200"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="primary"
                                dark
                                class="my-2"
                                v-bind="attrs"
                                v-on="on"
                              >
                                {{ $t('common.setLocationOnMap') }}
                              </v-btn>
                            </template>
                            <template>
                              <v-card>
                                <v-toolbar color="primary" dark>
                                  <span>{{
                                    $t('common.setLocationOnMap')
                                  }}</span>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    dark
                                    text
                                    @click="item.mapDialog = false"
                                  >
                                    <v-icon>close</v-icon>
                                  </v-btn></v-toolbar>
                                <v-card-title>
                                  <h4 class="my-3 primary--text">
                                    {{ $t('common.clickToSetLocationOnMap') }}
                                  </h4>
                                </v-card-title>
                                <v-card-text>
                                  <GoogleMap
                                    @update-location="updateLocaiton"
                                  />
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn
                                    color="primary"
                                    dark
                                    @click="item.mapDialog = false"
                                  >
                                    {{ $t('common.set') }}
                                  </v-btn>
                                  <v-btn
                                    text
                                    :loading="loading"
                                    @click="item.mapDialog = false"
                                  >{{ $t('common.cancel') }}</v-btn>
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-file-input
                            v-model="PotentialMerchant.Attachments"
                            show-size
                            counter
                            multiple
                            outlined
                            :label="$t('common.Attachments')"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="PotentialMerchant.Details"
                            rows="4"
                            prepend-icon="mdi-pen"
                            outlined
                            :label="$t('common.details')"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <hr class="header-divider primary" />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="Potential && !PotentialMerchant.location.lat"
                    color="blue darken-1"
                    dark
                    class="my-2 px-3 py-3"
                    :loading="isSubmiting"
                    @click="
                      newPotentialMerchantVisit(item)
                    "
                  >
                    {{ $t('common.save') }}
                  </v-btn>

                  <v-btn
                    color="red darken-1"
                    dark
                    class="my-2 mx-2 px-3 py-3"
                    @click="item.visitDialog = false"
                  >
                    {{ $t('common.cancel') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
        <template v-slot:[`item.Details`]="{ item }">
          <v-dialog
            v-model="item.dialog"
            max-width="600px"
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
            <template>
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
import Countries from '../../components/delegateComponents/Geography/Countries.vue'
import Regions from '../../components/delegateComponents/Geography/Region.vue'
import Cities from '../../components/delegateComponents/Geography/Cities.vue'
import GoogleMap from '../../components/Map/GoogleMap'
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

export default {
  components: {
    loading,
    Countries,
    Regions,
    Cities,
    GoogleMap,
    VuePhoneNumberInput
  },
  data() {
    return {
      Status: 'accepted',
      isLoading: false,
      loading: true,
      page: this.getFilter,

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
          text: this.$i18n.t('PotentialMerchantVisit.addVisit'),
          value: 'addVisit'
        }
      ],
      Details: '',
      Images: [],
      Attachments: [],
      MerchantDetailId: '',
      WorkPlanId: '',
      Potential: false,
      isFormValid: true,
      isPhoneValid: true,
      isSubmiting: false,
      PotentialMerchant: {
        Name: '',
        Phone: '',
        dialog: false,
        visitDialog: false,
        mapDialog: false,
        Email: '',
        CompanyName: '',
        Address: '',
        CountryId: '',
        CityId: '',
        RegionId: '',
        location: {},
        Activity: '',
        Details: '',
        Attachments: null
      },
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required'),
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

          return pattern.test(value) || this.$i18n.t('common.invalidEmail')
        },
        chractersOnly: (value) =>
          /^[A-Za-z]+$/.test(value) ||
          /[/\s/]/.test(value) ||
          /^[\u0600-\u06FF]+$/.test(value) ||
          this.$i18n.t('common.charactersOnly'),

        enterTrionym: (value) =>
          value.split(' ').length === 3 || this.$i18n.t('common.enterTrionym')
      }
    }
  },
  computed: {
    ...mapGetters('DelegateWorkPlan', [
      'getWorkPlansList',
      'getFilter',
      'getLastPage'
    ]),
    ...mapGetters('PotentialMerchant', ['getAllPotentialMerchantList']),

    requiredPhoneNumber() {
      return this.isPhoneValid ? false : true
    },
    phoneNumberInputTranslations() {
      const obj = {
        countrySelectorLabel: this.$i18n.t('geography.countryCode'),
        countrySelectorError: this.$i18n.t('geography.chooseACountry'),
        phoneNumberLabel: this.$i18n.t('users.phoneNumber')
      }

      return obj
    }
  },

  methods: {
    ...mapActions('DelegateWorkPlan', ['fetchWorkPlans']),
    ...mapActions('PotentialMerchantVisit', ['createPotentialMerchantVisit']),
    ...mapActions('PotentialMerchant', ['fetchAllPotentialMerchant']),

    ...mapMutations('DelegateWorkPlan', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    validateNumber(e) {
      this.isPhoneValid = e.isValid
      const fullNumber = e.countryCallingCode + e.phoneNumber

      this.PotentialMerchant.Phone = Number(fullNumber)
    },
    updateLocaiton(location) {
      this.PotentialMerchant.location = location
    },
    async newPotentialMerchantVisit(item) {
      if (this.$refs.form.validate()) {
        this.isSubmiting = true
        let res =  await this.createPotentialMerchantVisit({
          Details: this.Details,
          Images: this.Images,
          Attachments: this.Attachments,
          MerchantDetailId: this.MerchantDetailId,
          WorkPlanId: this.WorkPlanId,
          Potential: this.Potential,
          PotentialMerchant: this.PotentialMerchant
        })
        console.log(res)
        if(res.status == 200){
          this.PotentialMerchant = {
            Name: '',
            Phone: '',
            Email: '',
            CompanyName: '',
            Address: '',
            CountryId: '',
            CityId: '',
            RegionId: '',
            location: {},
            Activity: '',
            Details: '',
            Attachments: null
          }
          this.isFormValid = true
          item.visitDialog = false
        }
        this.isSubmiting = false
      }
    },
    close() {
      (this.dialog = false),
      (this.dialogDelete = false),
      (this.createdialog = false),
      (this.DetailsDialog = false)
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
    this.fetchAllPotentialMerchant()
    this.page = Number(this.$route.query.PageNumber)
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
