<template>
  <v-data-table
    dense
    :loading="isLoading"
    :headers="headers"
    :items="payments"
    item-key="sid"
    hide-default-footer
    disable-filtering
    disable-pagination
    disable-sort
    class="elevation-1"
  >
  <template v-slot:[`item.sid`]="{ item }">
      {{ item.sid == null ? '-': item.sid }}
    </template>
  <template v-slot:[`item.amount`]="{ item }">
      <span
        v-if="Math.sign(item.amount) == -1"
        class="m-0 red--text"
      >
        {{  Math.abs(item.amount).toFixed(2) }}
      </span>
      <span
        v-if="Math.sign(item.amount) == 1"
        class="m-0 success--text text--darken-2"
      >
        {{ Math.abs(item.amount).toFixed(2) }}
      </span>
      <span
        v-if="Math.sign(item.amount) == 0"
        class="m-0 deep-orange--text text--darken-4"
      >
        {{ Math.abs(item.amount).toFixed(2) }}
      </span>
    </template>
    <template v-slot:[`item.paymentType`]="{ item }">
      {{ item.paymentType ?  item.paymentType.name : '--'}}
    </template>
    <template v-slot:[`item.paymentMethod`]="{ item }">
      {{ item.paymentMethod.name }}
    </template>
    <template v-slot:[`item.bankName`]="{ item }">
      {{ item.bankPaymentInfo?item.bankPaymentInfo.bankName: `-` }}
    </template>
    <template v-slot:[`item.transferAmount`]="{ item }">
      {{ item.bankPaymentInfo?item.bankPaymentInfo.transferAmount : `-` }}
    </template>
    <template v-slot:[`item.transferNumber`]="{ item }">
      {{ item.bankPaymentInfo?item.bankPaymentInfo.transferNumber: `-` }}
    </template>
    <template v-slot:[`item.attachment`]="{ item }">
          <v-btn v-if="item.attachment" :href="item.attachment" target="_blank" elevation="0" >{{$t('common.download')}}</v-btn>
          <div v-else class="text-center"> - </div>
        </template>

  </v-data-table>
</template>
<script>
// Math.abs() Math.sign()
export default {
  name: 'Payments',
  props: {
    payments: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isLoading: false,
      headers: [
        { text: this.$t('Invoices.id'), value: 'sid' },
        { text: this.$t('orders.price'), value: 'amount' },
        { text: this.$t('Invoices.typeOfMovement'), value: 'paymentType' },

        { text: this.$t('Invoices.paymentMethod'), value: 'paymentMethod' },
        { text: this.$t('Invoices.bankName'), value:'bankName' },
        { text: this.$t('Invoices.transferAmount'), value: 'transferAmount' },
        { text: this.$t('Invoices.transferNumber'), value: 'transferNumber' },
        { text: this.$t('common.Attachments'), value: 'attachment' }
      ]
    }
  }
}
</script>
