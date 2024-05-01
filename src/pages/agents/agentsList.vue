<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.agents') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getDelegateList"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <div class="d-flex justify-space-between w" style="width: 100%;">
              <div class="d-flex align-center" >
                <v-text-field
                  v-model="searchFilter.searchString"
                  :label="$t('common.search')"
                  width="20%"
                  style="margin: 18px 0 0 0"
                  clearable
                  outlined
                  hide-details
                  @input="fetchDelegates(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchDelegates(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                persistent
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="my-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('users.createDelegate') }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="primary white--text">
                    <span class="text-h5">{{ $t('users.createDelegate') }}</span>
                    <v-spacer></v-spacer>
                    <v-btn dark text @click="close()">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <h3 class="my-2">
                        <v-icon>mdi-account</v-icon>
                        {{ $t('users.delegateInfo') }}
                      </h3>
                      <v-divider></v-divider>
                      <v-form ref="form" v-model="isFormValid" lazy-validation>
                        <v-row class="my-2">
                          <v-col cols="12" sm="4" md="3">
                            <v-text-field
                              v-model="Name"
                              outlined
                              :rules="[
                                rules.required,
                                rules.chractersOnly,
                                rules.enterTrionym
                              ]"
                              type="text"
                              :label="$t('common.trionym')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-text-field
                              v-model="Username"
                              outlined
                              :rules="[rules.required]"
                              :label="$t('users.userName')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-text-field
                              v-model="Email"
                              type="email"
                              outlined
                              :rules="[rules.required, rules.email]"
                              :label="$t('users.email')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-text-field
                              v-model="Address"
                              outlined
                              :rules="[rules.required]"
                              :label="$t('users.address')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="8" md="6">
                            <VuePhoneNumberInput
                              v-model="dummyPhone"
                              style="direction: ltr"
                              required
                              size="lg"
                              color="#0096c7"
                              class="pb-3"
                              error-color="red"
                              :error="requiredPhoneNumber"
                              :translations="phoneNumberInputTranslations"
                              valid-color="#0096c7"
                              default-country-code="SA"
                              @update="validateNumber"
                            />
                          </v-col>

                          <v-col cols="12" sm="4" md="3">
                            <Countries
                              :required-rule="[rules.required]"
                              :country-id="CountryId"
                              @SelectCountryId="CountryId = $event"
                            ></Countries>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <Regions
                              :required-rule="[rules.required]"
                              :disabled="CountryId ? false : true"
                              :country-id="CountryId"
                              :region-id="RegionId"
                              @SelectRegionId="RegionId = $event"
                            ></Regions>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <Cities
                              :required-rule="[rules.required]"
                              :disabled="
                                CountryId
                                  ? false
                                  : true && RegionId
                                    ? false
                                    : true
                              "
                              :country-id="CountryId"
                              :region-id="RegionId"
                              :city-id="WorkingCityId"
                              @SelectCityId="WorkingCityId = $event"
                            ></Cities>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-autocomplete
                              v-model="NationalityId"
                              :label="$t('geography.Nationality')"
                              outlined
                              :rules="[rules.required]"
                              append-icon="mdi-map"
                              :search-input.sync="search"
                              return-object
                              :no-filter="true"
                              :items="
                                getNationalitiesList.map(({ id, name }) => ({
                                  text: name,
                                  value: id
                                }))
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-select
                              v-model="IdentityType"
                              :items="['National', 'Residence']"
                              outlined
                              :rules="[rules.required]"
                              :label="$t('users.IdentityType')"
                            >
                              <template v-slot:selection="data" class="selection">
                                <v-list-item-content>
                                  {{ $t(`users.${data.item}`) }}
                                </v-list-item-content>
                              </template>
                              <template v-slot:item="data">
                                <v-list-item-content>
                                  {{ $t(`users.${data.item}`) }}
                                </v-list-item-content>
                              </template>
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="4" md="3">
                            <v-text-field
                              v-model="IdentityNumber"
                              type="number"
                              outlined
                              :rules="[rules.required]"
                              :label="$t('users.IdentityNumber')"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                      <v-divider></v-divider>
                      <h3 class="my-2">
                        <v-icon>mdi-cash-check</v-icon>
                        {{ $t('menu.Commissions') }}
                      </h3>
                      <v-divider></v-divider>
                      <v-row class="my-2">
                        <v-col cols="12" sm="4" md="3">
                          <v-text-field
                            v-model="CommissionType.SalesTarget"
                            outlined
                            type="number"
                            hint="Accept only Character"
                            :label="$t('Commission.SalesTarget')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="3">
                          <v-text-field
                            v-model="CommissionType.SalesPercent"
                            type="number"
                            outlined
                            hint="Accept only Character"
                            :label="$t('Commission.commissionSalesPercent')"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4" md="3">
                          <v-text-field
                            v-model="CommissionType.RevenueTarget"
                            type="number"
                            outlined
                            hint="Accept only Character"
                            :label="$t('Commission.RevenueTarget')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="3">
                          <v-text-field
                            v-model="CommissionType.RevenuePercent"
                            type="number"
                            outlined
                            hint="Accept only Character"
                            :label="$t('Commission.commissionRevenuePercent')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="3">
                          <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="CommissionType.StartAt"
                            :rules="[rules.required]"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="CommissionType.StartAt"
                                :label="$t('Commission.StartAt')"
                                :rules="[rules.required]"
                                prepend-icon="mdi-calendar"
                                class="mx-3"
                                solo
                                hide-details
                                dense
                                clearable
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="CommissionType.StartAt"
                              :rules="[rules.required]"
                              color="green lighten-1"
                              year-icon="mdi-calendar-blank"
                              prev-icon="mdi-skip-previous"
                              next-icon="mdi-skip-next"
                            >
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="menu = false">
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                :loading="isLoading"
                                @click="$refs.menu.save(CommissionType.StartAt)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="4" md="3">
                          <v-select
                            v-model="CommissionType.Period"
                            append-icon="mdi-map"
                            outlined
                            :items="
                              PeriodList.map(({ value, name }) => ({
                                text: name,
                                value: value
                              }))
                            "
                            :label="$t('users.Period')"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <hr class="header-divider primary" />
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      color="blue darken-1"
                      dark
                      class="my-2 px-3 py-3"
                      @click="save();"
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
            </div>
          </v-toolbar>
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-switch
            v-if="item.isActive === false"
            v-model="item.isActive"
            inset
            :disabled="isLoading"
            :loading="isLoading"
            @change="unblockUser(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.isActive === true"
            v-model="item.isActive"
            inset
            :loading="isLoading"
            :disabled="isLoading"
            @change="blockUser(item.id)"
          ></v-switch>
        </template>
        <template v-slot:[`item.delete`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('users.deleteDelegate')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{ $t('users.AreYouSureYouWantToDeleteThisDelegate') }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    :loading="isLoading"
                    @click="deleteThisDelegate(item.id, dialog)"
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
        </template>
        <template v-slot:[`item.Details`]="{ item }">
          <v-btn
            :to="{
              name: 'single-delegate',
              params: {
                delegate_id: item.id
              }
            }"
            class="my-5"
            color="primary"
          >
            {{ $t('common.details') }}
          </v-btn>
        </template>
      </v-data-table>

      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8">
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
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
import CopyLabel from '../../components/common/CopyLabel'
import loading from '../../components/common/loading'
import Countries from '../../components/Geography/Countries.vue'
import Regions from '../../components/Geography/Region.vue'
import Cities from '../../components/Geography/Cities.vue'
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'CreateAgent',
  components: {
    CopyLabel,
    loading,
    Countries,
    Regions,
    Cities,
    VuePhoneNumberInput
  },
  data() {
    return {
      isLoading: false,
      search: null,
      dialog: false,
      dialogDelete: false,
      page: this.getFilter,
      menu1: false,
      menu: false,
      PeriodList: [
        {
          name: this.$i18n.t('users.monthly'),
          value: 1
        },
        {
          name: this.$i18n.t('users.quarterOfAYear'),
          value: 3
        },
        {
          name: this.$i18n.t('users.halfOfAYear'),
          value: 6
        },
        {
          name: this.$i18n.t('users.yearly'),
          value: 12
        }
      ],
      isFormValid: true,
      id: '',
      Name: '',
      Username: '',
      dummyPhone: '',
      Phone: '',
      isPhoneValid: true,
      Address: '',
      Email: '',
      NationalityId: '',
      IdentityType: '',
      IdentityNumber: '',
      CommissionType: {
        NameAr: '',
        NameEn: '',
        StartAt: '',
        Period: 0,
        SalesTarget: 0,
        RevenueTarget: 0,
        SalesPercent: 0,
        RevenuePercent: 0
      },
      CountryId: '',
      RegionId: '',
      WorkingCityId: '',

      loading: true,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.agents'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      searchFilter: {
        searchString: ''
      },
      headers: [
        {
          text: this.$i18n.t('users.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('users.userName'),
          value: 'userName'
        },
        {
          text: this.$i18n.t('users.phoneNumber'),
          value: 'phone'
        },
        {
          text: this.$i18n.t('geography.city'),
          value: 'workingCity.name'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        },
        {
          text: this.$i18n.t('common.delete'),
          value: 'delete'
        }
      ],
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
    ...mapGetters('Delegates', ['getDelegateList', 'getFilter', 'getLastPage']),
    ...mapGetters('GeographyCrud', ['getCitiesList']),
    ...mapGetters('Nationalities', ['getNationalitiesList']),

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
    ...mapActions('Delegates', [
      'fetchDelegates',
      'postDelegate',
      'changeDelegateStatus',
      'deleteDelegate'
    ]),
    ...mapActions('Nationalities', ['fetchNationalitys']),
    ...mapActions('GeographyCrud', ['fetchCities']),

    ...mapMutations('Delegates', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    validateNumber(e) {
      this.isPhoneValid = e.isValid
      this.Phone = +e.formattedNumber
    },
    close() {
      this.dialog = false
      this.Name = ''
      this.Username = ''
      this.Phone = ''
      this.dummyPhone = ''
      this.Address = ''
      this.Email = ''
      this.NationalityId = ''
      this.IdentityType = ''
      this.IdentityNumber = ''
      this.CommissionType = ''
      this.CountryId = ''
      this.RegionId = ''
      this.WorkingCityId = ''
      this.CommissionType = {
        NameAr: '',
        NameEn: '',
        StartAt: '',
        Period: 0,
        SalesTarget: 0,
        RevenueTarget: 0,
        SalesPercent: 0,
        RevenuePercent: 0
      }

      this.isFormValid = true

      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      // this.isLoading = true
      if (this.$refs.form.validate()) {
        this.addDelegate()
      }
    },
    async addDelegate() {
      return  await this.postDelegate({
        Name: this.Name,
        Username: this.Username,
        Phone: this.Phone,
        Address: this.Address,
        Email: this.Email,
        NationalityId: this.NationalityId.value,
        IdentityType: this.IdentityType,
        IdentityNumber: this.IdentityNumber,
        CommissionType: this.CommissionType,
        CountryId: this.CountryId,
        RegionId: this.RegionId,
        WorkingCityId: this.WorkingCityId
      }).then((res) => {
        console.log(res)
        this.fetchDelegates()
         this.close()
        this.isLoading = false
        setTimeout(() => {
          this.dialog = false

        }, 3000)
      })
    },

    blockUser(id) {
      this.isLoading = true
      this.changeDelegateStatus({
        id: id,
        status: false
      }).then( (res) => {
        this.isLoading = false
        swal(
          i18n.t('Merchant.merchantUpdatedSuccessfully'),
          res.data.message,
          'success'
        )
        console.log(res.data.message)
      })
    },
    unblockUser(id) {
      this.isLoading = true
      this.changeDelegateStatus({
        id: id,
        status: true
      }).then( (res) => {
        this.isLoading = false
        swal(
          i18n.t('Merchant.merchantUpdatedSuccessfully'),
          res.data.message,
          'success'
        )
        console.log(res.data.message)
      })
    },
    deleteThisDelegate(id, d) {
      this.isLoading = true
      this.deleteDelegate(id).then(() => {
        this.fetchDelegates()
        swal(
          i18n.t('users.delegateDeletedSuccessfully'),
          err.data.message,
          'error'
        )
      }).catch( (err) => {
        console.log(err.response)
        swal(
          i18n.t('common.operationFaild'),
          err.response.data.message,
          'error'
        )
      })
      this.isLoading = false
      d.value = false
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
          .dispatch('Delegates/fetchDelegates', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    search (val) {
      this.isLoading = true
      this.fetchNationalitys({ 'SearchString': val })
      this.isLoading = false
    }
  },
  mounted() {
    this.page = Number(this.$route.query.PageNumber)
  },
  created() {
    this.fetchCities()
    this.fetchNationalitys()
  }
}
</script>

<style lang="scss" scoped></style>
