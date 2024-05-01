<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('Merchant.Merchantinfo') }}
        </v-card-title>

        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-phone
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ data.companyName }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('Merchant.companyName') }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-phone
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ data.activity }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('Merchant.activity') }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="data.priceCategory">
              <v-list-item-icon>
                <v-icon color="indigo">
                  mdi-phone
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>(650) 555-1234</v-list-item-title>
                <v-list-item-subtitle>{{ $t('Merchant.priceCategory') }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('close')">
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'MerchantDetailDialog',
  props: ['dialog', 'data'],
  data() {
    return {
    }
  }
}
</script>
