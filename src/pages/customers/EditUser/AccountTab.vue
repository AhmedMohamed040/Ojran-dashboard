<template>
  <div class="my-2">
    <div>
      <v-card>
        <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-img
                :src="
                  realUser.user.imageUrl ? realUser.user.imageUrl : user.avatar
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
                  {{ realUser.user.name }}
                </v-col>
                <v-col cols="3">
                  {{ $t('profile.phone') }}
                </v-col>
                <v-col cols="9">
                  {{ realUser.user.phone }}
                </v-col>
                <v-col cols="3">
                  {{ $t('profile.email') }}
                </v-col>
                <v-col cols="9">
                  {{ realUser.user.email }}
                </v-col>
                <v-col cols="3">
                  {{ $t('users.Permissions') }}
                </v-col>
                <v-col cols="9">
                  <span
                    class="moderators"
                    v-if="realUser.permissions.length > 0"
                  >
                    <v-chip
                      v-for="permission in realUser.permissions"
                      :key="permission.name"
                      class="ma-2"
                      color="primary"
                    >
                      {{ $t('PermissionsList.' + permission.name) }}
                    </v-chip>
                  </span>
                  <span class="moderators" v-else>----</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-expansion-panels v-model="panel" multiple class="mt-3">
        <v-expansion-panel>
          <v-expansion-panel-header class="title">{{
            $t('common.edit')
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card v-if="user.disabled" class="warning mb-4" light>
              <v-card-title>User Disabled</v-card-title>
              <v-card-subtitle
                >This user has been disabled! Login accesss has been
                revoked.</v-card-subtitle
              >
              <v-card-text>
                <v-btn dark @click="user.disabled = false">
                  <v-icon left small>mdi-account-check</v-icon>Enable User
                </v-btn>
              </v-card-text>
            </v-card>

            <v-divider></v-divider>
            <v-row>
              <v-col cols="3">
                {{ $t('users.Permissions') }}
              </v-col>
              <v-col cols="9">
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      style="cursor: pointer"
                      v-bind="attrs"
                      v-on="on"
                      @click="assign()"
                    >
                      mdi-circle-edit-outline
                    </v-icon>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-card-title class="text-h5 white--text primary">
                        {{ $t('Edit') }}
                      </v-card-title>
                      <v-card-text>
                        <v-select
                          v-model="Permissions"
                          :label="$t('Permissions')"
                          :items="
                            PermissionsList.map(({ name, value }) => ({
                              text: name,
                              value: value
                            }))
                          "
                          width="10%"
                          style="margin: 18px 0 0 0"
                          multiple
                          outlined
                          dense
                        ></v-select>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn
                          x-large
                          color="primary"
                          @click="
                            update_Moderator()
                            dialog.value = false
                          "
                        >
                          {{ $t('Save') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="dialog.value = false"
                        >
                          {{ $t('Close') }}
                        </v-btn>
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

    <!-- disable modal -->
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
    realUser: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      panel: [1],
      deleteDialog: false,
      disableDialog: false,
      PermissionsList: [
        {
          name: this.$i18n.t('PermissionsList.CreateManager'),
          value: 'CreateManager'
        },
        {
          name: this.$i18n.t('PermissionsList.UpdateManager'),
          value: 'UpdateManager'
        },
        {
          name: this.$i18n.t('PermissionsList.DisableEnableManager'),
          value: 'DisableEnableManager'
        }
      ]
    }
  },
  methods: {
    ...mapActions('Moderators', ['changeModeratorStatus', 'ubdateModerator']),
    blockUser() {
      this.changeModeratorStatus({
        UserId: this.$route.params.singleModerator_id,
        IsActive: false
      })
    },
    unblockUser() {
      this.changeModeratorStatus({
        UserId: this.$route.params.singleemploye_id,
        IsActive: true
      })
    },
    assign() {
      this.Permissions = []
      for (let i = 0; i < this.getModerator.permissions.length; i++) {
        this.Permissions.push(this.getModerator.permissions[i].name)
      }
    },
    update_Moderator() {
      this.ubdateModerator({
        UserId: this.$route.params.singleemploye_id,
        permissions: this.Permissions
      }).then(() => {
        this.fetchModerator(this.$route.params.singleemploye_id)
      })
    }
  }
}
</script>
