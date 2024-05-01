<template>
  <div class="d-flex flex-column flex-grow-1 ">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.media') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card>

        <v-card-title class="font-weight-medium pa-4">
          {{ $t('setting.editMedia') }}
        </v-card-title>
        <v-container>
          <v-row class="ma-0">
            <v-col cols="1">
              <v-subheader class="font-weight-bold">
                <v-icon large color="blue">mdi-facebook</v-icon>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="media.Facebook.value"
                label="Facebook"
                color="blue"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>

                <v-icon large color="green">mdi-whatsapp</v-icon>
              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="media.WhatsApp.value"
                color="green"
                label="WhatsApp"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-col cols="1">
              <v-subheader>

                <v-icon large color="pink lighten-1">mdi-instagram</v-icon>
              </v-subheader>

            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="media.Instagram.value" color="pink darken-1" label="Instagram" outlined></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>

                <v-icon large color="red">mdi-gmail</v-icon>
              </v-subheader>

            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="media.Mail.value" color="red" label="Mail" outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0">

            <v-col cols="1">
              <v-subheader>
                <v-icon large color="blue">mdi-twitter</v-icon>

              </v-subheader>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field v-model="media.Twitter.value" color="blue" label="Twitter" outlined></v-text-field>
            </v-col>

          </v-row>
          <v-row class="ma-0">
            <v-col>
              <v-btn color="primary" class="mx-2" @click="saveMedia()">
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
      media: {
        Facebook: '',
        WhatsApp: '',
        Twitter: '',
        Mail: '',
        Instagram: ''

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
          text: this.$i18n.t('setting.media')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getMedia']),
    getAllMedia() {
      return this.getMedia
    }
  },
  mounted() {
    this.fetchMedia().then((res) => this.findMedia())
    // this.media = { ...this.getAllMedia }
  },

  methods: {
    ...mapActions('AboutUs', ['fetchMedia', 'changeMedia']),
    findMedia() {
      const facebook = this.getAllMedia.find((media) => media.key.toLowerCase() == 'FACEBOOK_LINK'.toLowerCase())
      const whatsapp = this.getAllMedia.find((media) => media.key.toLowerCase() == 'WHATSAPP'.toLowerCase())
      const titter = this.getAllMedia.find((media) => media.key.toLowerCase() == 'TWITTER_LINK'.toLowerCase())
      const mail = this.getAllMedia.find((media) => media.key.toLowerCase() == 'CONTACT_EMAIL'.toLowerCase())
      const instagram = this.getAllMedia.find((media) => media.key.toLowerCase() == 'INSTAGRAM_LINK'.toLowerCase())

      console.log(facebook, mail, instagram)
      this.media.Facebook = facebook
      this.media.WhatsApp = whatsapp
      this.media.Twitter = titter
      this.media.Mail = mail
      this.media.Instagram = instagram
      console.log(this.media)

      return this.media

    },
    async saveMedia() {
      this.changeMedia({
        id: this.media.Facebook.id,
        Value: this.media.Facebook.value,
        ValueAr: null,
        NameAr: this.media.Facebook.nameAr,
        NameEn: this.media.Facebook.nameEn
      })
      this.changeMedia({
        id: this.media.WhatsApp.id,
        Value: this.media.WhatsApp.value,
        ValueAr: null,
        NameAr: this.media.WhatsApp.nameAr,
        NameEn: this.media.WhatsApp.nameEn
      })
      this.changeMedia({
        id: this.media.Twitter.id,
        Value: this.media.Twitter.value,
        ValueAr: null,
        NameAr: this.media.Twitter.nameAr,
        NameEn: this.media.Twitter.nameEn
      })
      this.changeMedia({
        id: this.media.Mail.id,
        Value: this.media.Mail.value,
        ValueAr: null,
        NameAr: this.media.Mail.nameAr,
        NameEn: this.media.Mail.nameEn
      })
      this.changeMedia({
        id: this.media.Instagram.id,
        Value: this.media.Instagram.value,
        ValueAr: null,
        NameAr: this.media.Instagram.nameAr,
        NameEn: this.media.Instagram.nameEn
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
      // await new Promise((resolve) => setTimeout(resolve, 2000))

    }
  }
}
</script>

<style></style>
