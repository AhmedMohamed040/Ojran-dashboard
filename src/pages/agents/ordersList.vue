<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.ordersAgents') }}</div>
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
              <v-col cols="12" md="4" sm="4">
                <v-autocomplete
                  v-model="searchFilter.agentId"
                  clearable
                  :label="$t('users.delegateName')"
                  :items="
                    getDelegateList.map(({ name, userId }) => ({
                      text: name,
                      value: userId
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="mt-2"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="4" sm="4">
                <v-autocomplete
                  v-model="searchFilter.merchantId"
                  clearable
                  :label="$t('PotentialMerchantVisit.merchantName')"
                  :items="
                    getMerchantList.map(({ name, userId }) => ({
                      text: name,
                      value: userId
                    }))
                  "
                  outlined
                  dense
                  style="margin: 18px 0 0 0"
                  class="mt-2"
                ></v-autocomplete></v-col>
              <v-col cols="12" md="4" sm="4">
                <v-text-field
                  v-model="searchFilter.searchString"
                  clearable
                  outlined
                  :label="$t('common.orderId')"
                  style="margin: 18px 0 0 0"
                  class="mt-2"
                >
                </v-text-field></v-col>
              <v-col cols="12" md="4" sm="4">
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
                      :label="$t('Orders.creationDate')"
                      readonly
                      outlined
                      v-bind="attrs"
                      style="margin: 18px 0 0 0"
                      class="mt-2"
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
              <v-col cols="12" md="4" sm="3">
                <v-autocomplete
                  v-model="searchFilter.status"
                  clearable
                  :items="['Pending', 'Accepted', 'Rejected']"
                  outlined
                  dense
                  :label="$t('common.status')"
                  style="margin: 18px 0 0 0"
                  class="mt-2"
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
                        v-if="data.item === 'Rejected'"
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
                        v-if="data.item === 'Rejected'"
                        class="m-0 red--text"
                      >
                        {{ $t(`common.${data.item}`) }}
                      </span>
                    </v-list-item-content>
                  </template>
                </v-autocomplete></v-col>
              <v-col cols="12" md="4" sm="3">
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
          <copy-label :text="String(item.number)" />
        </template>
        <template v-slot:[`item.agent`]="{ item }">
          {{ item.agent.name }}
        </template>
        <template v-slot:[`item.merchant`]="{ item }">
          {{ item.merchant.name }}
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt.substr(0, 10) }}
        </template>
        <template v-slot:[`item.totalPrice`]="{ item }">
          {{ item.customPrice.toFixed(2) }}
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
          <span v-if="item.status === 'Rejected'" class="m-0 red--text">
            {{ $t(`common.${item.status}`) }}
          </span>
        </template>

        <template v-slot:[`item.Details`]="{ item }">
          <!-- v-model="dialog" -->
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
                    <h3 class="cyan--text my-2">
                      <v-icon class="mx-2">mdi-account</v-icon>
                      {{ $t('users.delegateInfo') }}
                    </h3>
                    <v-divider></v-divider>
                    <v-row class="my-2">
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('users.delegateName') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.agent">
                          {{ getOrder.agent.name }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.username') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.agent">
                          {{ getOrder.agent.userName }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.phone') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.agent">
                          {{ getOrder.agent.phone }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('users.address') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.agent">
                          {{ getOrder.agent.address }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.status') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
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
                    <h3 class="cyan--text my-2">
                      <v-icon class="mx-2">mdi-account-cash</v-icon>
                      {{ $t('Merchant.Merchantinfo') }}
                    </h3>
                    <v-divider></v-divider>
                    <v-row class="my-2">
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Merchant.merchantName') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.name }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.username') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.userName }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.email') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.email }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('profile.phone') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.phone }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('users.address') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.address }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Merchant.number') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.number }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Merchant.companyName') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.merchant.companyName }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('dashboard.activity') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          <div>
                            {{ getOrder.merchant.activity }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('geography.country') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          <div>
                            {{ getOrder.merchant.country.name }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('geography.region') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          <div>
                            {{ getOrder.merchant.region.name }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('geography.city') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          <div>
                            {{ getOrder.merchant.city.name }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.ProductPriceCategories') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">

                        <div>
                          <div v-if="getOrder.merchant">
                            {{ String(getOrder.merchant.priceCategory) == 'null' ? $t('Orders.unknown') : String(getOrder.merchant.priceCategory.name)}}
                          </div>
                          <div v-else>
                            {{ $t('Orders.unknown') }}
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
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.orderId') }}
                      </v-col>

                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.number }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.creationDate') }}
                      </v-col>
                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.createdAt.substr(0, 10) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('common.status') }}
                      </v-col>
                      <v-col cols="12" sm="9" xs="12">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span
                              v-if="item.status === 'Pending'"
                              class="m-0 deep-orange--text text--darken-4"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                            <span
                              v-if="item.status === 'Accepted'"
                              class="m-0 success--text text--darken-2"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                            <span
                              v-if="item.status === 'Rejected'"
                              class="m-0 red--text"
                            >
                              {{ $t(`common.${getOrder.status}`) }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.totalPrice') }}
                      </v-col>
                      <v-col cols="12" sm="9" xs="12">
                        <div v-if="getOrder.merchant">
                          {{ getOrder.totalPrice.toFixed(2) }}
                          {{ $t('common.sar') }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.customDiscount') }}
                      </v-col>
                      <v-col cols="12" sm="9" xs="12">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span>
                              {{ getOrder.customDiscount }}
                              {{ $t('common.sar') }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col
                        v-if="getOrder.customPrice"
                        cols="12"
                        sm="3"
                        xs="12"
                        class="cyan--text"
                      >
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Product.customPrice') }}
                      </v-col>
                      <v-col v-if="getOrder.customPrice" cols="12" sm="9" xs="12">
                        <div>
                          <div v-if="getOrder.merchant">
                            <span>
                              {{ getOrder.customPrice.toFixed(2) }}
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
                          <div v-if="getOrder.merchant">
                            <span> {{ getOrder.rejectReason }}</span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="3" xs="12" class="cyan--text">
                        <v-icon small>mdi-circle-medium</v-icon>
                        {{ $t('Orders.tableOfProducts') }}
                      </v-col>

                      <v-col cols="12">
                        <v-data-table
                          dense
                          :loading="isLoading"
                          :headers="headers2"
                          :items="getOrder.orderRequestItems"
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
                              <img

                              src="../../assets/images/logo.png"
                              width="77"
                              height="77"
                              class="elevation-1"
                              alt="User"
                              style="border-radius: 5px"
                            />
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
                            <template v-if="item.quantity">
                              {{ item.quantity }}
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
                                item.productQuantity.productAttributeValues
                                  .length !== 0
                              "
                            >
                              <template>
                                <v-list-item-content v-for="attribute,i in item.productQuantity.productAttributeValues" :key="i">
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
                              {{ item.price }} × {{ item.quantity }}<br />
                              {{ item.price * item.quantity }}
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
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    loading
  },

  beforeMount() {
    if (window.history.state.search) {
        this.search = window.history.state.search
    }
},
  data() {
    return {
      searchFilter: {
        agentId: '',
        merchantId: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      },
      dialog: false,
      menu: false,
      isLoading: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.agents'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.ordersAgents')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('common.orderId'),
          value: 'number'
        },
        {
          text: this.$i18n.t('users.delegateName'),
          value: 'agent'
        },
        {
          text: this.$i18n.t('Merchant.merchantName'),
          value: 'merchant'
        },
        {
          text: this.$i18n.t('common.date'),
          value: 'createdAt'
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
          text: this.$i18n.t('Product.quantity'),
          value: 'quantity'
        },
        {
          text: this.$i18n.t('Product.manufacturer'),
          value: 'manufacturer'
        },

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
    ...mapGetters('AdminOrders', ['getOrdersList', 'getLastPage', 'getOrder']),
    ...mapGetters('Delegates', ['getDelegateList']),
    ...mapGetters('Merchant', ['getMerchantList']),
    priceCategory() {
      // this.$t('Orders.unknown')
      return this.getOrder.merchant.priceCategory ?? false;
    }

  },

  methods: {
    ...mapActions('Delegates', ['fetchDelegates']),
    ...mapActions('Merchant', ['fetchMerchants']),
    ...mapActions('AdminOrders', ['fetchOrders', 'fetchOrder']),

    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    },
    close() {
      this.dialog = false
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
        merchantId: '',
        createdDate: '',
        status: '',
        searchString: '',
        PageNumber: 1
      }
      this.$router.push('?page=1')
      this.fetchOrders(this.searchFilter).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.page) {
          await this.$router.replace({ query: { ...route.query, page: 1 } })

          return
        }
        this.searchFilter.PageNumber = route.query.page
        this.$store
          .dispatch('AdminOrders/fetchOrders', this.searchFilter)
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
        if (searchFilter.merchantId == null) this.searchFilter.merchantId = ''
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
    this.fetchDelegates()
    this.fetchMerchants()
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
