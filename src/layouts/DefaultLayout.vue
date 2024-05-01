<template>
  <div
    v-shortkey="['ctrl', '/']"
    class="d-flex flex-grow-1"
    @shortkey="onKeyup"
  >
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1 pb-5"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
          <div
            class="title font-weight-bold text-uppercase primary--text d-flex align-center justify-space-between"
          >
            <v-img
              max-width="150"
              class="mx-auto"
              src="../assets/images/ojranLogo.png"
            >
            </v-img>
          </div>
        </div>
        <v-divider></v-divider>
      </template>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card
        class="flex-grow-1 d-flex"
        :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
        :flat="!isToolbarDetached"
      >
        <div class="d-flex flex-grow-1 align-center">
          <!-- search input mobile -->
          <v-text-field
            v-if="showSearch"
            append-icon="mdi-close"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            hide-details
            solo
            flat
            autofocus
            @click:append="showSearch = false"
          ></v-text-field>

          <div v-else class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>

            <v-spacer class="d-none d-lg-block"></v-spacer>

            <!-- search input desktop -->
            <v-text-field
              ref="search"
              class="mx-1 hidden-xs-only"
              :placeholder="$t('menu.search')"
              prepend-inner-icon="mdi-magnify"
              hide-details
              filled
              rounded
              dense
            ></v-text-field>

            <v-spacer class="d-block d-sm-none"></v-spacer>

            <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <toolbar-language />

            <!-- <div class="hidden-xs-only mx-1">
              <toolbar-currency />
            </div> -->

            <!-- <toolbar-apps /> -->

            <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
              <toolbar-notifications />
            </div>

            <toolbar-user />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <div v-if="count == 0 && role == 'Agent'" class="passwordChange">
        <h4>
          <v-icon dark class="mx-2">mdi-information-outline</v-icon>
          {{ $t('common.yourPasswordNeedToBeChanged') }}
        </h4>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text dark v-bind="attrs" v-on="on">
              {{ $t('common.edit') + ' ' + $t('login.password') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="text-h5">{{
                $t('common.edit') + ' ' + $t('login.password')
              }}</span>
            </v-card-title>

            <v-card-text class="mt-2">
              <v-row class="my-3">
                <v-col cols="12">
                  <v-text-field
                    v-model="credentials.oldPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    :label="$t('login.oldPassword')"
                    counter
                    filled
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    v-model="credentials.newPassword"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    name="input-10-1"
                    :label="$t('login.newPassword')"
                    counter
                    filled
                    @click:append="show = !show"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <hr class="header-divider primary" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="isLoading"
                :disabled="isSignInDisabled"
                color="blue darken-1"
                dark
                class="my-2 px-3 py-3"
                @click="submit()"
              >
                {{ $t('common.save') }}
              </v-btn>

              <v-btn
                color="red darken-1"
                dark
                class="my-2 mx-2 px-3 py-3"
                @click="close()"
              >
                {{ $t('common.cancel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-container :fluid="!isContentBoxed">
        <slot></slot>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
import ToolbarApps from '../components/toolbar/ToolbarApps'
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'
import ToolbarCurrency from '../components/toolbar/ToolbarCurrency'
import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'

export default {
  components: {
    MainMenu,
    ToolbarUser,
    ToolbarLanguage,
    ToolbarNotifications
  },
  data() {
    return {
      dialog: false,
      isLoading: false,
      isSignInDisabled: false,
      count: localStorage.getItem('passwordChangeCount') || 0,
      role: localStorage.getItem('role') || '',
      show: false,
      show1: false,
      drawer: null,
      showSearch: false,
      credentials: {
        oldPassword: '',
        newPassword: ''
      },
      navigation: config.navigation
    }
  },
  computed: {
    ...mapState('app', [
      'product',
      'isContentBoxed',
      'menuTheme',
      'toolbarTheme',
      'isToolbarDetached'
    ])
  },
  methods: {
    onKeyup(e) {
      this.$refs.search.focus()
    },
    close() {
      this.dialog = false
    },
    save() {
      this.dialog = false
    },
    ...mapActions('Info', ['changePassword']),
    async submit() {
      this.isLoading = true
      // this.isSignInDisabled = true
      const res = await this.changePassword(this.credentials)

      if (res.status === 200 || res.status === 201) {
        this.dialog = false
        localStorage.setItem('passwordChangeCount', 1)
        this.count = 1
      }
      this.isLoading = false
      // this.isSignInDisabled = false
    }
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
.passwordChange {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  color: aliceblue;

  background-color: rgba(255, 0, 0, 0.5);
}
</style>
