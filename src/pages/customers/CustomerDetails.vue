<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">

      <div>
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
        <div class="display-1">
           {{ $t('profile.editUser') }}
            {{ getCustomer.name && `- ${getCustomer.name}` }}
          </div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <!-- <div
      class="d-flex align-center font-weight-bold primary--text my-2"
    >
      <v-icon small color="primary">mdi-security</v-icon>
      <span class="ma-1">{{fetchCustomer.role}}</span>
    </div> -->

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab to="#tabs-account">Account</v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-account">
        <div class="my-2">
          <div>
            <v-card>
              <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
              <v-card-text>
                <v-row class="ma-0">
                  <v-col cols="12" md="3">
                    <v-img
                      :src="
                        getCustomer.imageUrl ? getCustomer.imageUrl : '/images/avatars/avatar1.svg'
                      "
                      aspect-ratio="1"
                      class="blue-grey lighten-4 rounded elevation-3"
                      max-width="90"
                      max-height="90"
                    ></v-img>
                    <span>{{ $t('profile.avatar') }}</span>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-row class="profile">
                      <v-col cols="3">
                        {{ $t('profile.name') }}
                      </v-col>
                      <v-col cols="9">
                        {{ getCustomer.name }}
                      </v-col>
                      <v-col cols="3">
                        {{ $t('profile.phone') }}
                      </v-col>
                      <v-col cols="9">
                        {{ getCustomer.phone }}
                      </v-col>
                      <v-col cols="3">
                        {{ $t('profile.email') }}
                      </v-col>
                      <v-col cols="9">
                        {{ getCustomer.email }}
                      </v-col>
                      <v-col cols="3">
                        {{ $t('common.status') }}
                      </v-col>
                      <v-col cols="9">
                        <span
                          v-if="getCustomer.isActive"
                          class="moderators"
                        >
                          <v-chip
                            class=""

                            color="success"
                          >
                            {{ $t('common.active') }}
                          </v-chip>
                        </span>
                        <span v-else class="moderators">
                          <v-chip
                            class=""

                            color="warning"
                          >
                            {{ $t('common.inactive') }}
                          </v-chip>
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>

            </v-card>

            <v-expansion-panels class="mt-3">
              <v-expansion-panel>
                <v-expansion-panel-header class="title">{{
                  $t('common.edit')
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card v-if="!getCustomer.isActive"  class="warning mb-4" light>
                    <v-card-title>{{ $t('customers.enableUser') }}</v-card-title>
                    <v-card-subtitle>{{ $t('customers.thisInActiveUser') }}</v-card-subtitle>
                    <v-card-text>
                      <v-btn dark @click="onUser(getCustomer.id)">
                        <v-icon left small>mdi-account-check</v-icon>{{ $t('customers.enableUser') }}
                      </v-btn>
                    </v-card-text>
                  </v-card>

                  <v-card v-else class="success mb-4" light>
                    <v-card-title>{{ $t('customers.disabledUser') }}</v-card-title>
                    <v-card-subtitle>{{ $t('customers.thisUserActive') }}</v-card-subtitle>

                    <v-card-text>
                      <v-btn dark @click="offUser(getCustomer.id)">
                        <v-icon left small>mdi-account-check</v-icon>{{ $t('customers.disabledUser') }}
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- disable modal -->
        </div>
      </v-tab-item>

    </v-tabs-items>

  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import AccountTab from './EditUser/AccountTab'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    AccountTab
  },
  data() {
    return {

      tab: null,
      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      panel: [1],
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.customers'),
          to: '/customers/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersEdit')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Moderators', ['getCustomer']),
    checkActive() {
      return this.getCustomer.isActive
    }
  },

  methods: {
    ...mapActions('Moderators', [
      'fetchCustomer',
      'changeUserStatus'
    ]),
    onUser(id) {
      this.changeUserStatus({
        id: id,
        status: true
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
    },

    offUser(id) {
      this.changeUserStatus({
        id: id,
        status: false
      }).then((res) => {

        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },

  },
  mounted() {
    this.fetchCustomer(this.$route.params.singlecustomer_id)
  }
}
</script>
