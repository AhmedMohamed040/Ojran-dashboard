<template>
  <div class="d-flex flex-column flex-grow-1 ma-0">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.termsAndConditions') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card>

        <v-card-title class="font-weight-medium font-weight-medium justify-space-between">
          {{ $t('setting.editTerms') }}
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
          <vue-editor v-model="terms" :dir="dir"></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            class="mx-2"
            @click="save(getTermsAndConditions)"
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
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },
  data() {
    return {

      terms: '',

      error: false,
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
          text: this.$i18n.t('setting.termsAndConditions')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getTermsAndConditions']),
    getTermsText() {
      return this.getTermsAndConditions
    },

    dir() {
      if (this.tab == 0) {
        return 'rtl'
      } else {
        return 'ltr'
      }
    }
  },
  watch: {
    'terms': {
      deep: true,
      immediate: true,
      handler(val) {

        console.log('changed:', val)

        val
      }
    }
  },
  mounted() {
    this.fetchTermsAndConditions().then((res) => {


      if (this.tab == 0) {
        console.log(res.data.model.valueAr)

        this.terms = res.data.model.valueAr
      }
      else {
        this.terms = res.data.model.value

      }
      console.log(res.data.model.valueAr, this.terms)

    } )

    // this.conditions = { ...this.getTermsText }
  },

  methods: {
    ...mapActions('AboutUs', ['fetchTermsAndConditions', 'changeTermsAndConditions']),
    save(item) {
      if (this.tab == 0) {
        this.changeTermsAndConditions({
          id: item.id,
          Value: item.value,
          ValueAr: this.terms,
          NameAr: this.terms,
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
        this.changeTermsAndConditions({
          id: item.id,
          Value: this.terms,
          ValueAr: item.valueAr,
          NameAr: item.nameAr,
          NameEn: this.terms
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
        this.terms = this.getTermsText.valueAr
      }
      if (this.tab == 0) {
        this.terms = this.getTermsText.value
      }
    }
  }
}
</script>

<style>

</style>
