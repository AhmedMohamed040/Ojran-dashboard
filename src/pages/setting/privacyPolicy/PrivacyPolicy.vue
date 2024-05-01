<template>
  <div class="d-flex flex-column flex-grow-1 ma-0">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.privacyPolicy') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card >

        <v-card-title class="font-weight-medium font-weight-medium justify-space-between">

          {{ $t('setting.editPrivacy') }}
          <div>
            <v-tabs
              v-model="tab"
              class="rounded"
            >
              <v-tab v-for="lang in languages" :key="lang.id" @click="changeContent()">{{ lang.name }}</v-tab>

            </v-tabs>
          </div>

        </v-card-title>
        <v-card-text>
          <vue-editor v-model="policy.text" :dir="dir"></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            class="mx-2"
            @click="save(getPrivacyPolicy)"
          >
            {{ $t("common.save") }}
          </v-btn>
        </v-card-actions>
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
import { mapMutations, mapGetters, mapActions } from 'vuex'

// Basic Use - Covers most scenarios
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },

  data() {
    return {
      policy: {
        text: ''
      },
      tab: 0,

      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
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
          text: this.$i18n.t('setting.privacyPolicy')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getPrivacyPolicy']),
    getPrivacyPolicyText() {
      return this.getPrivacyPolicy
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
    this.fetchPrivacyPolicy().then((res) => {

      console.log('here',res.data.model[0])

      if (this.tab == 0) {
        this.policy.text = res.data.model[0].valueAr
      }
      else {
        this.policy.text = res.data.model[0].value

      }

    } )
   // this.policy = { ...this.getPrivacyPolicyText }
  },

  methods: {
    ...mapActions('AboutUs', ['fetchPrivacyPolicy', 'changePrivacyPolicy']),
    save(item) {
      if (this.tab == 0) {
        this.changePrivacyPolicy({
          id: item.id,
          Value: item.value,
          ValueAr: this.policy.text,
          NameAr: this.policy.text,
          NameEn: item.nameEn
        }).then((res) => {
          console.log(res)
          if (res.status === 200 || res.statusText == 'OK') {
            this.snackbar = true
          }

        }).catch((err) => {
          if (err.name == 'AxiosError') {
            this.error = true
          }
        })
      } else {
        this.changePrivacyPolicy({
          id: item.id,
          Value: this.policy.text,
          ValueAr: item.valueAr,
          NameAr: item.nameAr,
          NameEn: this.policy.text
        }).then((res) => {
          console.log(res)
          if (res.status === 200 || res.statusText == 'OK') {
            this.snackbar = true
          }

        }).catch((err) => {
          if (err.name == 'AxiosError') {
            this.error = true
          }
        })
      }
    },

    changeContent() {

      if (this.tab == 1) {
        this.policy.text = this.getPrivacyPolicyText.valueAr
      }
      if (this.tab == 0) {
        this.policy.text = this.getPrivacyPolicyText.value

      }
    }
  }
}
</script>

<style>

</style>
