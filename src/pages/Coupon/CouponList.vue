<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Coupons') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getCouponList"
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
                  @input="fetchCoupons(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchCoupons(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>  
              </div>
              <v-dialog v-model="dialog" max-width="975">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="my-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('common.create') }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="primary white--text">
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text class="mt-2">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="coupon.NameEn"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInEnglish')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="coupon.NameAr"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInArabic')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="coupon.Code"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.Code')"
                          ></v-text-field>
                        </v-col>
                        


                        <v-col cols="12" md="4">
                          <v-radio-group row v-model="radios">
                            <v-radio value="Discount">
                              <template v-slot:label>
                                <strong  class="">{{ $t('common.Discount') }}</strong>
                                  
                              </template>
                            </v-radio>
                            <v-radio value="PercentDiscount">
                              <template v-slot:label>
                               <strong  class="">{{ $t('common.PercentDiscount') }}</strong>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col cols="12" md="4" v-if="radios == `Discount`">
                            <v-text-field
                            v-model="coupon.Discount"
                            outlined
                            type="number"
                            :label="$t('common.Discount')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4" v-if="radios == `PercentDiscount`">
                            <v-text-field
                            v-model="coupon.PercentDiscount"
                            outlined
                            type="number"
                            :label="$t('common.PercentDiscount')"
                            ></v-text-field>
                          </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="coupon.MaxDiscount"
                            outlined
                            type="number"
                            :label="$t('common.MaxDiscount')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-menu
                            ref="menu1"
                            v-model="menu1"
                            :close-on-content-click="true"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                outlined
                                v-model="coupon.StartAt"
                                persistent-hint
                                :label="$t('coupons.startAt')"
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                                readonly
                                clearable
                                @clear="(coupon.StartAt = '')"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="coupon.StartAt"
                              no-title
                              @input="menu1 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="true"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                outlined
                                readonly
                                v-model="coupon.EndAt"
                                persistent-hint
                                :label="$t('coupons.endAt')"
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @clear="(coupon.EndAt = '')"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="coupon.EndAt"
                              no-title
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <hr class="header-divider primary" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      dark
                      class="my-2 px-3 py-3"
                      @click="save()"
                    >
                      {{ $t('common.save') }}
                    </v-btn>

                    <v-btn
                      color="red darken-1"
                      dark
                      class="my-2 mx-2 px-3 py-3"
                      @click="close()"
                    >
                      {{ $t('common.cancel') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-toolbar>
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-switch
            v-if="item.isActive === false"
            v-model="item.isActive"
            inset
            @change="unblockUser(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.isActive === true"
            v-model="item.isActive"
            inset
            @change="blockUser(item.id)"
          ></v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:[`item.delete`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('Coupon.deleteCoupon')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{ $t('Coupon.AreYouSureYouWantToDeleteThisCoupon') }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    @click="deleteThisCoupon(item.id), (dialog.value = false)"
                  >
                    {{ $t('common.delete') }}
                  </v-btn>
                  <v-btn text @click="dialog.value = false">{{
                    $t('common.cancel')
                  }}</v-btn>
                </v-card-actions>
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
export default {
  components: {
    CopyLabel,
    loading
  },
  data() {
    return {
      radios: 'Discount',
      menu1: false,
      menu2: false,
      isLoading: false,
      loading: true,
      dialog: false,
      dialogDelete: false,
      page: this.getFilter,
      coupon:{
        id: '',
        NameEn: '',
        NameAr: '',
        Code: '',
        Discount: '',
        PercentDiscount: '',
        MaxDiscount: '',
        StartAt: '',
      },
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Coupons'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      searchFilter: {
        searchString: ''
      },
      headers: [
        {
          text: this.$i18n.t('common.Code'),
          value: 'code'
        },
        {
          text: this.$i18n.t('common.nameInEnglish'),
          value: 'nameEn'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr'
        },

        {
          text: this.$i18n.t('common.Discount'),
          value: 'discount'
        },
        {
          text: this.$i18n.t('common.PercentDiscount'),
          value: 'percentDiscount'
        },
        {
          text: this.$i18n.t('common.MaxDiscount'),
          value: 'maxDiscount'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },
        {
          text: this.$i18n.t('common.edit'),
          value: 'actions'
        },
        {
          text: this.$i18n.t('common.delete'),
          value: 'delete'
        }
      ],
      editedIndex: -1
    }
  },
  computed: {
    ...mapGetters('Coupon', ['getCouponList', 'getFilter', 'getLastPage']),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('common.create')
        : this.$i18n.t('common.update')
    }
  },

  methods: {
    ...mapActions('Coupon', [
      'fetchCoupons',
      'postCoupon',
      'updateCoupon',
      'changeCouponStatus',
      'deleteCoupon'
    ]),
    ...mapMutations('Coupon', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    editItem(item) {
      this.editedIndex = 500
      this.id = item.id
      this.NameEn = item.nameEn
      this.NameAr = item.nameAr
      this.Code = item.code
      this.Discount = item.discount
      this.PercentDiscount = item.percentDiscount
      this.MaxDiscount = item.maxDiscount
      this.dialog = true
    },
    resetCoupon(){
      this.coupon = {
        id: '',
        NameEn: '',
        NameAr: '',
        Code: '',
        Discount: '',
        PercentDiscount: '',
        MaxDiscount: '',
        StartAt: '',
      };
    },
    close() {
      this.dialog = false
      this.resetCoupon();
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editCoupon()
      } else {
        this.addCoupon()
      }
      this.close()
    },
    addCoupon() {
      this.postCoupon(this.coupon).then(() => {
        this.resetCoupon();
        this.fetchCoupons()
      })
    },
    editCoupon() {
      this.updateCoupon(this.coupon).then(() => {
        this.resetCoupon();
        this.fetchCoupons()
      })
    },

    blockUser(id) {
      this.changeCouponStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeCouponStatus({
        id: id,
        status: true
      })
    },
    deleteThisCoupon(id) {
      this.deleteCoupon(id).then(() => {
        this.fetchCoupons()
      })
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.PageNumber) {
          await this.$router.replace({
            query: { ...route.query, PageNumber: 1 }
          })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('Coupon/fetchCoupons', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    },
    radios(from, to){
      if(to == "Discount"){
        this.coupon.PercentDiscount = '';
      }
      if(to == "PercentDiscount"){
        this.coupon.Discount = '';
      }
    }
  },
  mounted() {
    this.page = Number(this.$route.query.PageNumber)
  }
}
</script>