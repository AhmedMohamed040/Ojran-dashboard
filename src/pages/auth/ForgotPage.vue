<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{
        $t('forgot.title')
      }}</v-card-title>
      <v-card-subtitle>
        {{ $t('forgot.subtitle') }}
      </v-card-subtitle>

      <!-- reset form -->
      <v-card-text>
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          :validate-on-blur="false"
          :error="error"
          :error-messages="errorMessages"
          :label="$t('forgot.email')"
          name="email"
          outlined
          @keyup.enter="submit"
          @change="resetErrors"
        ></v-text-field>
        <v-dialog
          transition="dialog-top-transition"
          max-width="350"
          v-model="otpDialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-5" block x-large color="primary" @click="submit">{{
              $t('forgot.button')
            }}</v-btn>
          </template>
          <template>
            <v-card>
              <v-toolbar color="primary" dark>
                <h2 class="my-3">
                  {{ $t('forgot.enterOtp') }}
                </h2>
              </v-toolbar>
              <v-card-text class="my-3">
                <div>
                  <h4 class="mb-2">{{ $t('forgot.otp') }}</h4>
                  <v-otp-input
                    type="number"
                    v-model="otp"
                    length="4"
                  ></v-otp-input>
                </div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="primary"
                  outlined
                  @click="verify()"
                  :disabled="otp.length !== 4"
                  >{{ $t('email.send') }}</v-btn
                >
                <v-btn outlined @click="otpDialog = false">{{
                  $t('common.cancel')
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      <router-link to="/auth/signin">
        {{ $t('forgot.backtosign') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Forgot Page Component
|---------------------------------------------------------------------
|
| Template to send email to remember/replace password
|
*/

export default {
  data() {
    return {
      // reset button
      isLoading: false,

      // form
      isValid: true,
      email: '',
      otp: '',
      otpDialog: false,

      // form error
      error: false,
      errorMessages: '',

      // input rules
      rules: {
        required: (value) =>
          (value && Boolean(value)) || this.$i18n.t('common.required'),
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$i18n.t('common.invalidEmail')
        }
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('forgetPassword', this.email).then(() => {
        this.otpDialog = true
      })
    },
    verify() {
      let obj = {
        email: this.email,
        otp: this.otp
      }
      this.$store.dispatch('checkOTPForResetPassword', obj).then((response) => {
        this.$router.push('/auth/reset-password')
      })
    },

    resetErrors() {
      this.error = false
      this.errorMessages = ''
    }
  }
}
</script>
