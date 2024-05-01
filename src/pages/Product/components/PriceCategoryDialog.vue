<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('Merchant.attachPriceCategory') }}
        </v-card-title>

        <v-card-text v-if="data != null">
            <v-data-table
              :headers="headers"
              :items="data"
              loading-text="جاري تحميل البيانات"
              no-data-text="لا يوجد بيانات"
              hide-default-footer
              disable-filtering
              disable-pagination
              disable-sort
              class="elevation-1"
            >
              <template v-slot:[`item.price`]="{ item }">
                <v-text-field
                  class="my-2"
                  v-model="item.price"
                  outlined
                  type="number"
                ></v-text-field>
              </template>
              <template v-slot:[`item.add`]="{ item }">
                <v-btn
                  color="primary"
                  dark
                  small
                  :disabled="!item.price"
                  @click="$emit('updatePriceCategory', item)"
                >
                  {{ $t('common.add') }}
                </v-btn>
              </template>
            </v-data-table>
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
  name: 'PriceCategoryDialog',
  props: ['dialog', 'data', 'headers'],
  data() {
    return {
        item:{}
    }
  }
}
</script>