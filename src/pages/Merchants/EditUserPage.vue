<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">
          {{ $t('Merchant.Merchantinfo') }}
          {{ getMerchant.name && `- ${getMerchant.name}` }}
        </div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-row class="my-1">
      <v-col cols="9">
        <v-tabs
          v-model="tab"
          :show-arrows="false"
          background-color="transparent"
        >
          <v-tab to="#tabs-account"> {{ getMerchant.name }}</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-btn
            :to="{
              name: 'merchents-bills',
              params: { bill_id: getMerchant.userId }
            }"
            color="primary"
            dark
          >
            {{ $t('Bills.bills') }}
          </v-btn>
        </div></v-col
      >
    </v-row>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-account">
        <account-tab ref="tabs-account" :realUser="getMerchant"></account-tab>
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
          text: this.$i18n.t('menu.Merchants'),
          to: '/merchents/list',
          exact: true
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getMerchant'])
  },

  methods: {
    ...mapActions('Merchant', ['fetchMerchant'])
  },
  mounted() {
    this.fetchMerchant(this.$route.params.singlemerchent_id)
    console.log(this.getMerchant)
  }
}
</script>
