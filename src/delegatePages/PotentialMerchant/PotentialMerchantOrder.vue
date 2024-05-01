<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.orders') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>

    <div v-if="!loading">
      <v-data-table
        dense
        :loading="isLoading"
        :headers="headers"
        :items="getOrdersList"
        item-key="id"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <div class="py-2">
            <v-row class="px-2">
              <v-col cols="12" md="2" sm="4">
                <v-autocomplete
                  v-model="searchFilter.UserID"
                  clearable
                  :label="$t('users.customerName')"
                  :items="
                    getPotentialMerchantList.map(({ name, userId }) => ({
                      text: name,
                      value: userId
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="my-2"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="3" sm="4">
                <v-text-field
                  v-model="searchFilter.searchString"
                  clearable
                  outlined
                  :label="$t('common.orderId')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                </v-text-field></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="searchFilter.createdDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="searchFilter.createdDate"
                      clearable
                      :label="$t('Orders.orderedAt')"
                      readonly
                      outlined
                      v-bind="attrs"
                      style="margin: 18px 0 0 0"
                      class="my-2"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="searchFilter.createdDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(searchFilter.createdDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-autocomplete
                  v-model="searchFilter.status"
                  clearable
                  :items="[
                    'Pending',
                    'Accepted',
                    'Prepared',
                    'Delivered',
                    'Canceled',
                    'Rejected'
                  ]"
                  outlined
                  dense
                  :label="$t('common.status')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                  <template v-slot:selection="data" class="selection">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Pending'"
                        class="m-0 deep-orange--text text--darken-4"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Accepted'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Prepared'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Delivered'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Canceled'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <span
                        v-if="data.item === 'Pending'"
                        class="m-0 deep-orange--text text--darken-4"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Accepted'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Prepared'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Delivered'"
                        class="m-0 success--text text--darken-2"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                      <span
                        v-if="data.item === 'Canceled'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                </v-autocomplete></v-col>
              <v-col cols="12" md="2" sm="4">
                <v-row class="my-2">
                  <v-col cols="6">
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      small
                      color="primary"
                      @click="searchFilters()"
                    >
                      <v-icon dark> mdi-magnify </v-icon>
                    </v-btn></v-col>
                  <v-col cols="6">
                    <v-btn color="primary" class="mx-2" @click="emptyFilters()">
                      {{ $t('common.showAll') }}
                    </v-btn></v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:[`item.number`]="{ item }">
          <copy-label :text="item.number" />
        </template>
        <template v-slot:[`item.customer`]="{ item }">
          {{ item.user.name }}
        </template>
        <template v-slot:[`item.orderedAt`]="{ item }">
          {{ item.orderedAt.substr(0, 10) }}
        </template>
        <template v-slot:[`item.totalItems`]="{ item }">
          {{ item.customPrice }}
        </template>
        <template v-slot:[`item.totalPrice`]="{ item }">
          {{ item.invoice.totalPrice.toFixed(2) }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <span
            v-if="item.status === 'Pending'"
            class="m-0 deep-orange--text text--darken-4"
          >
            {{ $t(`common.${item.status}`) }}
          </span>
          <span v-if="item.status === 'Accepted'" class="m-0 success--text text--darken-2">
            {{ $t(`common.${item.status}`) }}
          </span>
          <span v-if="item.status === 'Prepared'" class="m-0 success--text text--darken-2">
            {{ $t(`common.${item.status}`) }}</span>
          <span v-if="item.status === 'Delivered'" class="m-0 success--text text--darken-2">
            {{ $t(`common.${item.status}`) }}
          </span>
          <span v-if="item.status === 'Rejected'" class="m-0 red--text">
            {{ $t(`common.${item.status}`) }}
          </span>
          <span v-if="item.status === 'Canceled'" class="m-0 red--text">
            {{ $t(`common.${item.status}`) }}
          </span>
        </template>

        <template v-slot:[`item.Details`]="{ item }">
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
                    <v-row class="my-1" no-gutters >
                      <v-col sm="9" xs="12" class="pa-0 d-flex align-center">
                        <h3 class="cyan--text my-2">
                          <v-icon class="mx-2">mdi-account</v-icon>
                          {{ $t('users.customerInfo') }}
                        </h3>
                      </v-col>
                      <v-col sm="3" xs="12" class="">
                        <v-row no-gutters class="justify-end" >
                          <v-col class="pa-0">
                            <v-dialog
                              transition="dialog-top-transition"
                              max-width="600"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  v-show="item.status == 'Pending'"
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
                                  v-show="item.status == 'Pending'"
                                  color="error"
                                  dark
                                  small
                                  v-bind="attrs"
                                  class="ma-1"
                                  v-on="on"
                                >
                                  {{ $t('Orders.rejectOrder') }}
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
                                              @click="rejectThisOrder(item), (dialog.value = false)"
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
                    <v-row v-if="getOrder.user" class="my-2">
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('users.customerName') }}
                      </v-col>

                      <v-col cols="9">
                        <div v-if="getOrder.user.name">
                          {{ getOrder.user.name }}
                        </div>
                        <div v-else>
                          {{ $t('common.doesnotExist') }}
                        </div>
                      </v-col>
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.ProductPriceCategories') }}
                      </v-col>

                      <v-col cols="9">
                        <div v-if="getOrder.user.priceCategory">
                          <div>
                            {{ $i18n.locale == 'ar' ? getOrder.user.priceCategory.nameAr : getOrder.user.priceCategory.nameEn }}
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.orderedAt') }}
                      </v-col>
                      <v-col cols="9">
                        <div v-if="getOrder.orderedAt">
                          <span dir="ltr">
                            {{ datetimeFormater(getOrder.orderedAt) }}
                          </span>
                        </div>
                        <div v-else>
                          {{ $t('common.doesnotExist') }}
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.acceptedAt"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.acceptedAt') }}
                      </v-col>
                      <v-col v-if="getOrder.acceptedAt" cols="9">
                        <div v-if="getOrder.user">
                          <span dir="ltr">

                            {{ datetimeFormater(getOrder.acceptedAt) }}
                          </span>
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.preparedAt"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.preparedAt') }}
                      </v-col>
                      <v-col v-if="getOrder.preparedAt" cols="9">
                        <div v-if="getOrder.user">
                          <span dir="ltr">
                            {{ datetimeFormater(getOrder.preparedAt) }}
                          </span>
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.deliveredAt"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.deliveredAt') }}
                      </v-col>
                      <v-col v-if="getOrder.deliveredAt" cols="9">
                        <div>
                          <span dir="ltr">
                            {{ datetimeFormater(getOrder.deliveredAt) }}
                          </span>
                        </div>
                      </v-col>

                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                      <v-col cols="3" class="cyan--text">
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
                        v-if="getOrder.customPrice"
                        cols="3"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.customPrice') }}
                      </v-col>
                      <v-col v-if="getOrder.customPrice" cols="9">
                        <div>
                          <div v-if="getOrder.user">
                            <span>
                              {{ getOrder.invoice.customPrice.toFixed(2) }}
                              {{ $t('common.sar') }}</span>
                          </div>
                        </div>
                      </v-col>
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
                      <v-col cols="3" class="cyan--text">
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

                        <!--   <template
                            v-slot:[`item.productQuantities`]="{ item }"
                          >
                            <template
                              v-if="
                                item.productQuantity
                              "
                            >
                              <template>
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
                </v-card-text>
                <hr class="header-divider primary" />
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-data-table>

      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination
                  v-model="page"
                  circle
                  total-visible="7"
                  class="my-4"
                  :length="getLastPage"
                  @input="handlingRoute($event)"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
export default {
  components: {
    CopyLabel,
    loading
  },
  data() {
    return {
      searchFilter: {
        agentId: '',
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageSize: 10,
        PageNumber: 1
      },
      menu: false,
      dialog: false,
      isLoading: false,
      loading: true,
      rejectReason: '',
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.orders'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('common.orderId'),
          value: 'number'
        },
        {
          text: this.$i18n.t('users.customerName'),
          value: 'customer'
        },
        {
          text: this.$i18n.t('Orders.orderedAt'),
          value: 'orderedAt'
        },
        {
          text: this.$i18n.t('common.productsNumbers'),
          value: 'totalItems'
        },
        {
          text: this.$i18n.t('ecommerce.price'),
          value: 'totalPrice'
        },
        {
          text: this.$i18n.t('common.status'),
          value: 'status'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        }
      ],
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
          text: this.$i18n.t('Product.manufacturer'),
          value: 'manufacturer'
        },
       /*  {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
          value: 'productQuantities'
        }, */
        {
          text: this.$i18n.t('Product.price'),
          value: 'price'
        }
      ],
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required'),
        cDMax: (value, total) =>
          value <= total / 2 ||
          this.$i18n.t(
            'Orders.valueOfCustomDiscountShouldNotExceedTheHalfOfTotal'
          )
      }
    }
  },
  computed: {
    ...mapGetters('PotentialMerchant', [
      'getOrdersList',
      'getLastPage',
      'getOrder',
      'getPotentialMerchantList'
    ])
  },

  methods: {
    ...mapActions('PotentialMerchant', [
      'fetchOrders',
      'fetchOrder',
      'fetchPotentialMerchant'
    ]),
    ...mapMutations('PotentialMerchant', ['setOrder']),
    ...mapActions('AllOrders', ['acceptOrderAgent', 'rejectOrderAgent']),

    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    acceptThisOrder(item) {
      this.loading = true
      item.status = 'Accepted'
      this.acceptOrderAgent(item.id).finally(() => {
        this.fetchOrders(this.searchFilter)
        this.loading = false
      })
    },
    confirmAction(item) {
      if (item.status === 'Pending') {
        this.acceptThisOrder(item)
      }
    },
    searchFilters() {
      console.log(this.searchFilter)
      this.isLoading = true

      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    emptyFilters() {
      this.isLoading = true
      this.searchFilter = {
        agentId: '',
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageSize: 10,
        PageNumber: 1
      }
      this.searchFilter.UserID = this.$route.params.singlemerchent_id

      this.$router.push('?page=1')
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },

    rejectThisOrder(item) {

      const obj = {
        id: item.id,
        reason: this.rejectReason
      }

      if (item.status === 'Pending') {
        this.loading = true

        this.rejectOrderAgent(obj)
          .finally(() => {
            this.fetchOrders(this.searchFilter)
            this.loading = false
          })
      }
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.page) {
          await this.$router.replace({ query: { ...route.query, page: 1 } })

          return
        }
        this.searchFilter.UserID = route.params.singlemerchent_id

        this.searchFilter.PageNumber = route.query.page
        this.$store
          .dispatch('PotentialMerchant/fetchOrders', this.searchFilter)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.agentId == null) this.searchFilter.agentId = ''
        if (searchFilter.UserID == null) this.searchFilter.UserID = ''
        if (searchFilter.createdDate == null) this.searchFilter.createdDate = ''
        if (searchFilter.status == null) this.searchFilter.status = ''
        if (searchFilter.searchString == null)
          this.searchFilter.searchString = ''
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchPotentialMerchant()
    this.page = Number(this.$route.query.page)
  }
}
</script>

<style lang="scss" scoped>
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
