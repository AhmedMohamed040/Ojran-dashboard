<template>
  <div class="flex-grow-1">
    <div v-if="getModerator.user">
      <div class="d-flex align-center py-3">
        <div>
          <div class="display-1">
            {{ $t('profile.editUser') }}
            {{ getModerator.user.name && `- ${getModerator.user.name}` }}
          </div>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
        </div>
      </div>

      <div class="d-flex align-center font-weight-bold primary--text my-2">
        <v-icon small color="primary">mdi-security</v-icon>
        <span class="ma-1">{{ getModerator.role }}</span>
      </div>

      <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
        <v-tab to="#tabs-account">{{ $t('profile.account') }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tabs-account">
          <account-tab
            ref="tabs-account"
            :user="user"
            :real-user="getModerator"
          ></account-tab>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import AccountTab from './EditUser/AccountTab'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    AccountTab
  },
  data() {
    return {
      user: {
        id: 32,
        email: 'bfitchew0@ezinearticles.com',
        name: 'Bartel Fitchew',
        verified: false,
        created: '2019-08-09T03:14:12Z',
        lastSignIn: '2019-08-14T20:00:53Z',
        disabled: true,
        role: 'ADMIN',
        avatar: '/images/avatars/avatar1.svg'
      },
      tab: null,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.employees'),
          to: '/employees/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersEdit')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Moderators', ['getModerator'])
  },

  methods: {
    ...mapActions('Moderators', ['fetchModerator'])
  },
  mounted() {
    this.fetchModerator(this.$route.params.singleemploye_id)
  }
}
</script>
