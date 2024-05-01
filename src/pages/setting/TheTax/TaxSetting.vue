<template>
  <div class="d-flex flex-column flex-grow-1 ">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.tax') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card>

        <v-card-title class="font-weight-medium pa-4">
          {{ $t('setting.editTax') }}
        </v-card-title>
        <v-container>
          <v-row class="ma-0">
            <v-col cols="1">
              <v-subheader class="font-weight-bold">
              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="tax.REGISTERED_EMAIL.value"
                :label="$t('setting.t_email')"
                color="blue"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader class="font-weight-bold">

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="tax.REGISTERED_NAME.value"
                color="green"
                :label="$t('setting.t_name')"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-col cols="1">
              <v-subheader>

              </v-subheader>

            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.COMMERICAL_REGISTER.value" color="pink darken-1" :label="$t('setting.t_commercial')" outlined></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>

              </v-subheader>

            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.REGISTERED_ADDRESS.value" color="red" :label="$t('setting.t_address')" outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0">

            <v-col cols="1">
              <v-subheader>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.TAX_ACCOUNT.value" color="blue" :label="$t('setting.t_account')" outlined></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.VAT.value" color="blue" :label="$t('setting.t_vat')" outlined></v-text-field>
            </v-col>

          </v-row>
          <v-row class="ma-0">

            <v-col cols="1">
              <v-subheader>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.REGISTERED_PHONE.value" color="blue" :label="$t('setting.t_phone')" outlined></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="tax.TAX_NUMBER.value" color="blue" :label="$t('setting.t_number')" outlined></v-text-field>
            </v-col>

          </v-row>

          <v-row class="ma-0">
            <v-col>
              <v-btn color="primary" class="mx-2" @click="saveTax()">
                {{ $t("common.save") }}
              </v-btn>
            </v-col>

          </v-row>

        </v-container>
      </v-card>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="blue darken-1"
      bottom
      top
      text
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue darken-1" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="error"
      :timeout="timeout"
      color="error darken-1"
      bottom
      top
      text
    >
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="error darken-1" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      tax: {
        REGISTERED_EMAIL: '',
        REGISTERED_NAME: '',
        COMMERICAL_REGISTER: '',
        REGISTERED_ADDRESS: '',
        TAX_ACCOUNT: '',
        VAT: '',
        REGISTERED_PHONE: '',
        TAX_NUMBER: ''
      },

      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      breadcrumbs: [
        {
          text: this.$i18n.t('footer.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('setting.tax')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getTax']),
    getAllTax() {
      return this.getTax
    }
  },
  mounted() {
    this.fetchTax().then((res) => this.findTax())
    // this.media = { ...this.getAllMedia }
  },

  methods: {
    ...mapActions('AboutUs', ['fetchTax', 'changeTax']),
    findTax() {
      const t_email = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'REGISTERED_EMAIL'.toLowerCase())
      const t_name = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'REGISTERED_NAME'.toLowerCase())
      const t_register = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'COMMERICAL_REGISTER'.toLowerCase())
      const t_adress = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'REGISTERED_ADDRESS'.toLowerCase())
      const t_account = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'TAX_ACCOUNT'.toLowerCase())
      const T_vat = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'VAT'.toLowerCase())
      const T_phone = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'REGISTERED_PHONE'.toLowerCase())
      const T_number = this.getAllTax.find((tax) => tax.key.toLowerCase() == 'TAX_NUMBER'.toLowerCase())

      this.tax.REGISTERED_EMAIL = t_email
      this.tax.REGISTERED_NAME = t_name
      this.tax.COMMERICAL_REGISTER = t_register
      this.tax.REGISTERED_ADDRESS = t_adress
      this.tax.TAX_ACCOUNT = t_account
      this.tax.VAT = T_vat
      this.tax.REGISTERED_PHONE = T_phone
      this.tax.TAX_NUMBER = T_number

      return this.tax

    },
    saveTax() {
      // console.log(this.tax[Object.keys(this.tax)[1]])
      for (let e = 0; e < 8; e ++) {
        this.changeTax({
          id: this.tax[Object.keys(this.tax)[e]].id,
          Value: this.tax[Object.keys(this.tax)[e]].value,
          ValueAr: null,
          NameAr: this.tax[Object.keys(this.tax)[e]].nameAr,
          NameEn: this.tax[Object.keys(this.tax)[e]].nameEn
        }).then((res) => {
      console.log(res);
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if(err.name == 'AxiosError') {
          this.error = true
        }
      })
      }

    }

  }
}
</script>

<style></style>
