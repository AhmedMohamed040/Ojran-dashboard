<template>
  <div class="my-2">
    <div>
      <v-card>
        <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3" class="mb-3">
              <v-img
                :src="user.imageUrl ? user.imageUrl : avatar"
                aspect-ratio="1"
                class="blue-grey lighten-4 rounded elevation-3 my-3"
                max-width="90"
                max-height="90"
              ></v-img>
              <span>{{ $t('profile.avatar') }}</span>
            </v-col>
            <v-col cols="12" md="8" class="py-5">
              <v-row class="profile">
                <v-col cols="3">
                  {{ $t('profile.name') }}
                </v-col>
                <v-col cols="9">
                  {{ user.name }}
                </v-col>
                <v-col cols="3">
                  {{ $t('profile.phone') }}
                </v-col>
                <v-col cols="9">
                  {{ user.phone }}
                </v-col>
                <v-col cols="3">
                  {{ $t('profile.email') }}
                </v-col>
                <v-col cols="9">
                  {{ user.email }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-expansion-panels v-model="panel" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('common.edit') + ' ' + $t('profile.BasicInformation')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" md="3" class="py-3">
                <v-img
                  :src="user.imageUrl ? user.imageUrl : avatar"
                  aspect-ratio="1"
                  class="blue-grey lighten-4 rounded elevation-3 my-3"
                  max-width="90"
                  max-height="90"
                ></v-img>
                <v-file-input
                  prepend-icon="mdi-camera"
                  hide-input
                  :label="$t('profile.avatar')"
                  v-model="ProfileImage"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="8" class="my-5">
                <v-text-field
                  v-model="user.name"
                  :label="$t('profile.name')"
                  placeholder="name"
                ></v-text-field>

                <div class="mt-2">
                  <v-btn
                    @click="
                      ubdateUser({ user, ProfileImage }).then(() => {
                        fetchUser()
                      })
                    "
                    color="primary"
                    >{{ $t('common.save') }}</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('common.edit') + ' ' + $t('login.password')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="my-3">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="oldPassword"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  :label="$t('login.oldPassword')"
                  counter
                  filled
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="input-10-1"
                  :label="$t('login.newPassword')"
                  counter
                  filled
                  @click:append="show = !show"
                ></v-text-field>

                <div class="d-flex flex-column"></div>

                <div class="mt-2">
                  <v-btn
                    @click="changePassword({ oldPassword, newPassword })"
                    color="primary"
                    >{{ $t('common.save') }}</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('common.edit') + ' ' + $t('profile.phone')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="my-3">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="user.phone"
                  :label="$t('profile.phone')"
                  placeholder="phone"
                ></v-text-field>
                <v-dialog transition="dialog-top-transition" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      @click="changePhone(user.phone)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t('common.save') }}
                    </v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>
                        <h2 class="my-3">{{ $t('profile.verifyPhone') }}</h2>
                      </v-toolbar>
                      <v-card-text class="my-3">
                        <div>
                          <h4 class="mb-2">{{ $t('profile.otp') }}</h4>
                          <v-otp-input v-model="otp" length="4"></v-otp-input>
                        </div>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          color="primary"
                          @click="
                            verifyMyPhone({ user, otp }), (dialog.value = false)
                          "
                          >{{ $t('common.send') }}</v-btn
                        >
                        <v-btn text @click="dialog.value = false">{{
                          $t('common.cancel')
                        }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('common.edit') + ' ' + $t('profile.email')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-row class="my-3">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="user.email"
                  :rules="emailRules"
                  :label="$t('profile.email')"
                  placeholder="email"
                ></v-text-field>
                <v-dialog transition="dialog-top-transition" max-width="350">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      @click="changeEmail(user.email)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t('common.save') }}
                    </v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>
                        <h2 class="my-3">{{ $t('profile.verifyEmail') }}</h2>
                      </v-toolbar>
                      <v-card-text class="my-3">
                        <div>
                          <h4 class="mb-2">{{ $t('profile.otp') }}</h4>
                          <v-otp-input v-model="otp" length="4"></v-otp-input>
                        </div>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          color="primary"
                          @click="
                            verifyMyEmail({ user, otp })
                            {
                              dialog.value = false
                            }
                          "
                          >{{ $t('common.send') }}</v-btn
                        >
                        <v-btn text @click="dialog.value = false">{{
                          $t('common.cancel')
                        }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    avatar: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      otp: '',
      phone: '',
      email: '',
      verifyEmail: '',
      verifyPhone: '',
      oldPassword: '',
      newPassword: '',
      show: false,
      show1: false,
      ProfileImage: null,
      panel: [],
      dialog: false,
      deleteDialog: false,
      disableDialog: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    ...mapActions('Info', [
      'changePassword',
      'ubdateUser',
      'changeEmail',
      'changePhone',
      'verifyMyEmail',
      'verifyMyPhone',
      'fetchUser'
    ])
  }
}
</script>
<style>
.profile {
  font-size: 15px;
  color: black !important;
}
</style>
