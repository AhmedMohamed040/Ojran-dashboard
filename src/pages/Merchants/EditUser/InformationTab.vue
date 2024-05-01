<template>
  <div>
    <div class="my-5 content">
      <v-row class="my-1 mx-4 white">
        <v-col cols="12" class="center-content h createMerchent">
          <h2>{{ $t('Merchant.createMerchant') }}</h2>
        </v-col>
        <v-col cols="12" class="pt-2">
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="CompanyName"
                  :label="$t('Merchant.companyName')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="Name"
                  :rules="[
                    rules.required,
                    rules.chractersOnly,
                    rules.enterTrionym
                  ]"
                  :label="$t('Merchant.personInResponseTrionym')"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="4">
                <v-text-field
                  v-model="Email"
                  :label="$t('users.email')"
                  :rules="[rules.required, rules.email]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="8" class="mb-2">
                <VuePhoneNumberInput
                  style="direction: ltr"
                  required
                  size="lg"
                  color="#0096c7"
                  error-color="red"
                  :error="requiredPhoneNumber"
                  :translations="phoneNumberInputTranslations"
                  default-country-code="SA"
                  valid-color="#0096c7"
                  v-model="dummyPhone"
                  @update="validateNumber"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="Activity"
                  :label="$t('Merchant.NatureOfTheActivity')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="Address"
                  :label="$t('Merchant.address')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <Countries
                  :requiredRule="[rules.required]"
                  :CountryId="CountryId"
                  @SelectCountryId="CountryId = $event"
                ></Countries>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <Regions
                  :requiredRule="[rules.required]"
                  :disabled="CountryId ? false : true"
                  :CountryId="CountryId"
                  :RegionId="RegionId"
                  @SelectRegionId="RegionId = $event"
                ></Regions>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <Cities
                  :requiredRule="[rules.required]"
                  :disabled="
                    CountryId ? false : true && RegionId ? false : true
                  "
                  :CountryId="CountryId"
                  :RegionId="RegionId"
                  :CityId="CityId"
                  @SelectCityId="CityId = $event"
                ></Cities>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="CommercialRegisterNumber"
                  :label="$t('Merchant.CommercialRegisterNumber')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="TaxNumber"
                  :label="$t('Merchant.TaxNumber')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="MunicipalLicenseNumber"
                  :label="$t('Merchant.MunicipalLicenseNumber')"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :rules="[rules.required]"
                  v-model="RequestTypeId"
                  :label="$t('SourceIntroduction.sourceIntroductionTypes')"
                  :items="
                    getRequestTypesList.map(({ nameAr, id }) => ({
                      text: nameAr,
                      value: id
                    }))
                  "
                  width="10%"
                  style="margin: 18px 0 0 0"
                  outlined
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  v-model="Attachments"
                  show-size
                  counter
                  multiple
                  outlined
                  :label="$t('common.Attachments')"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="4">
                <v-textarea
                  :rules="[rules.required]"
                  v-model="Details"
                  rows="4"
                  prepend-icon="mdi-pen"
                  outlined
                  :label="$t('common.details')"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  :loading="loading"
                  class="mx-2 mb-4"
                  @click="addMerchant()"
                >
                  {{ $t('common.add') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Countries from '../../../components/Geography/Countries.vue'
import Regions from '../../../components/Geography/Region.vue'
import Cities from '../../../components/Geography/Cities.vue'
import VuePhoneNumberInput from 'vue-phone-number-input'
import i18n from '../../../plugins/vue-i18n'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
export default {
  name: 'addModerator',
  components: {
    Countries,
    Regions,
    Cities,
    VuePhoneNumberInput
  },
  data() {
    return {
      isFormValid: true,
      loading: false,
      Name: '',
      Phone: '',
      dummyPhone: '',
      isPhoneValid: true,
      Email: '',
      CompanyName: '',
      Address: '',
      CountryId: '',
      CommercialRegisterNumber: '',
      TaxNumber: '',
      CityId: '',
      MunicipalLicenseNumber: '',
      RegionId: '',
      Activity: '',
      RequestTypeId: '',
      Details: '',
      Attachments: null,

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
    ...mapGetters('SourceIntroduction', ['getRequestTypesList']),
    ...mapGetters('Merchant', ['getStatusCode']),

    requiredPhoneNumber() {
      return this.isPhoneValid ? false : true
    },
    phoneNumberInputTranslations() {
      let obj = {
        countrySelectorLabel: this.$i18n.t('geography.countryCode'),
        countrySelectorError: this.$i18n.t('geography.chooseACountry'),
        phoneNumberLabel: this.$i18n.t('users.phoneNumber')
      }
      return obj
    }
  },
  methods: {
    ...mapActions('Merchant', ['postMerchant']),
    ...mapActions('SourceIntroduction', ['fetchRequestTypes']),
    validateNumber(e) {
      console.log(e);
      this.isPhoneValid = e.isValid
      this.Phone = +e.formattedNumber
    },
    addMerchant() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.postMerchant({
          Name: this.Name,
          Phone: this.Phone,
          Email: this.Email,
          CompanyName: this.CompanyName,
          Address: this.Address,
          CountryId: this.CountryId,
          CityId: this.CityId,
          RegionId: this.RegionId,
          CommercialRegisterNumber: this.CommercialRegisterNumber,
          TaxNumber: this.TaxNumber,
          MunicipalLicenseNumber: this.MunicipalLicenseNumber,
          Activity: this.Activity,
          RequestTypeId: this.RequestTypeId,
          Details: this.Details,
          Attachments: this.Attachments
        })
          .then(() => {
            this.loading = false

            // this.Name = ''
            // this.Phone = ''
            // this.Email = ''
            // this.CompanyName = ''
            // this.Address = ''
            // this.CountryId = ''
            // this.CityId = ''
            // this.RegionId = ''
            // this.Activity = ''
            // this.RequestTypeId = ''
            // this.Details = ''
            // this.Attachments = null
          })
          .catch(() => {
            this.loading = false;
          })
      }
    }
  },
  mounted() {
    this.fetchRequestTypes()
  }
}
</script>
<style lang="scss">
.mapHeader {
  color: #fff;
  background-color: #042d4e;
  padding: 0.5rem;
}
.center-content {
  padding: 20px;

  margin: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 15px 2px #00000020;
}
.h {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
}
.createMerchent {
  background-color: #042d4e;
  color: #fff;
  padding: 20px;
  height: 70px;
  margin-bottom: 20px !important;
}
</style>
