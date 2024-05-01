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
                          v-model="userInfo.phone"
                          outlined
                          required
                          type="number"
                          hint="Accept only numbers"
                          :label="$t('profile.phone')"
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
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="userInfo.country"
                          clearable
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
                          required
                          style="margin: 18px 0 0 0"
                          class="mb-4"
                          @input="changeCountry()"
                          hide-details="auto"
                          @click:clear="clear()"
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
                          @input="changeRegion()"
                          @click:clear="clearRegion()"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                          v-model="userInfo.city"
                          :disabled="userInfo.region == null ? true : false"
                          clearable
                          required
                          :search-input.sync="search"
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
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.email"
                          outlined
                          required
                          type="email"
                          :rules="[rules.email]"
                          :label="$t('users.email')"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="userInfo.number"
                          outlined
                          required
                          type="text"
                          :label="$t('setting.t_number')"
                        ></v-text-field>
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
          <v-row class="my-3">
            <v-col cols="12" md="8">
              <v-row class="profile mx-0">
                <v-col cols="3" class="px-1">
                  {{ $t('profile.name') }}
                </v-col>
                <v-col cols="9" class="px-1">
                  {{ realUser.name }}
                </v-col>

                <v-col cols="3" class="px-1">
                  {{ $t('profile.phone') }}
                </v-col>
                <v-col cols="9" class="px-1">
                  {{ realUser.phone }}
                </v-col>
                <v-col cols="3" class="px-1">
                  {{ $t('profile.email') }}
                </v-col>
                <v-col cols="9" class="px-1">
                  {{ realUser.email }}
                </v-col>
                <v-col cols="3" class="px-1">
                  {{ $t('common.address') }}
                </v-col>
                <v-col cols="9" class="px-1">
                  <div>
                    <div v-if="realUser.address" class="warning--text">
                      <v-icon small color="warning">mdi-circle-medium</v-icon>
                      <span>{{ $t('common.address') }} :
                        {{ realUser.address }}</span>
                    </div>

                    <div v-if="realUser.region" class="secondary--text">
                      <v-icon small color="secondary">mdi-circle-medium</v-icon>
                      <span>{{ $t('geography.region') }} :
                        {{ realUser.region.name }}</span>
                    </div>

                    <div v-if="realUser.city" class="success--text text--darken-2">
                      <v-icon small color="success">mdi-circle-medium</v-icon>
                      <span>{{ $t('geography.city') }} :
                        {{ realUser.city.name }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-expansion-panels v-model="panel" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{ $t('common.Attachments') }}</v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-divider></v-divider>
            <v-row v-if="attachmentPhotos.length == 0 && otherFiles.length == 0 " no-gutters class="my-2">
              <h4>لا يوجد</h4>
            </v-row>
            <v-row v-else class="my-2">
              <v-img
                v-for="img in attachmentPhotos"
                :key="img.url"
                width="200"
                class="mx-1"
                :src="img.url"
                @click="overlay = true, overlaySrc = img.url"
              />
              <v-overlay :value="overlay" @click="overlay = false">
                <v-img :src="overlaySrc" />
              </v-overlay>
              <v-btn v-for="file in otherFiles" :key="file.url"><a class="text-decoration-none blue--text text--darken-3" :href="file.url" target="_blank">{{ $t('common.download') }}</a></v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Merchant.assignDelegate')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-divider></v-divider>
            <v-row class="my-2">
              <v-col cols="3">
                {{ $t('Merchant.ItsDelegate') }}
              </v-col>
              <v-col cols="9">
                <v-dialog
                  v-if="realUser.agent == null"
                  transition="dialog-top-transition"
                  max-width="600"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      style="cursor: pointer"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-circle-edit-outline
                    </v-icon>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title class="text-h5 white--text primary">
                        {{ $t('common.select') }}
                      </v-card-title>
                      <v-card-text class="my-2">
                        <v-autocomplete
                          v-model="Agent"
                          :label="$t('Merchant.ItsDelegate')"
                          :items="
                            getDelegateList.map(({ name, id }) => ({
                              text: name,
                              value: {
                                name,
                                id
                              }
                            }))
                          "
                          width="10%"
                          style="margin: 18px 0 0 0"
                          outlined
                          dense
                        ></ر-autocomplete>
                        </v-autocomplete></v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn
                          x-large
                          color="primary"
                          @click="
                            AssignAgent()
                            dialog.value = false
                          "
                        >
                          {{ $t('common.save') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="dialog.value = false"
                        >
                          {{ $t('common.cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <div v-else>
                  <v-chip class="ma-2" color="primary">
                    <span v-if="realUser.agent">
                      {{ realUser.agent.name }}
                    </span>
                    <span v-else>{{ Agent.name }}</span>
                  </v-chip>
                  <v-btn
                    color="error"
                    icon
                    class="my-2"
                    @click="UnassignAgent()"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Merchant.bindWithWarehouse')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-divider></v-divider>
            <v-row class="my-2">
              <v-col cols="3">
                {{ $t('Merchant.itsWarehouse') }}
              </v-col>
              <v-col cols="9">
                <v-dialog
                  v-if="realUser.warehouse == null"
                  transition="dialog-top-transition"
                  max-width="600"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      style="cursor: pointer"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-circle-edit-outline
                    </v-icon>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title class="text-h5 white--text primary">
                        {{ $t('common.select') }}
                      </v-card-title>
                      <v-card-text class="my-2">
                        <v-select
                          v-model="warehouse"
                          :label="$t('Merchant.itsWarehouse')"
                          :items="
                            getSomeWarehouses.map(({ name, id }) => ({
                              text: name,
                              value: {
                                name,
                                id
                              }
                            }))
                          "
                          width="10%"
                          style="margin: 18px 0 0 0"
                          outlined
                          dense
                        ></v-select>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn
                          x-large
                          color="primary"
                          @click="
                            AssignWarehouse()
                            dialog.value = false
                          "
                        >
                          {{ $t('common.save') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="dialog.value = false"
                        >
                          {{ $t('common.cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <div v-else>
                  <v-chip class="ma-2" color="primary">
                    <span v-if="realUser.warehouse">
                      {{ realUser.warehouse.name }}
                    </span>
                    <span v-else>{{ warehouse.name }}</span>
                  </v-chip>
                  <v-btn
                    color="error"
                    icon
                    class="my-2"
                    @click="UnassignWarehouse()"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('Merchant.attachPriceCategory')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-divider></v-divider>
            <v-row class="my-2">
              <v-col cols="3">
                {{ $t('Merchant.attachPriceCategory') }}
              </v-col>
              <v-col cols="9">
                <v-dialog
                  v-if="realUser.priceCategory == null"
                  transition="dialog-top-transition"
                  max-width="600"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      style="cursor: pointer"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-circle-edit-outline
                    </v-icon>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title class="text-h5 white--text primary">
                        {{ $t('common.select') }}
                      </v-card-title>
                      <v-card-text class="my-2">
                        <v-select
                          v-model="PriceCategory"
                          rounded
                          append-icon="mdi-cash-check"
                          outlined
                          :items="
                            getPriceCategoriesList.map(({ id, name }) => ({
                              text: name,
                              value: {
                                name,
                                id
                              }
                            }))
                          "
                          :label="$t('Product.ProductPriceCategories')"
                        >
                        </v-select>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn
                          x-large
                          color="primary"
                          @click="
                            AttachPriceCategory()
                            dialog.value = false
                          "
                        >
                          {{ $t('common.save') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="dialog.value = false"
                        >
                          {{ $t('common.cancel') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <div v-else>
                  <v-chip class="ma-2" color="primary">
                    <span v-if="realUser.priceCategory">
                      {{ realUser.priceCategory.name }}
                    </span>
                    <span v-else>{{ PriceCategory.name }}</span>
                  </v-chip>
                  <v-btn
                    color="error"
                    icon
                    class="my-2"
                    @click="DetachPriceCategory()"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
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
import { mapActions, mapGetters } from 'vuex'
import axios from '../../../axios'
export default {
  props: {
    realUser: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      panel: [0],
      deleteDialog: false,
      infoDialog: false,
      disableDialog: false,
      Agent: {},
      editLoading: false,
      search: null,
      warehouse: {},
      PriceCategory: {},

      overlay: false,
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
      errors: {},
      userInfo: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        region: '',
        country: '',
        number: null,
        city: ''
      },
      overlaySrc: ''
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getDelegateList', 'getMerchant']),
    ...mapGetters('ProductProps', ['getPriceCategoriesList']),
    ...mapGetters('Warehouses', ['getSomeWarehouses']),
    ...mapGetters('Moderators', [
      'getRegionsList',
      'getCitiesList',
      'getCountriesList'
    ]),
    merchant() {
      return this.getMerchant
    },
    attachmentPhotos() {
      let arr = []

      const images = ['png', 'jpeg', 'jpg']

      arr = Object.values(this.realUser.attachments || {}).filter( (x) => {
        const exetention = x.url.split('/')[5].split('.')[1]

        return images.includes(exetention)
      } )

      return arr
    },
    otherFiles() {
      let arr = []

      const images = ['png', 'jpeg', 'jpg']

      arr = Object.values(this.realUser?.attachments || {}).filter( (x) => {
        const exetention = x.url.split('/')[5].split('.')[1]

        return !images.includes(exetention)
      } )

      return arr
    }
  },

  methods: {
    ...mapActions('Merchant', [
      'assignAgent',
      'unassignAgent',
      'fetchDelegates',
      'updateMerchant',
      'assignWarehouse',
      'fetchMerchant',
      'unassignWarehouse',
      'attachPriceCategory',
      'detachPriceCategory'
    ]),
    ...mapActions('ProductProps', ['fetchPriceCategorys']),
    ...mapActions('Warehouses', ['fetchSomeWarehouses']),
    ...mapActions('Moderators', [
      'fetchRegions',
      'fetchCities',
      'fetchCountries'
    ]),
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

    fetchData() {
      if (this.merchant) {

        this.userInfo.id = this.merchant.id
        this.userInfo.name = this.merchant.name
        this.userInfo.email = this.merchant.email
        this.userInfo.phone = this.merchant.phone
        this.userInfo.country = this.merchant.country?.id
        this.userInfo.address = this.merchant.address
        this.userInfo.region = this.merchant.region?.id
        this.userInfo.number = this.merchant.number

        this.userInfo.city = this.merchant.city?.id
      }

    },
    save() {
      this.editLoading = true
      this.updateMerchant(this.userInfo)
        .catch((err) => {
          this.errors.push(err.response.data.message)
        })
        .finally(() => {
          this.editLoading = false
          this.fetchMerchant(this.userInfo.id)

        })
      setTimeout(() => {
        if (!this.errors[0]) {
          this.infoDialog = false
        }
      }, 2000)

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
    resetInfo() {
      this.userInfo.id = null
      this.userInfo.name = null
      this.userInfo.email = null
      this.userInfo.phone = null
      this.userInfo.country = null
      this.userInfo.address = null
      this.userInfo.number = null
      this.userInfo.region = null
      this.userInfo.city = null
    },
    AssignWarehouse() {
      console.log(this.realUser.id, this.warehouse.id)
      this.assignWarehouse({
        id:  this.realUser.id,
        warehouse: this.warehouse.id
      }).then(() => {
        this.realUser.warehouse = this.warehouse
      }) .catch((err) => {
        console.log(err)
      })
    },
    UnassignWarehouse() {
      this.unassignWarehouse({
        id:  this.realUser.id,
        warehouse: this.warehouse.id
      }).then(() => {
        this.realUser.warehouse = null
      })
        .catch((err) => {
          console.log(err)
        })
    },
    AssignAgent() {
      this.assignAgent({
        id: this.realUser.id,
        AgentId: this.Agent.id
      }).then(() => {
        this.realUser.agent = this.Agent
      })
    },
    UnassignAgent() {
      this.unassignAgent({
        id: this.realUser.id,
        AgentId: this.realUser.agent.id
      })
        .then(() => {
          this.realUser.agent = null
        })
        .catch((err) => {
          console.log(err)
        })
    },
    AttachPriceCategory() {
      this.attachPriceCategory({
        id: this.realUser.id,
        PriceCategoryId: this.PriceCategory.id
      }).then(() => {
        this.realUser.priceCategory = this.PriceCategory
      })
    },
    DetachPriceCategory() {
      this.detachPriceCategory(this.realUser.id).then(() => {
        this.realUser.priceCategory = null
      })
    },
    forceFileDownload(response, title) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadAttachments(url) {
      console.log(url)
      axios({
        method: 'get',
        url: url,
        // url: 'https://api.ojran.sa/uploads/attachments/523da8b0b08d49b88f32f494c44cbc70.jpeg',
        responseType: 'arraybuffer'
      })
        .then((response) => {
          const name = url.split('/')[5]

          this.forceFileDownload(response, name)
        })
        .catch((err) => console.log(err))
    }

  },
  mounted() {
    this.fetchDelegates().then(() => {
      const data = {

        country : this.merchant.country?.id,
        region : this.merchant.region?.id
      }

      this.fetchRegions(data)
      this.fetchCities(data)
      this.fetchCountries()
      this.fetchData()
    })
    this.fetchSomeWarehouses()
    this.fetchPriceCategorys()

  }
}
</script>
