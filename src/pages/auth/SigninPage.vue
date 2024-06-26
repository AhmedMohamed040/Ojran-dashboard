<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">Welcome</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="credentials.email"
            :rules="[rules.required]"
            :validate-on-blur="false"
            :error="error"
            :label="$t('login.email')"
            name="email"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          ></v-text-field>

          <v-text-field
            v-model="credentials.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="errorMessages"
            :label="$t('login.password')"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            :disabled="isSignInDisabled"
            block
            x-large
            color="primary"
            @click="submit()"
            >{{ $t('login.button') }}</v-btn
          >

          <div class="caption font-weight-bold text-uppercase my-3">
            {{ $t('login.orsign') }}
          </div>

          <!-- external providers list -->
          <v-btn
            v-for="provider in providers"
            :key="provider.id"
            :loading="provider.isLoading"
            :disabled="isSignInDisabled"
            class="mb-2 primary lighten-2 primary--text text--darken-3"
            block
            x-large
            to="/"
          >
            <v-icon small left>mdi-{{ provider.id }}</v-icon>
            {{ provider.label }}
          </v-btn>

          <div v-if="errorProvider" class="red--text">
            {{ errorProviderMessages }}
          </div>

          <div class="mt-5">
            <router-link to="/auth/forgot-password">
              {{ $t('login.forgot') }}
            </router-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      {{ $t('login.noaccount') }}
      <router-link to="/auth/signup" class="font-weight-bold">
        {{ $t('login.create') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Sign In Page Component
|---------------------------------------------------------------------
|
| Sign in template for user authentication into the application
|
*/
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',
      credentials: {
        email: '',
        password: ''
      },
      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      providers: [
        {
          id: 'google',
          label: 'Google',
          isLoading: false
        },
        {
          id: 'facebook',
          label: 'Facebook',
          isLoading: false
        }
      ],

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  computed: {
    ...mapState('Info', ['permissions']),
    ...mapState('Info', ['role'])
  },
  methods: {
    ...mapMutations('Info', ['setPermissions']),
    ...mapMutations('Info', ['setRole']),
    async login(credentials) {
      if (!this.$refs.form.validate()) {
        return
      } else {
        try {
          await this.$store.dispatch('login', credentials)

          this.setRole(localStorage.getItem('role'))
          this.setPermissions(JSON.parse(localStorage.getItem('permissions')))

          history.pushState(null, null, null)
          window.addEventListener('popstate', () => {
            history.pushState(null, null, null)
          })
          window.location.reload()
          setTimeout(this.$router.go({
            path: '/'
          }), 100)
        } catch (e) {
          return e
        }
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        await this.login(this.credentials)
        setTimeout(() => {
          this.isLoading = false
          this.isSignInDisabled = false
          this.$router.replace('/')
        }, 20)
      }
    },
    signIn(email, password) {
      // this.$router.push('/')
    },

    signInProvider(provider) {},
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
