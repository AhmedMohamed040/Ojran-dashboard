<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
        <div class="display-1">
          {{ getDelegate.name && `- ${getDelegate.name}` }}
        </div>
      </div>
    </div>

    <div class="d-flex align-center font-weight-bold primary--text my-2">
      <v-icon small color="primary">mdi-security</v-icon>
      <span class="ma-1">{{ getDelegate.userName }}</span>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab to="#tabs-account">Account</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-account">
        <account-tab
          ref="tabs-account"
          :real-user="getDelegate"
        ></account-tab>
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
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.agents'),
          to: '/delegates/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Delegates', ['getDelegate'])
  },

  methods: {
    ...mapActions('Delegates', ['fetchDelegate'])
  },
  mounted() {
    this.fetchDelegate(this.$route.params.delegate_id)
  }
}
</script>
