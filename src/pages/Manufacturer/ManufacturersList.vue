<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Manufacturers') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getManufacturersList"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
        centered
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
                  @input="fetchManufacturers(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchManufacturers(searchFilter)
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
                    {{ $t('Manufacturers.createManufacturer') }}
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
                            v-model="NameEn"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInEnglish')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="NameAr"
                            outlined
                            hint="Accept only Character"
                            :label="$t('common.nameInArabic')"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            v-model="Image"
                            prepend-icon="mdi-camera"
                            outlined
                            :label="$t('Categories.photo')"
                          ></v-file-input>
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
                      :loading="isLoading"
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
        <template v-slot:item.imageUrl="{ item }">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            clas
            width="77"
            class="elevation-1"
            alt="User"
            style="border-radius: 5px"
          />
          <img
            v-else
            src="/images/avatars/avatar1.svg"
            class="my-2"
            style="max-width: 90px;"
          />
        </template>
        <template v-slot:item.isFeatured="{ item }">
        <v-switch
          v-if="item.isFeatured === false"
          v-model="item.isFeatured"
          color="grey lighten-1"
          inset
          @change="unFeatured(item.id)"
          ></v-switch>
          
          <v-switch
          v-if="item.isFeatured === true"
          v-model="item.isFeatured"
          color="yellow darken-3"
          inset
          @change="featured(item.id)"
        ></v-switch>
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
                  $t('Manufacturers.deleteManufacturer')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{
                      $t(
                        'Manufacturers.AreYouSureYouWantToDeleteThisManufacturer'
                      )
                    }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    :loading="isLoading"
                    @click="
                      deleteThisManufacturer(item.id, dialog)
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
      Image: null,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Manufacturers'),
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
          align: 'center',
          text: this.$i18n.t('Categories.photo'),
          value: 'imageUrl'
        },
        {
          align: 'center',

          text: this.$i18n.t('common.nameInEnglish'),
          value: 'nameEn'
        },
        {
          text: this.$i18n.t('common.nameInArabic'),
          value: 'nameAr',
          align: 'center'
        },
        {
          text: this.$i18n.t('common.brandsFeature'),
          value: 'isFeatured'
        },
        {
          text: this.$i18n.t('Product.totalItems'),
          value: 'productsCount',
          align: 'center'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive',
          align: 'center'
        },
        {
          text: this.$i18n.t('common.edit'),
          value: 'actions',
          align: 'center'
        },
        {
          text: this.$i18n.t('common.delete'),
          value: 'delete',
          align: 'center'
        }
      ],
      editedIndex: -1
    }
  },
  computed: {
    ...mapGetters('Manufacturers', [
      'getManufacturersList',
      'getFilter',
      'getLastPage'
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('Manufacturers.createManufacturer')
        : this.$i18n.t('Manufacturers.updateManufacturer')
    }
  },

  methods: {
    ...mapActions('Manufacturers', [
      'fetchManufacturers',
      'postManufacturer',
      'updateManufacturer',
      'changeManufacturerStatus',
      'changeManufacturerFeature',
      'deleteManufacturer'
    ]),
    ...mapMutations('Manufacturers', ['setFilter']),
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
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.NameEn = null
      this.NameAr = null
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editManufacturer()
      } else {
        this.addManufacturer()
      }
    },
    addManufacturer() {
      this.isLoading = true
      this.postManufacturer({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image
      }).then(() => {
        this.NameEn = null
        this.NameAr = null
        this.Image = null
        this.fetchManufacturers()
        this.isLoading = false
        this.close()
      })
    },
    editManufacturer() {
      this.isLoading = true
      this.updateManufacturer({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image
      }).then(() => {
        this.NameEn = null
        this.NameAr = null
        this.Image = null
        this.fetchManufacturers()
        this.isLoading = false
        this.close()
      })
    },
    unFeatured(id) {
      this.changeManufacturerFeature({
        UserId: id,
        isFeatured: true
        
      })
    },
    featured(id) {
      this.changeManufacturerFeature({
        UserId: id,
        isFeatured: false
    
      })
    },
    blockUser(id) {
      this.changeManufacturerStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeManufacturerStatus({
        id: id,
        status: true
      })
    },
    deleteThisManufacturer(id, d) {
      this.isLoading = true
      this.deleteManufacturer(id).then(() => {
        this.fetchManufacturers()
        this.isLoading = false
        d.value = false
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
          .dispatch('Manufacturers/fetchManufacturers', route.query)
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
  opacity: 0;
}
</style>
