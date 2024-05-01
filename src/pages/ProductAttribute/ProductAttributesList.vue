<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">
          {{ $t('ProductAttributes.productAttributes') }}
        </div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getProductAttributesList"
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
                  @input="fetchProductAttributes(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchProductAttributes(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>  
              </div>
              <v-dialog v-model="dialog" max-width="700">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="my-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('ProductAttributes.createProductAttribute') }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="primary white--text">
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text class="mt-2">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="NameEn"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInEnglish')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="NameAr"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInArabic')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-textarea
                            v-model="DetailsAr"
                            rows="4"
                            prepend-icon="mdi-pen"
                            outlined
                            :label="$t('common.detailsInArabic')"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-textarea
                            v-model="DetailsEn"
                            rows="4"
                            prepend-icon="mdi-pen"
                            outlined
                            :label="$t('common.detailsInEnglish')"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-checkbox
                            v-model="IsColor"
                            :label="$t('ProductAttributes.isColor')"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-checkbox
                            v-model="IsImage"
                            :label="$t('ProductAttributes.isImage')"
                          ></v-checkbox>
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
        <template v-slot:item.isActive="{ item }">
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
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('ProductAttributes.deleteProductAttribute')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{
                      $t(
                        'ProductAttributes.AreYouSureYouWantToDeleteThisProductAttribute'
                      )
                    }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    @click="
                      deleteThisProductAttribute(item.id),
                      (dialog.value = false)
                    "
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
      isLoading: false,
      loading: true,
      dialog: false,
      dialogDelete: false,
      page: this.getCurr_page,
      id: '',
      NameEn: null,
      NameAr: null,
      DetailsAr: null,
      DetailsEn: null,
      IsColor: false,
      IsImage: false,
      breadcrumbs: [
        {
          text: this.$i18n.t('ProductAttributes.productAttributes'),
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
          text: this.$i18n.t('common.nameInEnglish'),
          value: 'nameEn'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr'
        },
        {
          text: this.$i18n.t('common.detailsInArabic'),
          value: 'detailsAr'
        },
        {
          text: this.$i18n.t('common.detailsInEnglish'),
          value: 'detailsEn'
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
    ...mapGetters('ProductAttributes', [
      'getProductAttributesList',
      'getFilter',
      'getLastPage'
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('ProductAttributes.createProductAttribute')
        : this.$i18n.t('ProductAttributes.updateProductAttribute')
    }
  },

  methods: {
    ...mapActions('ProductAttributes', [
      'fetchProductAttributes',
      'postProductAttribute',
      'updateProductAttribute',
      'changeProductAttributeStatus',
      'deleteProductAttribute'
    ]),
    ...mapMutations('ProductAttributes', ['setFilter']),
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
      this.DetailsAr = item.detailsAr
      this.DetailsEn = item.detailsEn
      this.IsColor = item.isColor
      this.IsImage = item.isImage
      this.dialog = true
    },
    close() {
      this.dialog = false

      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editProductAttribute()
      } else {
        this.addProductAttribute()
      }
      this.close()
    },
    addProductAttribute() {
      this.postProductAttribute({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        DetailsAr: this.DetailsAr,
        DetailsEn: this.DetailsEn,
        IsColor: this.IsColor,
        IsImage: this.IsImage
      }).then(() => {
        this.fetchProductAttributes()
      })
    },
    editProductAttribute() {
      this.updateProductAttribute({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        DetailsAr: this.DetailsAr,
        DetailsEn: this.DetailsEn,
        IsColor: this.IsColor,
        IsImage: this.IsImage
      }).then(() => {
        this.fetchProductAttributes()
      })
    },

    blockUser(id) {
      this.changeProductAttributeStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeProductAttributeStatus({
        id: id,
        status: true
      })
    },
    deleteThisProductAttribute(id) {
      this.deleteProductAttribute(id).then(() => {
        this.fetchProductAttributes()
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
          .dispatch('ProductAttributes/fetchProductAttributes', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.page = Number(this.$route.query.PageNumber)
  }
}
</script>
