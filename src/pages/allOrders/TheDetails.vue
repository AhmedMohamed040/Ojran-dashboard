<template>
  <div>
    <v-dialog max-width="1200" transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="my-2"
          v-bind="attrs"
          @click="fetchOrder(item.id)"
          v-on="on"
        >
          {{ $t('common.details') }}
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-card-title class="primary white--text">
            <span class="text-h5">{{ $t('common.details') }}</span>
            <v-spacer></v-spacer>
            <v-btn dark text @click="dialog.value = false">
              <v-icon>close</v-icon>
            </v-btn>
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
                  <v-row no-gutters class="justify-end" style="gap: 1rem">
                    <v-col class="pa-0">
                      <v-dialog
                        transition="dialog-top-transition"
                        max-width="600"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-if="item.status === 'Pending'"
                            color="primary"
                            :loading="loading"
                            dark
                            small
                            v-bind="attrs"
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
                            v-else-if="item.status === 'Accepted'"
                            color="primary"
                            :loading="loading"
                            dark
                            small
                            class="ml-1"
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
                            v-else-if="item.status === 'Prepared'"
                            color="primary"
                            :loading="loading"
                            dark
                            small
                            class="ml-1"
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
                              <h4 class="my-3 red--text">
                                {{ confirmText }}
                              </h4>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                              <v-btn
                                color="red"
                                dark
                                @click="
                                  confirmAction(item),
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
                            v-if="item.status === 'Pending'"
                            color="error"
                            dark
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ $t('Orders.rejectOrder') }}
                          </v-btn>
                          <v-btn
                            v-else-if="
                              item.status === 'Accepted' ||
                                item.status === 'Prepared'
                            "
                            color="error"
                            dark
                            small
                            v-bind="attrs"
                            class="mr-1"
                            v-on="on"
                          >
                            {{ $t('Orders.cancelOrder') }}
                          </v-btn>
                        </template>
                        <template v-slot:default="createdialog">
                          <v-card>
                            <v-toolbar color="red" dark>
                              <span v-if="item.status === 'Pending'">{{
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
                                          item.status === 'Pending'
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
                                          rejectThisOrder(item),
                                          (dialog.value = false)
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
                  {{ $t('Orders.orderedAt') }}
                </v-col>
                <v-col cols="9">
                  <div v-if="getOrder.orderedAt">
                    <span dir="ltr">{{ datetimeFormater(getOrder.orderedAt) }}</span>
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
                    <span dir="ltr">{{ datetimeFormater(getOrder.acceptedAt) }}</span>
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
                    <span dir="ltr">{{ datetimeFormater(getOrder.preparedAt) }}</span>
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
                        v-if="item.status === 'Pending'"
                        class="m-0 deep-orange--text text--darken-4"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
                      <span
                        v-if="item.status === 'Accepted'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
                      <span
                        v-if="item.status === 'Prepared'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
                      <span
                        v-if="item.status === 'Delivered'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
                      <span
                        v-if="item.status === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
                      <span
                        v-if="item.status === 'Canceled'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${item.status}`) }}</span>
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
                    getOrder.status === 'Rejected' ||
                      getOrder.status === 'Canceled'
                  "
                  cols="9"
                >
                  <div>
                    {{ getOrder.reason }}
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
                        {{ $t('common.sar') }}</span>
                    </div>
                    <div v-else>
                      {{ $t('common.doesnotExist') }}
                    </div>
                  </div>
                </v-col>
                <v-col
                  v-if="getOrder.invoice"
                  cols="3"
                  class="cyan--text"
                >
                  <v-icon small>mdi-circle-medium</v-icon>
                  {{ $t('Product.customPrice') }}
                </v-col>
                <v-col v-if="getOrder.invoice" cols="9">
                  <div>
                    <div>
                      <span class="success--text">
                        {{ getOrder.invoice.customPrice.toFixed(2) }}
                        {{ $t('common.sar') }}</span>
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
                  <v-col
                    v-if="getOrder.rejectReason"
                    cols="3"
                    class="cyan--text"
                  >
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
                    <template v-slot:[`item.manufacturer`]="{ item }">
                      <template v-if="item.product.manufacturer">
                        {{ item.product.manufacturer.name }}
                      </template>
                      <template v-else>
                        {{ $t('Orders.unknown') }}
                      </template>
                    </template>

                    <!-- <template
                      v-slot:[`item.productQuantities`]="{ item }"
                    >
                      <template
                        v-if="
                          item.productQuantity
                        "
                      >
                        <template
                          v-if="item.productQuantity.productAttributeValues
                            .length !== 0"
                        >
                          <v-list-item-content
                            v-for="attribute, i in item.productQuantity
                              .productAttributeValues"
                            :key="i"
                          >
                            <strong>{{
                              attribute.productAttribute.name
                            }}:</strong>
                            {{ attribute.name }}
                          </v-list-item-content>
                        </template>
                      </template>
                      <template v-else>
                        <template>
                          <v-list-item-content>
                            {{
                              $t('Orders.noProperties')
                            }}</v-list-item-content>
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
      </template>
    </v-dialog>
  </div>
</template>
<script>
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
