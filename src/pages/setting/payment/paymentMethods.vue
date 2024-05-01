<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('setting.editPayment') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getPaymentMethods"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <div class="d-flex justify-space-between w" style="width: 100%;">
              <div class="d-flex align-center" >
                <v-text-field
                  v-model="searchFilter.searchString"
                  :label="$t('common.search')"
                  width="20%"
                  style="margin: 18px 0 0 0"
                  clearable
                  outlined
                  hide-details
                  @input="fetchPaymentMethods(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchPaymentMethods(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>

            </div>
          </v-toolbar>
        </template>
        <template v-slot:item.isActive="{ item }">
          <v-switch
            v-if="item.isActive === false"
            v-model="item.isActive"
            inset
            @change="onMethod(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.isActive === true"
            v-model="item.isActive"
            inset
            @change="offMethod(item.id)"
          ></v-switch>
        </template>
        <template v-slot:item.forMerchantOnly="{ item }">
          <v-switch
            v-if="item.forMerchantOnly === false"
            v-model="item.forMerchantOnly"
            color="gray"
            inset
            @change="forMerchantOnly(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.forMerchantOnly === true"
            v-model="item.forMerchantOnly"
            inset
            color="green"
            @change="notForMerchantOnly(item.id)"
          ></v-switch>
        </template>
      </v-data-table>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="blue darken-1"
      bottom
      top
      text
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue darken-1" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="error"
      :timeout="timeout"
      color="error darken-1"
      bottom
      top
      text
    >
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="error darken-1" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import loading from '@/components/common/loading'

import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    loading

  },
  data() {
    return {
      id: '',
      NameEn: '',
      NameAr: '',
      loading: true,
      searchFilter: {
        searchString: ''
      },

      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('setting.editPayment')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('common.nameInEnglish'),
          value: 'nameEn'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },

        {
          text: this.$i18n.t('setting.merchantOnly'),
          value: 'forMerchantOnly'
        }
      ]

    }
  },

  computed: {
    ...mapGetters('Payment', ['getPaymentMethods'])

  },

  methods: {
    ...mapActions('Payment', ['fetchPaymentMethods', 'changePaymentMethodStatus', 'changePaymentMethodForMerchantOnly']),

    offMethod(id) {
      this.changePaymentMethodStatus({
        id: id,
        status: false
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },
    onMethod(id) {
      this.changePaymentMethodStatus({
        id: id,
        status: true
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },
    notForMerchantOnly(id) {
      this.changePaymentMethodForMerchantOnly({
        id: id,
        status: false
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },
    forMerchantOnly(id) {
      this.changePaymentMethodForMerchantOnly({
        id: id,
        status: true
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    }

  },
  mounted() {
    this.loading = true
    this.fetchPaymentMethods()
      .then(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opaCountry: 0;
}
</style>
