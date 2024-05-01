<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Categories') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/Categories/create">
        {{ $t('Categories.createCategory') }}
      </v-btn>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        dense
        :loading="isLoading"
        :headers="headers"
        :items="getCategoriesList"
        item-key="id"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
        :single-expand="false"
        :expanded.sync="expanded"
        show-expand
      >
        <template v-slot:top>
          <v-toolbar text>
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
                  @input="fetchCategories(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchCategories(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>  
              </div>
            </div>
          
          </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <subCategories :key="item.id" :parent-category-id="item.id" />
          </td>

        </template>
        <template v-slot:item.imageUrl="{ item }">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            width="77"
            class="elevation-1"
            alt="User"
            style="border-radius: 5px"
          />
          <v-img
            v-else
            src="/images/avatars/avatar1.svg"
            max-width="70"
            class="my-2"
          >
          </v-img>
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
          <v-dialog max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="pa-1"
                v-bind="attrs"
                v-on="on"
                @click="open(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title class="primary white--text">
                  <span class="text-h5">{{
                    $t('Categories.updateCategory')
                  }}</span>
                </v-card-title>
                <v-card-text class="mt-4">
                  <v-container>
                    <v-row>
                      <v-col cols="12">

                        <v-text-field
                          v-model="NameEn"
                          hint="Accept only Character"
                          label="Name in English"
                        ></v-text-field>
                        <v-text-field
                          v-model="NameAr"
                          hint="Accept only Character"
                          label="الاسم  بالعربية"
                        ></v-text-field>
                        <v-file-input
                          v-model="Image"
                          prepend-icon="mdi-camera"
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
                    @click="save(dialog)"
                  >
                    {{ $t('common.save') }}
                  </v-btn>

                  <v-btn
                    color="red darken-1"
                    dark
                    class="my-2 mx-2 px-3 py-3"
                    @click="close(dialog)"
                  >
                    {{ $t('common.cancel') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-dialog max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('Categories.deleteCategory')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{ $t('Categories.AreYouSureYouWantToDeleteThisCategory') }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    :loading="isLoadingDelete"
                    @click="deleteThisCategory(item.id)"
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
import subCategories from './EditUser/subCategories'
import swal from 'sweetalert'
import i18n from '../../plugins/vue-i18n'
import loading from '../../components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    subCategories,
    loading
  },
  data() {
    return {
      expanded: [],
      Image: null,
      NameEn: '',
      NameAr: '',
      id: '',
      dialog: false,
      isLoading: false,
      isLoadingDelete: false,
      loading: true,
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Categories'),
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
      selectedUsers: [],
      headers: [
        {
          text: this.$i18n.t('Categories.photo'),
          value: 'imageUrl'
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
          text: this.$i18n.t('common.feature'),
          value: 'isFeatured'
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
      ]
    }
  },
  computed: {
    ...mapGetters('Categories', [
      'getCategoriesList',
      'getFilter',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('Categories', [
      'fetchCategories',
      'changeCategoryStatus',
      'ubdateCategory',
      'changeCategoryfeature',
      'deleteCategory'
    ]),
    ...mapMutations('Categories', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    blockUser(id) {
      this.changeCategoryStatus({
        UserId: id,
        IsActive: false
      })
    },
    unFeatured(id) {
      this.changeCategoryfeature({
        UserId: id,
        isFeatured: true
        
      })
    },
    featured(id) {
      this.changeCategoryfeature({
        UserId: id,
        isFeatured: false
    
      })
    },
    unblockUser(id) {
      this.changeCategoryStatus({
        UserId: id,
        IsActive: true
      })
    },
    open(item) {
      this.id = item.id
      this.NameEn = item.nameEn
      this.NameAr = item.nameAr
      this.dialog = true
    },
    close(d) {
      d.value = false
      this.NameEn = null
      this.NameAr = null
    },
    save(d) {
      this.dialog = false
      this.isLoading = true
      this.ubdateCategory({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image
      }).then(() => {
        this.NameEn = null
        this.NameAr = null
        this.Image = null
        d.value = false
        this.isLoading = false
        this.fetchCategories()
      })

    },
    deleteThisCategory(id) {
      this.isLoadingDelete = true
      this.deleteCategory(id)
        .then((response) => {
          swal(
            i18n.t('Categories.categoryDeletedSuccessfully'),
            response.data.message,
            'success'
          )
          this.dialog = false
          this.isLoadingDelete = false
          this.fetchCategories()
        }).catch((err) => {
          console.log(err)
          // swal(
          //   i18n.t('Categories.categoryDeletedSuccessfully'),
          //   err.data.message,
          //   'success'
          // )
          this.dialog = false
          this.isLoadingDelete = false
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
          .dispatch('Categories/fetchCategories', route.query)
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

<style lang="scss" scoped></style>
