<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        {{ $t('sales.orderDetails') }}
        <div>

          <v-row no-gutters class="justify-end" >
            <div>

              <v-col class="pa-0">
                <v-dialog
                  transition="dialog-top-transition"
                  max-width="600"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-show="getOrder.status == 'PENDING'"
                      color="primary"
                      :loading="loading"
                      dark
                      small
                      v-bind="attrs"
                      class="mx-1"
                      v-on="on"
                      @click="
                        confirmText = $t(
                          'Orders.AreYouSureYouWantToAcceptThisOrder'
                        )
                      "
                    >
                      {{ $t('Orders.acceptOrder') }}
                    </v-btn>
                    <v-btn
                      v-show="getOrder.status == 'ACCEPTED'"
                      color="primary"
                      :loading="loading"
                      dark
                      small
                      class="mx-1"
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        confirmText = $t(
                          'Orders.AreYouSueSureYouWantToMarkThisAsReturned'
                        )
                      "
                    >
                      {{ $t('orders.returned') }}
                    </v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card v-if="getOrder.status == 'PENDING'">
                      <v-toolbar color="red" dark>{{
                        $t('common.confirmation')
                      }}</v-toolbar>

                      <v-card-text>
                        <h4 class="my-3 red--text">
                          {{ confirmText }}
                        </h4>
                        <p class="text-14 mb-1">
                          {{ $t('Product.warehouse') }}
                        </p>
                        <v-autocomplete

                          v-model="warehouse"
                          clearable
                          :label="$t('Product.warehouse')"
                          :items="
                            getWarehouses.map(({ name, id }) => ({
                              text: name,
                              value: id,
                            }))
                          "
                          outlined
                          dense
                          style="margin: 18px 0 0 0"
                          class="mb-4"
                          hide-details="auto"
                          @click="fetchWarehouses()"
                        ></v-autocomplete>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          color="red"
                          dark
                          @click="
                            confirmAction(OrderDetails),
                            (dialog.value = false)
                          "
                        >
                          {{ $t('common.confirmation') }}
                        </v-btn>
                        <v-btn text @click="dialog.value = false">{{
                          $t('common.cancel')
                        }}</v-btn>
                      </v-card-actions>
                    </v-card>
                    <v-card v-else>
                      <v-toolbar color="red" dark>{{
                        $t('common.confirmation')
                      }}</v-toolbar>
                      <v-card-text>
                        <h4 class="my-3 red--text">
                          {{ confirmText }}
                        </h4>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          color="red"
                          dark
                          @click="
                            confirmAction(OrderDetails),
                            (dialog.value = false)
                          "
                        >
                          {{ $t('common.confirmation') }}
                        </v-btn>
                        <v-btn text @click="dialog.value = false">{{
                          $t('common.cancel')
                        }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
              <v-col class="pa-0">
                <v-dialog
                  transition="dialog-top-transition"
                  max-width="600"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-show="getOrder.status == 'PENDING'"
                      color="error"
                      dark
                      small
                      v-bind="attrs"
                      class="mr-1 mt-1"
                      v-on="on"
                    >
                      {{ $t('Orders.rejectOrder') }}
                    </v-btn>
                    <v-btn
                      v-show="
                        getOrder.status == 'ACCEPTED'
                      "
                      my-2
                      color="error"
                      dark
                      small
                      v-bind="attrs"
                      class="mr-1 mt-1"
                      v-on="on"
                    >
                      {{ $t('Orders.cancelOrder') }}
                    </v-btn>
                  </template>
                  <template v-slot:default="createdialog">
                    <v-card>
                      <v-toolbar color="red" dark>
                        <span v-if="getOrder.status === 'PENDING'">{{
                          $t('common.rejectReason')
                        }}</span>
                        <span v-else>{{
                          $t('common.cancelReason')
                        }}</span>
                      </v-toolbar>
                      <v-card-text>
                        <v-row class="my-2">
                          <v-col cols="12">
                            {{ $t('common.enterReason') }}
                          </v-col>
                          <v-col cols="12" md="6" offset-md="4">
                            <v-text-field
                              v-model="rejectReason"
                              clearable
                              outlined
                              :label="$t('common.reason')"
                              style="margin: 18px 0 0 0"
                              class="my-2"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-dialog
                          transition="dialog-top-transition"
                          max-width="600"
                        >
                          <template
                            v-slot:activator="{ on, attrs }"
                          >
                            <v-btn
                              color="error"
                              class="mx-2"
                              :loading="loading"
                              v-bind="attrs"
                              :disabled="rejectReason === ''"
                              v-on="on"
                            >
                              {{ $t('common.done') }}
                            </v-btn>
                          </template>
                          <template v-slot:default="dialog">
                            <v-card>
                              <v-toolbar color="red" dark>{{
                                $t('common.confirmation')
                              }}</v-toolbar>
                              <v-card-text>
                                <h4 class="my-3 red--text">
                                  {{
                                    getOrder.status === 'PENDING'
                                      ? $t(
                                        'Orders.AreYouSureYouWantToRejectThisOrder'
                                      )
                                      : $t(
                                        'Orders.AreYouSureYouWantToCancelThisOrder'
                                      )
                                  }}
                                </h4>
                              </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn
                                  color="red"
                                  dark
                                  @click="
                                    rejectThisOrder(OrderDetails);
                                    createdialog.value = false; dialog.value = false
                                  "
                                >
                                  {{ $t('common.confirmation') }}
                                </v-btn>
                                <v-btn
                                  text
                                  @click="dialog.value = false"
                                >{{ $t('common.cancel') }}</v-btn>
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>

                        <v-btn
                          text
                          @click="createdialog.value = false"
                        >{{ $t('common.cancel') }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
            </div>
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row class="my-2">

          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.orderNumber') }}
          </v-col>
          <v-col cols="9">
            <div >

              {{ getOrder.orderNumber }}
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('SKU') }}
          </v-col>
          <v-col cols="9">
            <div >

              {{ getOrder.orderItem ? getOrder.orderItem.product.code : '--'}}
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.status') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="getOrder.status == 'PENDING'" class="m-0 Pending--text">
                {{ $t(`common.${getOrder.status}`) }}
              </span>
              <span v-if="getOrder.status == 'ACCEPTED'" class="m-0 Accepted--text">
                {{ $t(`common.${getOrder.status}`) }}
              </span>
              <span v-if="getOrder.status == 'RETURNED'" class="m-0 Prepared--text">
                {{ $t(`common.${getOrder.status}`) }}
              </span>
              <span v-if="getOrder.status == 'REJECTED'" class="m-0 Rejected--text">
                {{ $t(`common.${getOrder.status}`) }}
              </span>
              <span v-if="getOrder.status == 'CANCELED'" class="m-0 Canceled--text">
                {{ $t(`common.${getOrder.status}`) }}
              </span>

            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.warehouse') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="getOrder.warehouse" class="m-0">
                {{ getOrder.warehouse.name }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.reason') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="getOrder.reason" class="m-0">
                {{ getOrder.reason }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.quantity') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="getOrder.quantity" class="m-0">
                {{ $t(getOrder.quantity) }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.date') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="getOrder.createdAt" class="m-0">
                {{ datetimeFormater(getOrder.createdAt) }}

              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-expansion-panels multiple class="mt-3">
      <v-expansion-panel>
        <v-expansion-panel-header class="title">{{
          $t('sales.moreDetails')
        }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0">
            <v-card-text>
              <v-row>
                <v-col cols="10">
                  <v-row class="my-2">
                    <v-col cols="4" class="cyan--text">
                      <v-icon small>mdi-circle-medium</v-icon>
                      {{ $t('orders.orderItem') }}
                    </v-col>
                    <v-col cols="8">
                      <div v-if="getOrder.orderItem">

                        <span v-if="getOrder.orderItem.product" class="m-0">
                          {{ getOrder.orderItem.product.name }}
                        </span>
                        <span v-else >{{ $t('common.doesnotExist') }}</span>
                      </div>

                    </v-col>
                    <v-col cols="4" class="cyan--text">
                      <v-icon small>mdi-circle-medium</v-icon>
                      {{ $t('orders.quantity') }}
                    </v-col>
                    <v-col cols="8">
                      <div >

                        <span v-if="getOrder.orderItem" class="m-0">
                          {{ getOrder.orderItem.quantity }}
                        </span>
                        <span v-else >{{ $t('common.doesnotExist') }}</span>
                      </div>

                    </v-col>
               <!--      <v-col cols="4" class="cyan--text">
                      <v-icon small>mdi-circle-medium</v-icon>
                      {{ $t('orders.category') }}
                    </v-col>
                    <v-col cols="8">
                      <div v-if="getOrder.orderItem">

                        <span v-if="String(getOrder.orderItem.product.category) != 'null'" class="m-0">
                          {{ getOrder.orderItem.product.category }}
                        </span>
                        <span v-else >{{ $t('common.doesnotExist') }}</span>
                      </div>

                    </v-col> -->
                    <v-col cols="4" class="cyan--text">
                      <v-icon small>mdi-circle-medium</v-icon>
                      {{ $t('orders.price') }}
                    </v-col>
                    <v-col cols="8">
                      <div >

                        <span v-if="getOrder.orderItem.unitPrice" class="m-0">
                          {{ getOrder.orderItem.unitPrice }}
                        </span>
                        <span v-else >{{ $t('common.doesnotExist') }}</span>
                      </div>

                    </v-col>

                  </v-row>

                </v-col>

              </v-row>
            </v-card-text>
          </v-card>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import moment from 'moment'

import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      confirmDialog: false,
      confirmText: '',
      rejectReason: '',

      warehouse: null
    }
  },

  computed: {
    ...mapGetters('Sales', ['getOrder', 'getWarehouses']),
    OrderDetails() {
      return this.getOrder
    }
  },
  mounted () {
    this.fetchOrder(this.orderId)
  },
  methods: {
    ...mapActions('Sales', ['fetchOrder', 'rejectOrder', 'cancelOrder', 'markAsReturned', 'acceptOrder' , 'fetchWarehouses']),
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    acceptThisOrder(item) {
      this.loading = true
      const data = {
        id: item.id,
        warehouse: this.warehouse
      }

      item.status = 'ACCEPTED'
      this.acceptOrder(data).finally(() => {
        this.loading = false
      })
    },
    markAsRetunedOrder(item) {
      this.loading = true
      item.status = 'RETURNED'
      this.markAsReturned(item.id).finally(() => {
        this.loading = false
      })
    },

    confirmAction(item) {
      if (item.status === 'PENDING') {
        this.acceptThisOrder(item)
      } else if (item.status === 'ACCEPTED') {
        this.markAsRetunedOrder(item)
      }
    },
    rejectThisOrder(item) {
      this.loading = true
      const obj = {
        id: item.id,
        reason: this.rejectReason
      }

      if (item.status === 'PENDING') {
        item.status = 'REJECTED'
        this.rejectOrder(obj).finally(() => {
          this.loading = false
        })
      } else {
        item.status = 'CANCELED'
        this.cancelOrder(obj).finally(() => {
          this.loading = false
        })
      }
    }
  }

}
</script>

<style>

</style>
