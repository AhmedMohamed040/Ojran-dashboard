<template>
  <div class="my-2">
    <div>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <p>
            {{ $t('profile.BasicInformation') }}
          </p>
          <v-dialog v-model="infoDialog" max-width="900">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="my-2"
                v-bind="attrs"
                v-on="on"
                @click="fetchData()"
              >
                {{ $t('profile.edit') }}
              </v-btn>
            </template>
            <form @submit.prevent="save()">
              <v-card>
                <v-card-title class="white--text">
                  <span class="text-h5"> {{ $t('profile.edit') }}</span>
                </v-card-title>

                <v-card-text class="mt-2">
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.name"
                          outlined
                          required
                          :label="$t('profile.name')"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.userName"
                          outlined
                          required

                          :label="$t('profile.username')"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.phone"
                          outlined
                          required

                          type="number"
                          hint="Accept only numbers"
                          :label="$t('profile.phone')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.IdentityNumber"
                          outlined
                          required

                          type="number"
                          hint="Accept only numbers"
                          :label="$t('users.IdentityNumber')"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.address"
                          outlined
                          required

                          :label="$t('users.address')"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="userInfo.IdentityType"
                          :items="['National', 'Residence']"
                          outlined
                          required

                          :loading="editLoading"

                          dense
                          :label="$t('users.IdentityType')"
                        >
                          <template v-slot:selection="data">
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
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="userInfo.country"
                          clearable
                          required
                          :search-input.sync="search"
                          :label="$t('geography.country')"

                          :items="
                            getCountriesList.map(({ name, id }) => ({
                              text: name,
                              value: id
                            }))
                          "
                          :error-messages="errors.Country"
                          :loading="editLoading"
                          outlined
                          dense
                          style="margin: 18px 0 0 0"
                          class="mb-4"
                          hide-details="auto"
                          @click:clear="clear()"
                          @input="changeCountry()"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="userInfo.region"
                          clearable
                          required
                          :disabled="userInfo.country == null ? true : false"
                          :label="$t('geography.region')"
                          :items="
                            getRegionsList.map(({ name, id }) => ({
                              text: name,
                              value: id
                            }))
                          "
                          :error-messages="errors.Region"
                          :loading="editLoading"
                          outlined
                          dense
                          style="margin: 18px 0 0 0"
                          class="mb-4"
                          hide-details="auto"
                          @click:clear="clearRegion()"
                          @input="changeRegion()"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="userInfo.city"
                          :disabled="userInfo.region == null ? true : false"
                          clearable
                          required
                          :label="$t('geography.city')"

                          :items="
                            getCitiesList.map(({ name, id }) => ({
                              text: name,
                              value: id
                            }))
                          "
                          :error-messages="errors.City"
                          :loading="editLoading"
                          outlined
                          dense

                          style="margin: 18px 0 0 0"
                          class="mb-4"
                          hide-details="auto"
                          @click:clear="clearCity()"
                        ></v-autocomplete>
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
                    type="submit"
                    :loading="editLoading"
                    class="my-2 px-3 py-3"
                  >
                    {{ $t('common.save') }}
                  </v-btn>

                  <v-btn
                    color="red darken-1"
                    dark
                    class="my-2 mx-2 px-3 py-3"
                    @click="infoDialog = false"
                  >
                    {{ $t('common.cancel') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </form>
          </v-dialog>
        </v-card-title>
        <v-card-text>
          <v-row class="my-2">
            <v-col cols="3">
              {{ $t('profile.name') }}
            </v-col>
            <v-col cols="9">
              {{ realUser.name }}
            </v-col>
            <v-col cols="3">
              {{ $t('profile.phone') }}
            </v-col>
            <v-col cols="9">
              {{ realUser.phone }}
            </v-col>
            <v-col cols="3">
              {{ $t('profile.email') }}
            </v-col>
            <v-col cols="9">
              {{ realUser.email }}
            </v-col>

            <v-col cols="3">
              {{ $t('users.IdentityType') }}
            </v-col>
            <v-col cols="9">
              {{ $t(`users.${realUser.identityType}`) }}
            </v-col>
            <v-col cols="3">
              {{ $t('users.IdentityNumber') }}
            </v-col>
            <v-col cols="9">
              {{ realUser.identityNumber }}
            </v-col>
            <v-col cols="3">
              {{ $t('users.address') }}
            </v-col>
            <v-col cols="9">
              <div v-if="realUser.address" class="warning--text">
                <v-icon small color="warning">mdi-circle-medium</v-icon>
                <span>{{ $t('common.address') }} : {{ realUser.address }}</span>
              </div>
              <div v-if="realUser.country" class="primary--text">
                <v-icon small color="primary">mdi-circle-medium</v-icon>
                <span>{{ $t('geography.country') }} :
                  {{ realUser.country.name ? realUser.country.name : ' ' }}</span>
              </div>
              <div v-if="realUser.region" class="secondary--text">
                <v-icon small color="secondary">mdi-circle-medium</v-icon>
                <span>{{ $t('geography.region') }} :
                  {{ realUser.region.name ? realUser.region.name : ' '}}</span>
              </div>

              <div
                v-if="realUser.workingCity"
                class="success--text text--darken-2"
              >
                <v-icon small color="success">mdi-circle-medium</v-icon>
                <span>{{ $t('geography.city') }} :
                  {{ realUser.workingCity.name ? realUser.workingCity.name : ' '}}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!--   <v-expansion-panels v-model="panel1" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Agent.monthlySales')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="10">
                <v-row v-if="realUser.commissionType" class="my-2">
                  <v-col cols="4">
                    {{ $t('Commission.StartAt') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.startAt.substring(0, 10)
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('users.Period') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.period
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.SalesTarget') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.salesTarget
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.commissionSalesPercent') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.salesPercent
                        : ''
                    }}
                    %
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.RevenueTarget') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.revenueTarget
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.commissionRevenuePercent') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.revenuePercent
                        : ''
                    }}
                    %
                  </v-col>
                </v-row>
                <v-row v-else class="my-2">
                  <v-col cols="12">
                    <h4>{{ $t('common.notSet') }}</h4>
                  </v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->
      <v-expansion-panels v-model="panel" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('menu.Commissions')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="10">
                <v-row v-if="realUser.commissionType" class="my-2">
                  <v-col cols="4">
                    {{ $t('Commission.StartAt') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.startAt.substring(0, 10)
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('users.Period') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.period
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.SalesTarget') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.salesTarget
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.commissionSalesPercent') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.salesPercent
                        : ''
                    }}
                    %
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.RevenueTarget') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.revenueTarget
                        : ''
                    }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Commission.commissionRevenuePercent') }}
                  </v-col>
                  <v-col cols="8">
                    {{
                      realUser.commissionType
                        ? realUser.commissionType.revenuePercent
                        : ''
                    }}
                    %
                  </v-col>
                </v-row>
                <v-row v-else class="my-2">
                  <v-col cols="12">
                    <h4>{{ $t('common.notSet') }}</h4>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pr-0 my-2">
                <template>
                  <div>
                    <v-dialog v-model="dialog" max-width="750">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="blue darken-1"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ $t('Commission.addCommission') }}
                        </v-btn>
                      </template>

                      <v-card>
                        <v-card-title class="primary white--text">
                          {{ $t('Commission.addCommission') }}
                        </v-card-title>

                        <v-card-text class="mt-2">
                          <v-container>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-menu
                                  ref="menu"
                                  v-model="menu"
                                  :close-on-content-click="false"
                                  :return-value.sync="form.StartDate"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="form.StartDate"
                                      :label="$t('Commission.StartAt') + ' *'"
                                      prepend-icon="mdi-calendar"
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
                                    v-model="form.StartDate"
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
                                      @click="$refs.menu.save(form.StartDate)"
                                    >
                                      OK
                                    </v-btn>
                                  </v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-select
                                  v-model="form.Period"
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
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="form.SalesTarget"
                                  outlined
                                  type="number"
                                  hint="Accept only Character"
                                  :label="$t('Commission.SalesTarget')"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="form.RevenueTarget"
                                  type="number"
                                  outlined
                                  hint="Accept only Character"
                                  :label="$t('Commission.RevenueTarget')"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="form.SalesPercent"
                                  type="number"
                                  outlined
                                  hint="Accept only Character"
                                  :label="
                                    $t('Commission.commissionSalesPercent')
                                  "
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="form.RevenuePercent"
                                  type="number"
                                  outlined
                                  hint="Accept only Character"
                                  :label="
                                    $t('Commission.commissionRevenuePercent')
                                  "
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" md="6"> </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            dark
                            @click="addCommission(dialog)"
                          >
                            {{ $t('common.add') }}
                          </v-btn>
                          <v-btn color="grey" dark @click="dialog = false">
                            {{ $t('common.close') }}
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- disable modal -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    realUser: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      panel: [1],
      panel1: [1],
      dialog: false,
      rules: {
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

          return (
            pattern.test(value) ||
            value == '' ||
            this.$i18n.t('common.invalidEmail')
          )
        }
      },
      editLoading: false,
      errors: [],
      search: null,
      deleteDialog: false,
      userInfo: {
        id: '',
        name: '',
        userName: '',
        phone: '',
        IdentityType: '',
        IdentityNumber: '',
        address: '',
        country: '',
        region: '',
        city: ''
      },
      infoDialog: false,
      disableDialog: false,
      menu: false,
      form: {
        StartDate: '',
        Period: 0,
        SalesTarget: 0,
        RevenueTarget: 0,
        SalesPercent: 0,
        RevenuePercent: 0,
        AgentDetailId: ''
      },
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
      PermissionsList: [
        {
          name: this.$i18n.t('PermissionsList.CreateManager'),
          value: 'CreateManager'
        },
        {
          name: this.$i18n.t('PermissionsList.UpdateManager'),
          value: 'UpdateManager'
        },
        {
          name: this.$i18n.t('PermissionsList.DisableEnableManager'),
          value: 'DisableEnableManager'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Moderators', [
      'getRegionsList',
      'getCountriesList',
      'getCitiesList'
    ]),
    ...mapGetters('Delegates', ['getDelegate']),
    ...mapGetters('Nationalities', ['getNationalitiesList']),
    agent() {
      return this.getDelegate
    }

  },
  methods: {
    ...mapActions('Moderators', [
      'changeModeratorStatus',
      'ubdateModerator',
      'postCommission',
      'fetchCountries',
      'fetchRegions',
      'fetchCities'
    ]),
    ...mapActions('Delegates', ['fetchDelegate', 'updateDelegate']),
    ...mapActions('Nationalities', ['fetchNationalitys']),

    changeCountry() {
      const data = {
        country: this.userInfo.country,
        region: this.userInfo.region
      }

      this.fetchCountries()
      this.fetchRegions(data)
      this.fetchCities(data)
    },
    changeRegion() {
      const data = {
        country: this.userInfo.country,
        region: this.userInfo.region
      }

      this.fetchRegions(data)
      this.fetchCities(data)
    },

    blockUser() {
      this.changeModeratorStatus({
        UserId: this.$route.params.singleModerator_id,
        IsActive: false
      })
    },
    unblockUser() {
      this.changeModeratorStatus({
        UserId: this.$route.params.singleemploye_id,
        IsActive: true
      })
    },
    assign() {
      this.Permissions = []
      for (let i = 0; i < this.getModerator.permissions.length; i++) {
        this.Permissions.push(this.getModerator.permissions[i].name)
      }
    },
    update_Moderator() {
      this.ubdateModerator({
        UserId: this.$route.params.singleemploye_id,
        permissions: this.Permissions
      }).then(() => {
        this.fetchModerator(this.$route.params.singleemploye_id)
      })
    },
    addCommission() {
      this.form.AgentDetailId = this.realUser.id
      this.postCommission(this.form).then(() => {
        this.fetchDelegate(this.realUser.id)
        this.dialog = false
      })
    },
    clear() {
      this.userInfo.country = null
      this.userInfo.region = null
      this.userInfo.city = null

    },
    clearRegion() {
      this.userInfo.region = null
      this.userInfo.city = null

    },
    clearCity() {
      this.userInfo.city = null

    },
    fetchData() {

      if (this.realUser) {
        this.userInfo.id = this.realUser.id
        this.userInfo.name = this.realUser.name
        this.userInfo.userName = this.realUser.userName
        this.userInfo.phone = this.realUser.phone
        this.userInfo.IdentityType = this.realUser.identityType
        this.userInfo.IdentityNumber = this.realUser.identityNumber
        this.userInfo.address = this.realUser.address
        this.userInfo.country = this.realUser.country?.id
        this.userInfo.region = this.realUser.region?.id
        this.userInfo.city = this.realUser.workingCity?.id
      }
    },
    save() {
      this.editLoading = true
      this.updateDelegate(this.userInfo)
      .catch((err) => {
          this.errors.push(err.response.data.message)
        })
      .finally(() => {
        this.editLoading = false
        this.fetchDelegate(this.userInfo.id)

      })
      setTimeout(() => {
        if (!this.errors[0]) {
          this.infoDialog = false
        }
      }, 2000)

    },
    close() {
      this.userInfo = {
        name: '',
        id: '',
        userName: '',
        phone: '',
        IdentityType: '',
        IdentityNumber: '',
        address: '',
        country: '',
        region: '',
        city: ''
      }
    }
  },
  mounted() {
    this.fetchDelegate().then(() => {
      const data = {

        country : this.realUser.country?.id,
        region : this.realUser.region?.id
      }

      this.fetchCountries()
      this.fetchRegions(data)
      this.fetchCities(data)
      this.fetchData()
    })

  }
}
</script>
