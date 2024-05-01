<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('Merchant.invoices') }}</div>
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
        :items="getInvoicesList"
        item-key="id"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-row class="px-2 py-2">
            <v-col cols="12" md="4" sm="6">
              <div>{{ $t('PotentialMerchantVisit.merchantName') }}</div>
              <p class="text-h5 text--primary">
                {{ getInvoice.merchantName }}
              </p>
            </v-col>
          </v-row>
          <div class="py-2">
            <v-row class="px-2">
              <v-col cols="12" md="3" sm="4">
                <v-text-field
                  v-model="searchFilter.searchString"
                  clearable
                  outlined
                  :label="$t('Invoices.invoiceId')"
                  style="margin: 18px 0 0 0"
                  class="my-2"
                >
                </v-text-field
              ></v-col>
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
                </v-menu></v-col
              >
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
                </v-autocomplete></v-col
              >
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
                    </v-btn></v-col
                  >
                  <v-col cols="6">
                    <v-btn color="primary" class="mx-2" @click="emptyFilters()">
                      {{ $t('common.showAll') }}
                    </v-btn></v-col
                  >
                </v-row>
              </v-col>
            </v-row>
          </div>
        </template>
        <template v-slot:[`item.number`]="{ item }">
          <copy-label :text="String(item.orderNumber)" />
        </template>
        <template v-slot:[`item.invoiceId`]="{ item }">
          <copy-label :text="String(item.sid)" />
        </template>
        <template v-slot:[`item.customer`]="{ item }">
          {{ item.user.name }}
        </template>
        <template v-slot:[`item.fullyPaidAt`]="{ item }">
          {{
            item.createdAt
              ? item.createdAt.substr(0, 10)
              : $t('common.doesnotExist')
          }}
        </template>
        <template v-slot:[`item.customPrice`]="{ item }">
          {{ item.customPrice ? item.customPrice.toFixed(2) : 0 }}
        </template>
        <template v-slot:[`item.paidAmount`]="{ item }">
          {{ item.paidAmount ? item.paidAmount.toFixed(2) : 0 }}
        </template>
        <template v-slot:[`item.remainingAmount`]="{ item }">
          {{ (item.customPrice - item.paidAmount).toFixed(2) }}
        </template>
        <template v-slot:[`item.invoiceStatus`]="{ item }">
          {{
            item.fullyPaidDate ? $t('Invoices.paid') : $t('Invoices.notPaid')
          }}
        </template>

        <template v-slot:[`item.orderStatus`]="{ item }">
          <span
            v-if="item.orderStatus === 'Pending'"
            class="m-0 deep-orange--text text--darken-4"
          >
            {{ $t(`common.${item.orderStatus}`) }}
          </span>
          <span
            v-if="item.orderStatus === 'Accepted'"
            class="m-0 success--text text--darken-2"
          >
            {{ $t(`common.${item.orderStatus}`) }}
          </span>
          <span
            v-if="item.orderStatus === 'Prepared'"
            class="m-0 success--text text--darken-2"
          >
            {{ $t(`common.${item.orderStatus}`) }}</span
          >
          <span
            v-if="item.orderStatus === 'Delivered'"
            class="m-0 success--text text--darken-2"
          >
            {{ $t(`common.${item.orderStatus}`) }}
          </span>
          <span v-if="item.orderStatus === 'Rejected'" class="m-0 red--text">
            {{ $t(`common.${item.orderStatus}`) }}
          </span>
          <span v-if="item.orderStatus === 'Canceled'" class="m-0 red--text">
            {{ $t(`common.${item.orderStatus}`) }}
          </span>
        </template>

        <template v-slot:[`item.options`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="1200" persistent>
            <template v-slot:activator="{ attrs }">
              <div class="text-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="my-2"
                      v-bind="attrs"
                      @click="optionsClick(item)"
                      v-on="on"
                    >
                      {{ $t('common.options') }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-show="
                        item.orderStatus === 'Accepted' ||
                        item.orderStatus === 'Pending' ||
                        item.orderStatus === 'Prepared' ||
                        item.orderStatus === 'Delivered'
                      "
                    >
                      <v-list-item-title>
                        <v-dialog
                          transition="dialog-top-transition"
                          max-width="1200"
                          persistent
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              depressed
                              elevation="0"
                              v-bind="attrs"
                              style="cursor: pointer"
                              v-on="on"
                            >
                              {{ $t('Invoices.createReceiptVoucher') }}
                            </v-btn>
                          </template>
                          <template v-slot:default="createDialog">
                            <v-card>
                              <v-card-title class="primary white--text">
                                <span class="text-h5">{{
                                  $t('Invoices.createReceiptVoucher')
                                }}</span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  dark
                                  text
                                  @click="
                                    optionsDialog = false
                                    createDialog.value = false
                                  "
                                >
                                  <v-icon>close</v-icon>
                                </v-btn>
                              </v-card-title>
                              <v-card-text>
                                <v-form v-model="valid">
                                  <v-row class="my-2">
                                    <v-col cols="12" md="4">
                                      <v-text-field
                                        v-model="receiptVoucher.amount"
                                        type="number"
                                        :label="$t('common.amount')"
                                        required
                                        style="margin: 18px 0 0 0"
                                        outlined
                                        dense
                                        class="my-2"
                                      >
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" class="py-2">
                                      <v-select
                                        v-model="receiptVoucher.method"
                                        outlined
                                        :label="$t('Invoices.paymentMethod')"
                                        :items="
                                          getMethodsList.map(
                                            ({ name, id }) => ({
                                              text: name,
                                              value: id
                                            })
                                          )
                                        "
                                        required
                                      >
                                      </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" class="py-2">
                                      <v-menu
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                      >
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-text-field
                                            v-model="receiptVoucher.date"
                                            outlined
                                            :label="$t('Orders.creationDate')"
                                            prepend-icon="mdi-calendar"
                                            required
                                            readonly
                                            v-bind="attrs"
                                            style="margin: 18px 0 0 0"
                                            v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-date-picker
                                          v-model="receiptVoucher.date"
                                          @input="menu2 = false"
                                        ></v-date-picker>
                                      </v-menu>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-text-field
                                        v-model="
                                          receiptVoucher.andThatIsInReturn
                                        "
                                        outlined
                                        rows="4"
                                        required
                                        :label="
                                          $t('Invoices.andThatIsInReturn')
                                        "
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-file-input
                                        v-model="receiptVoucher.attachments"
                                        show-size
                                        counter
                                        outlined
                                        :label="$t('common.Attachments')"
                                      ></v-file-input>
                                    </v-col>
                                    <v-col cols="12">
                                      <v-textarea
                                        v-model="receiptVoucher.notes"
                                        outlined
                                        rows="4"
                                        required
                                        prepend-icon="mdi-pencil"
                                        :label="$t('common.notes')"
                                      ></v-textarea>
                                    </v-col>
                                  </v-row>
                                </v-form>
                              </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn
                                  color="primary"
                                  :loading="isLoading"
                                  dark
                                  @click="createVoucher(getInvoice.id)"
                                >
                                  {{ $t('common.create') }}
                                </v-btn>
                                <v-btn
                                  text
                                  @click="
                                    createDialog.value = false
                                    optionsDialog = false
                                    detailsDialog.value = false
                                    displayInvoice = false
                                  "
                                  >{{ $t('common.cancel') }}</v-btn
                                >
                              </v-card-actions>
                            </v-card>
                          </template>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <v-dialog
                          transition="dialog-top-transition"
                          max-width="1200"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              depressed
                              elevation="0"
                              v-bind="attrs"
                              style="cursor: pointer"
                              v-on="on"
                            >
                              {{ $t('Invoices.inoviceDetails') }}
                            </v-btn>
                          </template>
                          <template v-slot:default="detailsDialog">
                            <v-card>
                              <v-card-title class="primary white--text">
                                <span class="text-h5">{{
                                  $t('Invoices.inoviceDetails')
                                }}</span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  dark
                                  text
                                  @click="
                                    optionsDialog = false
                                    detailsDialog.value = false
                                  "
                                >
                                  <v-icon>close</v-icon>
                                </v-btn>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <h3 class="cyan--text my-2">
                                    <v-icon class="mx-2">mdi-account</v-icon>
                                    {{ $t('users.customerInfo') }}
                                  </h3>
                                  <v-divider></v-divider>
                                  <v-row class="my-2">
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('users.customerName') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.name"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.name }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('profile.username') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.userName"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.userName }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('profile.email') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.email"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.email }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('profile.phone') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.phone"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.phone }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('users.address') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.adress"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.adress }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Merchant.number') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.number"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.number }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Merchant.companyName') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.user.companyName"
                                          class="m-0"
                                        >
                                          {{ getInvoice.user.companyName }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('dashboard.activity') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="getInvoice.user.activity"
                                            class="m-0"
                                          >
                                            {{ getInvoice.user.activity }}
                                          </span>
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('geography.country') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="getInvoice.user.country.name"
                                            class="m-0"
                                          >
                                            {{ getInvoice.user.country.name }}
                                          </span>
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('geography.region') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="getInvoice.user.region.name"
                                            class="m-0"
                                          >
                                            {{ getInvoice.user.region.name }}
                                          </span>
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('geography.city') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="getInvoice.user.city.name"
                                            class="m-0"
                                          >
                                            {{ getInvoice.user.city.name }}
                                          </span>
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Product.ProductPriceCategories') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="
                                              String(
                                                getInvoice.user.priceCategory
                                              ) &&
                                              getInvoice.user.priceCategory !=
                                                null
                                            "
                                            class="m-0"
                                          >
                                            {{
                                              $i18n.locale == 'ar'
                                                ? getInvoice.user.priceCategory
                                                    .nameAr
                                                : getInvoice.user.priceCategory
                                                    .nameEn
                                            }}
                                          </span>
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
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
                                      <div>
                                        <span
                                          v-if="getInvoice.orderNumber"
                                          class="m-0"
                                        >
                                          {{ getInvoice.orderNumber }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>

                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Product.totalPrice') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="String(getInvoice.totalPrice)"
                                          class="m-0"
                                        >
                                          {{ getInvoice.totalPrice.toFixed(2) }}
                                          {{ $t('common.sar') }}</span
                                        >
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Product.customDiscount') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="
                                              String(getInvoice.customDiscount)
                                            "
                                            class="m-0"
                                          >
                                            {{
                                              getInvoice.customDiscount.toFixed(
                                                2
                                              )
                                            }}
                                            {{ $t('common.sar') }}</span
                                          >
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col
                                      v-if="getInvoice.customPrice"
                                      cols="3"
                                      class="cyan--text"
                                    >
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Product.customPrice') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <div v-if="getInvoice.customPrice">
                                          <span
                                            v-if="
                                              String(getInvoice.customPrice)
                                            "
                                            class="m-0"
                                          >
                                            {{
                                              getInvoice.customPrice.toFixed(2)
                                            }}
                                            {{ $t('common.sar') }}</span
                                          >
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('common.status') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <div v-if="getInvoice.orderStatus">
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Pending'
                                            "
                                            class="m-0 deep-orange--text text--darken-4"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Accepted'
                                            "
                                            class="m-0 success--text text--darken-2"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Prepared'
                                            "
                                            class="m-0 success--text text--darken-2"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Delivered'
                                            "
                                            class="m-0 success--text text--darken-2"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Rejected'
                                            "
                                            class="m-0 red--text"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                          <span
                                            v-if="
                                              getInvoice.orderStatus ===
                                              'Canceled'
                                            "
                                            class="m-0 red--text"
                                          >
                                            {{
                                              $t(
                                                `common.${getInvoice.orderStatus}`
                                              )
                                            }}</span
                                          >
                                        </div>
                                      </div>
                                    </v-col>
                                  </v-row>
                                  <h3 class="cyan--text my-2">
                                    <v-icon class="mx-2">mdi-receipt</v-icon>
                                    {{ $t('Invoices.invoiceInfo') }}
                                  </h3>
                                  <v-divider></v-divider>
                                  <v-row class="my-2">
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Invoices.invoiceId') }}
                                    </v-col>

                                    <v-col cols="9">
                                      <div v-if="getInvoice.sid">
                                        {{ getInvoice.sid }}
                                      </div>
                                    </v-col>

                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Invoices.movementDate') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <span
                                          v-if="getInvoice.fullyPaidDate"
                                          class="m-0"
                                        >
                                          {{
                                            getInvoice.fullyPaidDate.substr(
                                              0,
                                              10
                                            )
                                          }}
                                        </span>
                                        <span v-else>{{
                                          $t('common.doesnotExist')
                                        }}</span>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Invoices.PaidAmount') }}
                                    </v-col>
                                    <v-col cols="9">
                                      <div>
                                        <div>
                                          <span
                                            v-if="String(getInvoice.paidAmount)"
                                            class="m-0"
                                          >
                                            {{
                                              getInvoice.paidAmount.toFixed(2)
                                            }}
                                            {{ $t('common.sar') }}</span
                                          >
                                          <span v-else>{{
                                            $t('common.doesnotExist')
                                          }}</span>
                                        </div>
                                      </div>
                                    </v-col>
                                    <v-col cols="3" class="cyan--text">
                                      <v-icon small>mdi-circle-medium</v-icon>
                                      {{ $t('Invoices.payments') }}
                                    </v-col>
                                    <v-col cols="12">
                                      <div>
                                        <div v-if="getInvoice.payments">
                                          <v-data-table
                                            dense
                                            :loading="isLoading"
                                            :headers="headers2"
                                            :items="getInvoice.payments"
                                            item-key="id"
                                            hide-default-footer
                                            disable-filtering
                                            disable-pagination
                                            disable-sort
                                            class="elevation-1"
                                          >
                                            <template
                                              v-slot:[`item.sid`]="{ item }"
                                            >
                                              {{ item.sid }}
                                            </template>
                                            <template
                                              v-slot:[`item.date`]="{ item }"
                                            >
                                              {{
                                                item.createdAt
                                                  ? item.createdAt.substr(0, 10)
                                                  : ''
                                              }}
                                            </template>
                                            <template
                                              v-slot:[`item.method`]="{ item }"
                                            >
                                              {{
                                                item.method
                                                  ? item.method
                                                  : $t(`Orders.unknown`)
                                              }}
                                            </template>
                                            <template
                                              v-slot:[`item.amount`]="{ item }"
                                            >
                                              <span
                                                v-if="
                                                  Math.sign(item.amount) == -1
                                                "
                                                class="m-0 red--text"
                                              >
                                                {{
                                                  Math.abs(item.amount).toFixed(
                                                    2
                                                  )
                                                }}
                                              </span>
                                              <span
                                                v-if="
                                                  Math.sign(item.amount) == 1
                                                "
                                                class="m-0 success--text text--darken-2"
                                              >
                                                {{
                                                  Math.abs(item.amount).toFixed(
                                                    2
                                                  )
                                                }}
                                              </span>
                                              <span
                                                v-if="
                                                  Math.sign(item.amount) == 0
                                                "
                                                class="m-0 deep-orange--text text--darken-4"
                                              >
                                                {{
                                                  Math.abs(item.amount).toFixed(
                                                    2
                                                  )
                                                }}
                                              </span>
                                            </template>

                                            <template
                                              v-slot:[`item.notes`]="{ item }"
                                            >
                                              <div>
                                                {{ item.notes }}
                                              </div>
                                            </template>
                                            <template
                                              v-slot:[`item.attachment`]="{
                                                item
                                              }"
                                            >
                                              <v-btn
                                                v-if="item.attachment"
                                                :href="item.attachment"
                                                target="_blank"
                                                elevation="0"
                                                >{{
                                                  $t('common.download')
                                                }}</v-btn
                                              >
                                              <div v-else>-</div>
                                            </template>
                                          </v-data-table>
                                        </div>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                              <hr class="header-divider primary" />
                            </v-card>
                          </template>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
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
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading
  },
  data() {
    return {
      searchFilter: {
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      },
      errors: {},
      menu: false,
      dialog: false,
      menu2: false,
      isLoading: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Merchants'),
          disabled: false,
          to: '/merchents/list'
        },
        {
          text: this.$i18n.t('Merchant.invoices')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('common.orderId'),
          value: 'number'
        },
        {
          text: this.$i18n.t('Invoices.invoiceId'),
          value: 'invoiceId'
        },
        {
          text: this.$i18n.t('users.customerName'),
          value: 'customer'
        },
        {
          text: this.$i18n.t('Invoices.movementDate'),
          value: 'fullyPaidAt',
          width: '100px'
        },
        {
          text: this.$i18n.t('Invoices.requiredAmount'),
          value: 'customPrice'
        },
        {
          text: this.$i18n.t('Invoices.PaidAmount'),
          value: 'paidAmount'
        },
        {
          text: this.$i18n.t('Invoices.remainingAmount'),
          value: 'remainingAmount'
        },
        {
          text: this.$i18n.t('Invoices.invoiceStatus'),
          value: 'invoiceStatus'
        },
        {
          text: this.$i18n.t('Orders.orderStatus'),
          value: 'orderStatus'
        },
        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        }
      ],

      headers2: [
        {
          text: this.$i18n.t('Merchant.number'),
          value: 'sid'
        },
        {
          text: this.$i18n.t('Orders.creationDate'),
          value: 'date'
        },
        {
          text: this.$i18n.t('Invoices.paymentMethod'),
          value: 'method'
        },
        {
          text: this.$i18n.t('common.amount'),
          value: 'amount'
        },
        {
          text: this.$i18n.t('common.notes'),
          value: 'notes'
        },
        {
          text: this.$i18n.t('common.Attachments'),
          value: 'attachment'
        }
      ],
      rules: {
        required: (value) => !!value || this.$i18n.t('Orders.required')
      },
      optionsList: [
        this.$i18n.t('Invoices.inoviceDetails'),
        this.$i18n.t('Invoices.createReceiptVoucher')
      ],
      optionsDialog: false,
      detailsDialog: false,
      createDialog: false,
      valid: false,
      receiptVoucher: {
        id: '',
        amount: '',
        method: '',
        date: '',
        andThatIsInReturn: '',
        attachments: '',
        notes: ''
      }
    }
  },
  computed: {
    ...mapGetters('PotentialMerchant', [
      'getLastPage',
      'getInvoicesList',
      'getInvoice',
      'getMethodsList'
    ])
  },

  methods: {
    ...mapActions('PotentialMerchant', [
      'fetchAdminInvoices',
      'fetchAdminInvoice',
      'createReceiptVoucherAdmin',
      'fetchMethodsAdmin'
    ]),

    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    searchFilters() {
      console.log(this.searchFilter)
      this.isLoading = true
      this.fetchAdminInvoices(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    emptyFilters() {
      this.isLoading = true
      this.searchFilter = {
        UserID: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      }
      this.searchFilter.UserID = this.$route.params.singlemerchent_id
      this.fetchAdminInvoices(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    },
    optionsClick(item, index = 0) {
      this.fetchAdminInvoice(item.id).then(() => {
        this.detailsDialog = true

        this.optionsDialog = true
      })
    },
    createVoucher(id) {
      this.isLoading = true
      this.receiptVoucher.id = id
      this.valid = false
      this.createReceiptVoucherAdmin(this.receiptVoucher).then(() => {
        this.fetchAdminInvoices(this.searchFilter)
          .then((res) => {
            console.log(res)
            if (res.status == 200) {
              this.isLoading = false
              this.optionsDialog = false
              this.displayInvoice = false
              this.rest()
            }
          })

          .catch((err) => {
            console.log(err)
          })
        this.isLoading = false
        // this.optionsDialog = false
        // this.displayInvoice = false
        if (this.valid == false) {
          this.rest()
        }
      })
    },

    rest() {
      ;(this.receiptVoucher = {
        id: '',
        amount: '',
        method: '',
        date: '',
        andThatIsInReturn: '',
        attachments: '',
        notes: ''
      }),
        this.er
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
          .dispatch('PotentialMerchant/fetchAdminInvoices', this.searchFilter)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
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
    this.page = Number(this.$route.query.page)
    this.fetchMethodsAdmin()
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
