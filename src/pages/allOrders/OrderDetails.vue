<template>
  <div>
    <v-card v-if="order">
      <v-card-title class="black--text">
        <span class="text-h5"
          >{{ $t('common.details') }} #{{ order.number }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="my-1" no-gutters>
            <v-col sm="9" xs="12" class="pa-0 d-flex align-center">
              <h3 class="cyan--text">
                <v-icon class="mx-2">mdi-account</v-icon>
                {{ $t('users.delegateInfo') }}
              </h3>
            </v-col>
            <v-col sm="3" xs="12" class="">
              <v-row no-gutters class="justify-end">
                <v-col class="pa-0">
                  <v-dialog transition="dialog-top-transition" max-width="600">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-show="order.status == 'Pending'"
                        color="primary"
                        :loading="loading"
                        dark
                        small
                        v-bind="attrs"
                        class="ma-1"
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
                        v-show="order.status == 'Accepted'"
                        color="primary"
                        :loading="loading"
                        dark
                        small
                        class="ma-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          confirmText = $t(
                            'Orders.AreYouSureYouWantToPrepareThisOrder'
                          )
                        "
                      >
                        {{ $t('Orders.prepareOrder') }}
                      </v-btn>
                      <v-btn
                        v-show="order.status == 'Prepared'"
                        color="primary"
                        :loading="loading"
                        dark
                        small
                        class="ma-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          confirmText = $t(
                            'Orders.AreYouSureYouWantToDeliverThisOrder'
                          )
                        "
                      >
                        {{ $t('Orders.deliverOrder') }}
                      </v-btn>
                    </template>
                    <template v-slot:default="dialog">
                      <v-card>
                        <v-toolbar color="red" dark>{{
                          $t('common.confirmation')
                        }}</v-toolbar>
                        <v-card-text>
                          <h4 class="ma-1 red--text">
                            {{ confirmText }}
                          </h4>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            color="red"
                            dark
                            @click="
                              confirmAction(order)
                              dialog.value = false
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
                  <v-dialog transition="dialog-top-transition" max-width="600">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-show="order.status == 'Pending'"
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
                          order.status == 'Accepted' ||
                          order.status == 'Prepared'
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
                          <span v-if="order.status === 'Pending'">{{
                            $t('common.rejectReason')
                          }}</span>
                          <span v-else>{{ $t('common.cancelReason') }}</span>
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
                            <template v-slot:activator="{ on, attrs }">
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
                                      order.status === 'Pending'
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
                                      rejectThisOrder(order)
                                      createdialog.value = false
                                      dialog.value = false
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

                          <v-btn text @click="createdialog.value = false">{{
                            $t('common.cancel')
                          }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row v-if="getOrder.agent" class="my-2">
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('users.delegateName') }}
            </v-col>

            <v-col cols="12" xs="12" sm="9">
              <div v-if="getOrder.agent">
                {{ getOrder.agent.name }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('profile.username') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.agent.userName">
                {{ getOrder.agent.userName }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('profile.phone') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.agent.phone">
                {{ getOrder.agent.phone }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('users.address') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.agent.address">
                {{ getOrder.agent.address }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.status') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.agent">
                <div
                  v-if="getOrder.agent.isActive"
                  class="success--text text--darken-2"
                >
                  {{ $t('common.active') }}
                </div>
                <div v-else class="red--text">
                  {{ $t('common.inactive') }}
                </div>
              </div>
            </v-col>
          </v-row>
          <span v-else class="my-2"> {{ $t('Orders.noData') }} </span>
          <h3 class="cyan--text my-2">
            <v-icon class="mx-2">mdi-account</v-icon>
            {{ $t('users.customerInfo') }}
          </h3>
          <v-divider></v-divider>
          <v-row v-if="getOrder.user" class="my-2">
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('users.customerName') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user">
                {{ getOrder.user.name }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('profile.username') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.userName">
                {{ getOrder.user.userName }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('profile.email') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.email">
                {{ getOrder.user.email }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('profile.phone') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.phone">
                {{ getOrder.user.phone }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('users.address') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.address">
                {{ getOrder.user.address }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Merchant.number') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.number">
                {{ getOrder.user.number }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Merchant.companyName') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.companyName">
                {{ getOrder.user.companyName }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('dashboard.activity') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.activity">
                <div>
                  {{ getOrder.user.activity }}
                </div>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('geography.country') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.country">
                <div>
                  {{ getOrder.user.country.name }}
                </div>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('geography.region') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.region">
                <div>
                  {{ getOrder.user.region.name }}
                </div>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('geography.city') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.city">
                <div>
                  {{ getOrder.user.city.name }}
                </div>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.ProductPriceCategories') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.user.priceCategory">
                <div>
                  {{ getOrder.user.priceCategory.name }}
                </div>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
          </v-row>

          <h3 class="cyan--text my-2">
            <v-icon class="mx-2">mdi-store</v-icon>
            {{ $t('Orders.orderInfo') }}
          </h3>
          <v-divider></v-divider>
          <v-row class="my-2">
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.orderId') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.number">
                {{ getOrder.number }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.address') }}
            </v-col>

            <v-col cols="9">
              <div v-if="getOrder.shipping">
                <p class="text-14 mb-0">
                  {{
                    getOrder.shipping.street
                      ? `${$t('shipping.Street')} ${getOrder.shipping.street}`
                      : ''
                  }}
                  {{
                    getOrder.shipping.buildingNumber
                      ? `${$t('shipping.BuildingNumber')} ${
                          getOrder.shipping.buildingNumber
                        }`
                      : ''
                  }}
                  {{
                    getOrder.shipping.office
                      ? `${$t('shipping.Office')} ${getOrder.shipping.office}`
                      : ''
                  }}
                  {{
                    getOrder.shipping.floor
                      ? `${$t('shipping.Floor')} ${getOrder.shipping.floor}`
                      : ''
                  }}
                  {{
                    getOrder.shipping.apartmentNumber
                      ? `${$t('shipping.ApartmentNumber')} ${
                          getOrder.shipping.apartmentNumber
                        }`
                      : ''
                  }}
                  {{
                    getOrder.shipping.landmark
                      ? `${$t('shipping.Landmark')} ${getOrder.shipping.landmark}`
                      : ''
                  }}
                </p>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Orders.orderedAt') }}
            </v-col>
            <v-col cols="9">
              <div v-if="getOrder.orderedAt">
                <span dir="ltr">{{
                  datetimeFormater(getOrder.orderedAt)
                }}</span>
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col
              v-if="getOrder.acceptedAt"
              cols="12"
              xs="12"
              sm="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Orders.acceptedAt') }}
            </v-col>
            <v-col v-if="getOrder.acceptedAt" cols="9">
              <div v-if="getOrder.acceptedAt">
                <span dir="ltr">{{
                  datetimeFormater(getOrder.acceptedAt)
                }}</span>
              </div>
            </v-col>
            <v-col
              v-if="getOrder.preparedAt"
              cols="12"
              xs="12"
              sm="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Orders.preparedAt') }}
            </v-col>
            <v-col v-if="getOrder.preparedAt" cols="9">
              <div v-if="getOrder.preparedAt">
                <span dir="ltr">{{
                  datetimeFormater(getOrder.preparedAt)
                }}</span>
              </div>
            </v-col>
            <v-col
              v-if="getOrder.deliveredAt"
              cols="12"
              xs="12"
              sm="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Orders.deliveredAt') }}
            </v-col>
            <v-col v-if="getOrder.deliveredAt" cols="9">
              <div>
                <span dir="ltr">
                  {{
                    getOrder.deliveredAt
                      ? datetimeFormater(getOrder.deliveredAt)
                      : $t('common.doesnotExist')
                  }}
                </span>
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.status') }}
            </v-col>
            <v-col cols="9">
              <div>
                <div v-if="getOrder.user">
                  <span
                    v-if="order.status === 'Pending'"
                    class="m-0 deep-orange--text text--darken-4"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                  <span
                    v-if="order.status === 'Accepted'"
                    class="m-0 success--text text--darken-2"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                  <span
                    v-if="order.status === 'Prepared'"
                    class="m-0 success--text text--darken-2"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                  <span
                    v-if="order.status === 'Delivered'"
                    class="m-0 success--text text--darken-2"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                  <span
                    v-if="order.status === 'Rejected'"
                    class="m-0 red--text"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                  <span
                    v-if="order.status === 'Canceled'"
                    class="m-0 red--text"
                  >
                    {{ $t(`common.${order.status}`) }}</span
                  >
                </div>
              </div>
            </v-col>
            <v-col
              v-if="getOrder.status === 'Rejected'"
              cols="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.rejectCancel') }}
            </v-col>
            <v-col
              v-else-if="getOrder.status === 'Canceled'"
              cols="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('common.rejectReason') }}
            </v-col>
            <v-col
              v-if="
                getOrder.status === 'Rejected' || getOrder.status === 'Canceled'
              "
              cols="9"
            >
              <div>
                {{ getOrder.reason }}
              </div>
            </v-col>

            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.tax') }}
            </v-col>
            <v-col cols="9">
              <div v-if="getOrder.invoice">
                {{ getOrder.invoice.vat ? getOrder.invoice.vat.toFixed(2) : 0 }}
                {{ $t('common.sar') }}
              </div>
            </v-col>

            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.priceBeforeTax') }}
            </v-col>
            <v-col cols="9">
              <div v-if="getOrder.invoice">
                {{
                  getOrder.invoice.totalPriceNoTax
                    ? getOrder.invoice.totalPriceNoTax.toFixed(2)
                    : 0
                }}
                {{ $t('common.sar') }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.totalPrice') }}
            </v-col>
            <v-col cols="9">
              <div v-if="getOrder.invoice">
                {{
                  getOrder.invoice.totalPrice
                    ? getOrder.invoice.totalPrice.toFixed(2)
                    : 0
                }}
                {{ $t('common.sar') }}
              </div>
              <div v-else>
                {{ $t('common.doesnotExist') }}
              </div>
            </v-col>

            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.customDiscount') }}
            </v-col>
            <v-col cols="9">
              <div>
                <div v-if="getOrder.invoice">
                  <span>
                    {{
                      getOrder.invoice.customDiscount
                        ? getOrder.invoice.customDiscount.toFixed(2)
                        : 0
                    }}
                    {{ $t('common.sar') }}</span
                  >
                </div>
                <div v-else>
                  {{ $t('common.doesnotExist') }}
                </div>
              </div>
            </v-col>
            <v-col v-if="getOrder.invoice" cols="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.customPrice') }}
            </v-col>
            <v-col v-if="getOrder.invoice" cols="9">
              <div>
                <div>
                  <span class="success--text">
                    {{ getOrder.invoice.customPrice.toFixed(2) }}
                    {{ $t('common.sar') }}</span
                  >
                </div>
              </div>
            </v-col>
            <v-col
              v-if="getOrder.customDiscountDetails"
              cols="3"
              class="cyan--text"
            >
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Product.CustomDiscountDetails') }}
            </v-col>
            <v-col cols="9">
              <div>
                <div>
                  <span>
                    {{ getOrder.customDiscountDetails }}
                  </span>
                </div>
              </div>
            </v-col>
            <v-col col="12">
              <v-col v-if="getOrder.rejectReason" cols="3" class="cyan--text">
                <v-icon small>mdi-circle-medium</v-icon>
                {{ $t('common.rejcetReason') }}
              </v-col>
              <v-col v-if="getOrder.rejectReason" cols="9">
                <div>
                  <div v-if="getOrder.user">
                    <span> {{ getOrder.rejectReason }}</span>
                  </div>
                </div>
              </v-col>
            </v-col>
            <v-col cols="12" xs="12" sm="3" class="cyan--text">
              <v-icon small>mdi-circle-medium</v-icon>
              {{ $t('Orders.tableOfProducts') }}
            </v-col>

            <v-col cols="12">
              <v-data-table
                dense
                :loading="isLoading"
                :headers="headers2"
                :items="getOrder.orderItems"
                item-key="id"
                hide-default-footer
                disable-filtering
                disable-pagination
                disable-sort
                class="elevation-1"
              >
                <template v-slot:[`item.name`]="{ item }">
                  {{ item.product.name }}
                </template>
                <template v-slot:[`item.imageUrl`]="{ item }">
                  <img
                    v-if="item.product.imageUrl"
                    :src="item.product.imageUrl"
                    width="77"
                    height="77"
                    class="elevation-1"
                    alt="User"
                    style="border-radius: 5px"
                  />
                  <template v-else>
                    {{ $t('Orders.noPhoto') }}
                  </template>
                </template>
                <template v-slot:[`item.category`]="{ item }">
                  <template v-if="item.product.category">
                    {{ item.product.category.name }}
                  </template>
                  <template v-else>
                    {{ $t('Orders.unknown') }}
                  </template>
                </template>
                <template v-slot:[`item.quantity`]="{ item }">
                  <template v-if="item.productQuantityInWarehouse">
                    {{ item.productQuantityInWarehouse }}
                  </template>
                  <template v-else>
                    {{ $t('Orders.unknown') }}
                  </template>
                </template>
                <template v-slot:[`item.manufacturer`]="{ item }">
                  <template v-if="item.product.manufacturer">
                    {{ item.product.manufacturer.name }}
                  </template>
                  <template v-else>
                    {{ $t('Orders.unknown') }}
                  </template>
                </template>

            <!--     <template v-slot:[`item.productQuantities`]="{ item }">
                  <template v-if="item.productQuantity">
                    <template
                      v-if="
                        item.productQuantity.productAttributeValues.length !== 0
                      "
                    >
                      <v-list-item-content
                        v-for="(attribute, i) in item.productQuantity
                          .productAttributeValues"
                        :key="i"
                      >
                        <strong>{{ attribute.productAttribute.name }}:</strong>
                        {{ attribute.name }}
                      </v-list-item-content>
                    </template>
                  </template>
                  <template v-else>
                    <template>
                      <v-list-item-content>
                        {{ $t('Orders.noProperties') }}</v-list-item-content
                      >
                    </template>
                  </template>
                </template> -->
                <template v-slot:[`item.price`]="{ item }">
                  <div>
                    {{ item.unitPrice }} × {{ item.quantity }}<br />
                    {{ item.unitPrice * item.quantity }}
                    {{ $t('common.sar') }}
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <div v-if="getOrder.invoice">
          <v-col v-if="getOrder.invoice.bankPaymentInfo" col="12">
            <!-- payment info -->
            <h3 class="cyan--text my-2">
              <v-icon class="mx-2">mdi-cash</v-icon>
              {{ $t('Invoices.BankTransfer') }}
            </h3>
          </v-col>
          <v-divider v-if="getOrder.invoice.bankPaymentInfo"></v-divider>
          <v-col col="12" v-if="getOrder.invoice.bankPaymentInfo">
            <v-list lines="one">
              <v-list-item>
              <v-list-item-title>
                {{$t('Invoices.bankName')}}
                </v-list-item-title>
              <v-list-item-subtitle>
                {{getOrder.invoice.bankPaymentInfo.bankName}}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
            <v-list-item-title>
                {{$t('Invoices.transferAmount')}}
                </v-list-item-title>
              <v-list-item-subtitle>
                {{getOrder.invoice.bankPaymentInfo.transferAmount}}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
            <v-list-item-title>
                {{$t('Invoices.transferNumber')}}
                </v-list-item-title>
              <v-list-item-subtitle>
                {{getOrder.invoice.bankPaymentInfo.transferNumber}}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
            <v-list-item-title>
                {{$t('common.Attachments')}}
                </v-list-item-title>
              <v-list-item-subtitle v-if="getOrder.invoice.bankPaymentInfo.attachment">
                <v-btn rounded color="primary" :href="getOrder.invoice.bankPaymentInfo.attachment" target="_blank">{{$t('common.download')}}</v-btn>
                </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                {{$t('common.notSet')}}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </div>
        <div v-if="getOrder.invoice">
          <v-col col="12">
            <!-- payment info -->
            <h3 class="cyan--text my-2">
              <v-icon class="mx-2">mdi-cash</v-icon>
              {{ $t('Invoices.payments') }}
            </h3>
          </v-col>
          <v-divider></v-divider>
          <v-col col="12">
            <payments :payments="getOrder.invoice.payments"></payments>
          </v-col>
        </div>
      </v-card-text>
      <hr class="header-divider primary" />
    </v-card>
  </div>
</template>
<script>
// import CopyLabel from '../../components/common/CopyLabel'
// import loading from '../../components/common/loading'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import payments from '../../components/orders/Payments'
export default {
  components: {
    // CopyLabel,
    // loading,
    payments
  },

  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      confirmText: '',
      dialog: false,
      createdialog: false,
      isLoading: false,
      loading: false,
      confirmDialog: false,
      rejectConfirmationDialog: false,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.sales'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.orders')
        }
      ],
      rejectReason: '',
      headers2: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('Product.productImage'),
          value: 'imageUrl'
        },
        {
          text: this.$i18n.t('Product.category'),
          value: 'category'
        },
        {
          text: this.$i18n.t('Orders.orderQuantity'),
          value: 'quantity'
        },
        {
          text: this.$i18n.t('Product.manufacturer'),
          value: 'manufacturer'
        },
     /*    {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
          value: 'productQuantities'
        }, */
        {
          text: this.$i18n.t('Product.price'),
          value: 'price'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AllOrders', ['getOrdersList', 'getLastPage', 'getOrder']),
    ...mapGetters('Delegates', ['getDelegateList']),
    ...mapGetters('Merchant', ['getMerchantList']),
    order() {
      return this.getOrder
    }
  },
  watch: {
    order: {
      handler(val) {
        return val
      },
      deep: true,
      immediate: true
    },
    orderId: function (val) {
      this.fetchOrder(val)
    },

    dialog: function (val) {
      if (!val) return

      setTimeout(() => (this.dialog = false), 2000)
    },
    createdialog: function (val) {
      if (!val) return

      setTimeout(() => (this.createdialog = false), 2000)
    }
  },
  mounted() {
    this.fetchOrder(this.orderId)
    this.fetchDelegates()
    this.fetchMerchants()
  },
  methods: {
    ...mapActions('Delegates', ['fetchDelegates']),
    ...mapActions('Merchant', ['fetchMerchants']),
    ...mapActions('AllOrders', [
      'fetchOrders',
      'fetchOrder',
      'acceptOrder',
      'prepareOrder',
      'deliverOrder',
      'rejectOrder',
      'cancelOrder'
    ]),
    acceptThisOrder(item) {
      this.loading = true
      item.status = 'Accepted'
      this.acceptOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    prepareThisOrder(item) {
      this.loading = true
      item.status = 'Prepared'
      this.prepareOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    deliverThisOrder(item) {
      this.loading = true
      item.status = 'Delivered'
      this.deliverOrder(item.id).finally(() => {
        this.loading = false
      })
    },
    confirmAction(item) {
      if (item.status === 'Pending') {
        this.acceptThisOrder(item)
      } else if (item.status === 'Accepted') {
        this.prepareThisOrder(item)
      } else {
        this.deliverThisOrder(item)
      }
    },
    rejectThisOrder() {
      const item = this.order

      console.log(item)

      this.loading = true

      const obj = {
        id: item.id,
        reason: this.rejectReason
      }

      if (item.status === 'Pending') {
        this.rejectOrder(obj).finally(() => {
          this.loading = false
        })
      } else {
        this.cancelOrder(obj).finally(() => {
          this.loading = false
        })
      }
      setTimeout(() => (this.dialog = false), 4000)
    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    }
  }
}
</script>

<style>
.visitPhotos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.filterBox {
  background-color: #fff;
  padding: 5px;
}
</style>
