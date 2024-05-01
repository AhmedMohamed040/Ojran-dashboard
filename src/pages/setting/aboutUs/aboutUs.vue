<template>
  <div class="d-flex flex-column flex-grow-1 ma-0">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.aboutUs') }}</div>
        <v-breadcrumbs :items="footer" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card>

        <v-card-title class="font-weight-medium font-weight-medium justify-space-between">
          {{ $t('setting.editAboutUs') }}
          <div>
            <v-tabs v-model="tab" class="rounded">
              <v-tab v-for="lang in languages" :key="lang.id" @click="changeContent()">{{ lang.name }}</v-tab>

            </v-tabs>
          </div>
        </v-card-title>
        <v-card-text>
          <!--           <div class="my-3 text-subtitle-1" v-html="tab == 0 ? getAboutUsText.valueAr : getAboutUsText.value"></div>
 -->
          <vue-editor ref="editor" v-model="aboutUs.text" :dir="dir"></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="mx-2" @click="save(getAboutUs)">
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
      aboutUs: {
        text: ''
      },
      tab: 0,
      dirChange: null,
      languages: [
        { id: 1, name: 'ar' },
        { id: 2, name: 'en' }
      ],
      footer: [
        {
          text: this.$i18n.t('footer.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('setting.aboutUs')
        }
      ],
      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000

    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getAboutUs']),
    getAboutUsText() {
      return this.getAboutUs
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

    this.fetchAboutUs().then((res) => {

      console.log(res.data.model)

      if (this.tab == 0) {
        this.aboutUs.text = res.data.model.valueAr.slice()
        /*   this.$refs.editor.quill.format('direction', 'rtl');
        this.$refs.editor.quill.format('align', 'right') */

      }
      else {
        this.aboutUs.text = res.data.model.value.slice()

      }

    })

  },

  methods: {
    ...mapActions('AboutUs', ['fetchAboutUs', 'changeAboutUs']),
    save(item) {
      if (this.tab == 0) {
        this.changeAboutUs({
          id: item.id,
          Value: item.value,
          ValueAr: this.aboutUs.text,
          NameAr: this.aboutUs.text,
          NameEn: item.nameEn
        }).then((res) => {
          if (res.status === 200 || res.statusText == 'OK') {
            this.snackbar = true
          }

        }).catch((err) => {
          if (err.name == 'AxiosError') {
            this.error = true
          }
        })
      } else {
        this.changeAboutUs({
          id: item.id,
          Value: this.aboutUs.text,
          ValueAr: item.valueAr,
          NameAr: item.nameAr,
          NameEn: this.aboutUs.text
        }).then((res) => {
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
        this.aboutUs.text = this.getAboutUsText.valueAr.slice()

      }
      if (this.tab == 0) {
        this.aboutUs.text = this.getAboutUsText.value.slice()

      }
    }
  }
}
</script>

<style></style>
