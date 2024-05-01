<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('setting.contact') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <div>
      <v-card>
        <v-card-title
          class="font-weight-medium font-weight-medium justify-space-between"
        >
          {{ $t('setting.editContact') }}
          <div>
            <v-tabs v-model="tab" class="rounded">
              <v-tab
                v-for="lang in languages"
                :key="lang.id"
                @click="changeContent()"
              >{{ lang.name }}</v-tab>
            </v-tabs>
          </div>
        </v-card-title>
        <v-container>
          <v-row class="ma-0">
            <v-col cols="1">
              <v-subheader class="font-weight-bold"> </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="showValue.email"
                :label="$t('setting.t_email')"
                color="blue"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader> </v-subheader>
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                v-model="showValue.address"
                color="red"
                :label="$t('setting.t_address')"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader> </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="showValue.phone"
                color="blue"
                :label="$t('setting.t_phone')"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="ma-0">
            <v-col>
              <v-btn color="primary" class="mx-2" @click="saveInfo()">
                {{ $t('common.save') }}
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
        <v-btn
          color="blue darken-1"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
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
        <v-btn
          color="error darken-1"
          text
          v-bind="attrs"
          @click="error = false"
        >
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
      info: {
        email: '',

        address: '',

        phone: ''
      },

      error: false,
      showValue: {
        email: '',

        address: '',

        phone: ''
      },
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      tab: 0,
      languages: [
        { id: 1, name: 'ar' },
        { id: 2, name: 'en' }
      ],
      breadcrumbs: [
        {
          text: this.$i18n.t('footer.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('setting.contact')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getContact']),
    getAllContact() {
      return this.getContact
    },
    dir() {
      if (this.tab == 0) {
        return 'rtl'
      } else {
        return 'ltr'
      }
    }
  },
  mounted() {
    this.fetchContact().then((res) => {
      this.findInfo()

      if (this.tab == 0) {
        console.log(res.data.model.valueAr)

        this.showValue.email = this.info.email.valueAr
        this.showValue.address = this.info.address.valueAr
        this.showValue.phone = this.info.phone.valueAr

      } else {
        this.showValue.email = this.info.email.value
        this.showValue.address = this.info.address.value
        this.showValue.phone = this.info.phone.value
      }
    })
    // this.media = { ...this.getAllMedia }
  },

  methods: {
    ...mapActions('AboutUs', ['fetchContact', 'changeContact']),
    findInfo() {
      const email = this.getAllContact.find(
        (info) => info.key.toLowerCase() == 'CONTACT_EMAIL'.toLowerCase()
      )
      const adress = this.getAllContact.find(
        (info) => info.key.toLowerCase() == 'CONTACT_ADDRESS'.toLowerCase()
      )
      const phone = this.getAllContact.find(
        (info) => info.key.toLowerCase() == 'CONTACT_PHONE'.toLowerCase()
      )

      this.info.email = email
      this.info.address = adress
      this.info.phone = phone

      return this.info
    },
    async saveInfo() {
      if (this.tab == 0) {
        this.changeContact({
          id: this.info.phone.id,
          Value: this.info.phone.value,
          ValueAr: this.showValue.phone,
          NameAr: this.showValue.phone,
          NameEn: this.info.phone.nameEn
        })
        this.changeContact({
          id: this.info.address.id,
          Value: this.info.address.value,
          ValueAr: this.showValue.address,
          NameAr: this.showValue.address,
          NameEn: this.info.address.nameEn
        })
        this.changeContact({
          id: this.info.email.id,
          Value: this.info.email.value,
          ValueAr:this.showValue.email,
          NameAr: this.showValue.email,
          NameEn: this.info.email.nameEn
        })
          .then((res) => {
            console.log(res)
            if (res.status === 200 || res.statusText == 'OK') {
              this.snackbar = true
              this.findInfo()
            }
          })
          .catch((err) => {
            if (err.name == 'AxiosError') {
              this.error = true
            }
          })

      } else {
        this.changeContact({
          id: this.info.phone.id,
          Value: this.showValue.phone,
          ValueAr: this.info.phone.valueAr,
          NameAr: this.info.phone.nameAr,
          NameEn: this.showValue.phone
        })
        this.changeContact({
          id: this.info.address.id,
          Value: this.showValue.address,
          ValueAr: this.info.address.valueAr,
          NameAr: this.info.address.nameAr,
          NameEn: this.showValue.address
        })
        this.changeContact({
          id: this.info.email.id,
          Value: this.showValue.email,
          ValueAr: this.info.email.valueAr,
          NameAr: this.info.email.nameAr,
          NameEn: this.showValue.email
        })
          .then((res) => {
            console.log(res)
            if (res.status === 200 || res.statusText == 'OK') {
              this.snackbar = true
              this.findInfo()

            }
          })
          .catch((err) => {
            if (err.name == 'AxiosError') {
              this.error = true
            }
          })

      }
    },
    changeContent() {
      if (this.tab == 1) {
        this.findInfo()

        this.showValue.email = this.info.email.valueAr
        this.showValue.address = this.info.address.valueAr
        this.showValue.phone = this.info.phone.valueAr
      }
      if (this.tab == 0) {
        this.findInfo()

        this.showValue.email = this.info.email.value
        this.showValue.address = this.info.address.value
        this.showValue.phone = this.info.phone.value
      }
    }
  }
}
</script>

<style></style>
