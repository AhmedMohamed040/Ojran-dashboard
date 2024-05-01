<template>
  <v-card class="pa-2">
    <v-card-title class="justify-center display-1 mb-2">{{ $t('check.title') }}</v-card-title>
    <div class="overline">{{ status }}</div>
    <div class="red--text mt-2 mb-4">{{ error }}</div>

    <a v-if="error" href="/">{{ $t('check.backtosign') }}</a>

    <v-text-field
      v-model="newPassword"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required]"
      :type="showPassword ? 'text' : 'password'"
      :error="errorNewPassword"
      :error-messages="errorNewPasswordMessage"
      name="password"
      :label="$t('check.newpassword')"
      outlined
      class="mt-4 mb-1"
      @change="resetErrors"
      @keyup.enter="confirmPasswordReset"
      @click:append="showPassword = !showPassword"
    ></v-text-field>

    <v-btn
      :loading="isLoading"
      block
      depressed
      x-large
      color="primary"
      @click="confirmPasswordReset"
    >{{ $t('check.button') }}</v-btn>
  </v-card>
</template>

<script>
/*
//this.$router.push('/auth/verify-email')
|---------------------------------------------------------------------
| Reset Page Component
|---------------------------------------------------------------------
|
| Page Form to insert new password and proceed to sign in
|
*/
export default {
  data() {
    return {
      isLoading: false,

      showNewPassword: true,
      newPassword: '',

      // form error
      errorNewPassword: false,
      errorNewPasswordMessage: '',

      // show password field
      showPassword: false,

      status: this.$i18n.t('login.newPassword'),
      error: null,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || this.$i18n.t('Orders.required')
      }
    }
  },
  computed: {
    email() {
      return this.$store.getters.getEmail
    },
    token() {
      return this.$store.getters.getResetToken
    }
  },
  methods: {
    confirmPasswordReset() {
      let sendObj = {
        token: this.token,
        email: this.email,
        password: this.newPassword
      }

      this.isLoading = true
      this.$store.dispatch('resetPassword', sendObj).then((response) => {
        this.$router.replace('/auth/signin')
      }).finally(() => {
        sendObj = {
          token: '',
        email: '',
        password: ''
        }
      })
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    resetErrors() {
      this.errorNewPassword = false
      this.errorNewPasswordMessage = ''
    }

  }
}
</script>
