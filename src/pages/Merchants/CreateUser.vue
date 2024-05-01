<template>
  <div class="flex-grow-1">
    <div>
      <div class="display-1">{{ $t('Merchant.createMerchant') }}</div>
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab to="#tabs-information">{{ $t('Merchant.Merchantinfo') }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-information">
        <information-tab ref="tabs-information"></information-tab>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import InformationTab from './EditUser/InformationTab'
export default {
  components: {
    CopyLabel,
    InformationTab
  },
  data() {
    return {
      tab: null,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Merchants'),
          exact: true,
          to: '/merchents/list'
        },
        {
          text: this.$i18n.t('Merchant.createMerchant')
        }
      ]
    }
  }
}
</script>
