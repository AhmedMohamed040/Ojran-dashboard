<template>
  <div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div class="flex-grow-1" v-else>
      <div class="d-flex align-center py-3">
        <div>
          <div class="display-1">{{ ` ${getUser.name}` }}</div>
        </div>
      </div>

      <div
        v-if="getUser.role == 'Admin'"
        class="d-flex align-center font-weight-bold primary--text my-2"
      >
        <v-icon small color="primary">mdi-security</v-icon>
        <span class="ma-1">{{ getUser.role }}</span>
      </div>

      <div class="mb-4">
        <div class="d-flex">
          <span class="font-weight-bold">{{ $t('profile.email') }}</span>
          <span class="mx-1">
            <copy-label :text="getUser.email" />
          </span>
        </div>
        <div class="d-flex">
          <span class="font-weight-bold">{{ $t('profile.username') }}</span>
          <span class="mx-1">
            <copy-label :text="getUser.userName + ''" />
          </span>
        </div>
      </div>

      <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
        <v-tab to="#tabs-account">{{ $t('menu.profile') }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tabs-account">
          <account-tab
            ref="tabs-account"
            :user="getUser"
            :avatar="avatar"
          ></account-tab>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import loading from '../../components/common/loading'
import AccountTab from './EditUser/AccountTab'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading,
    AccountTab
  },
  data() {
    return {
      loading: true,
      avatar: '/images/avatars/avatar1.svg',
      tab: null
    }
  },
  computed: {
    ...mapGetters('Info', ['getUser'])
  },

  methods: {
    ...mapActions('Info', ['fetchUser'])
  },
  mounted() {
    this.fetchUser().then(() => {
      this.loading = false
    })
  }
}
</script>
<style>
</style>
