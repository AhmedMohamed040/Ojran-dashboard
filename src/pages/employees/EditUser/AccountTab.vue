<template>
  <div class="my-2">
    <div>
      <v-card>
        <v-card-title>{{ $t('profile.BasicInformation') }}</v-card-title>
        <v-card-text>
          <v-row class="ma-0">
            <v-col cols="12" md="3" class="pa-2">
              <v-img
                :src="
                  realUser.user.imageUrl ? realUser.user.imageUrl : user.avatar
                "
                aspect-ratio="1"
                class="blue-grey lighten-4 rounded elevation-3 more"
                max-width="150"
                max-height="150"
              ></v-img>
              <span>{{ $t('profile.avatar') }}</span>
            </v-col>
            <v-col cols="12" md="8">
              <v-row class="profile">
                <v-col cols="3" >
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
                    v-if="realUser.permissions.length > 0"
                    class="moderators"
                  >
                    <v-chip
                      v-for="permission in realUser.permissions"
                      :key="permission.name"
                      class="ma-2"
                      color="primary"
                    >
                      {{ $t('PermissionsList' + permission.name.slice(permission.name.indexOf('.'))) + ' ' + $t( 'Permissions.' + permission.name.slice(0, permission.name.indexOf('.'))) }}
                    </v-chip></span>
                  <span v-else class="moderators">----</span>
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

            <v-divider></v-divider>
            <v-row class="ma-0">
              <v-col cols="3">
                <v-card-title class="font-weight-medium">{{ $t('users.Permissions') }}</v-card-title>
              </v-col>
              <v-col cols="12" >
                <permission-list
                  :selectedPermissions="selectedPermissions"
                  @addPermissions="addPermissions($event)"
                ></permission-list>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="update_Moderator()"
                >
                  {{ $t('common.save') }}
                </v-btn>
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
import PermissionList from '../../../components/dashboard/PermissionList'
import swal from 'sweetalert'
import i18n from '../../../plugins/vue-i18n'
import { mapActions } from 'vuex'
export default {
  components: {
    PermissionList
  },
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
      per: [],
      deleteDialog: false,
      disableDialog: false,
      selectedPermissions: []
    }
  },
  mounted() {
    this.selectedPermissions = this.realUser.permissions.map((item) => item.name)
    console.log(this.selectedPermissions)
  },
  methods: {
    ...mapActions('Moderators', ['changeModeratorStatus', 'ubdateModerator', 'fetchModerator']),
    blockUser() {
      this.changeModeratorStatus({
        UserId: this.$route.params.singleemploye_id,
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
    addPermissions(permissions) {
      this.selectedPermissions = permissions

      console.log(this.permissions)
    },
    update_Moderator() {
      this.ubdateModerator({
        UserId: this.$route.params.singleemploye_id || this.realUser.user.id,
        permissions: this.selectedPermissions
      }).then(() => {
        this.fetchModerator(this.$route.params.singleemploye_id)
        swal(i18n.t('common.edited'), '', 'success')
      })
    },
    EditPermisssions(perm) {
      this.selectedPermissions = perm
    }
  }
}
</script>
