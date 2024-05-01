<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.Products') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getProductsList"
        loading-text="جاري تحميل البيانات"
        no-data-text="لا يوجد بيانات"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        class="elevation-1"
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
                  @input="fetchProducts(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchProducts(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>
              <v-btn
                :to="{
                  name: 'Products-create'
                }"
                color="primary"
                dark
                class="my-2"
              >
                {{ $t('Product.createProduct') }}
              </v-btn>
            </div>

          </v-toolbar>
        </template>
        <template v-slot:[`item.imageUrl`]="{ item }">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            width="77"
            height="77"
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
        <template v-slot:[`item.options`]="{ item }">
          <v-dialog
            v-model="optionsDialog"
            transition="dialog-top-transition"
            max-width="1200"
          >
            <template v-slot:activator="{ attrs }">
              <div class="text-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="my-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ $t('common.options') }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        <v-btn
                          :to="{ name: 'Edit-Product', params: { editProduct_id: item.id}}"
                          depressed
                          elevation="0"
                        >

                          {{ $t('common.edit') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title >
                        <v-btn
                          :to="{ name: 'single-Product', params: { product_id: item.id}}"
                          depressed
                          elevation="0"
                        >

                          {{ $t('common.details') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-dialog>
        </template>
        <template v-slot:[`item.manageStock`]="{ item }">
          <v-btn
            :to="{
              name: 'manage-stock',
              params: {
                product_id: item.id
              }
            }"
            text
            height="45"
          >
            <v-icon> mdi-warehouse mdi-36px </v-icon>
          </v-btn>
        </template>
        <template v-slot:[`item.gallery`]="{ item }">
          <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon v-bind="attrs" v-on="on">
                <v-icon>mdi-image </v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="primary" dark>{{
                  $t('Product.gallery')
                }}</v-toolbar>
                <v-card-text>
                  <div class="Product_images my-5">
                    <div
                      v-for="img in item.productImages"
                      :key="img.id"
                      class="single_img photo_content"
                    >
                      <v-img
                        :src="img.imageUrl"
                        width="97"
                        height="97"
                        class="mx-2"
                      ></v-img>
                      <span
                        class="delete_img"
                        @click="
                          deletePhoto = true
                          photo_id = img.id
                        "
                      >x</span>
                    </div>
                  </div>
                  <div v-if="deletePhoto" class="my-3">
                    <v-btn
                      @click="
                        deleteThisPhoto(photo_id, item.productImages)
                        deletePhoto = false
                      "
                    >{{ $t("image.delete") }}<v-icon color="red" dark>delete</v-icon></v-btn>
                  </div>
                  <v-divider></v-divider>

                  <div class="photo_content add_img">
                    <v-file-input
                      v-model="ProductImages"
                      class="add_img_btn"
                      :prepend-icon="
                        ProductImages != null
                          ? 'mdi-camera primary'
                          : 'mdi-camera'
                      "
                      hide-input
                      multiple
                      @change="Product_id = item.id"
                    ></v-file-input>
                    <div v-if="ProductImages != null">
                      <v-btn :loading="uploadingImage" @click="addPhoto()"> {{ $t("image.upload") }}</v-btn>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="
                      dialog.value = false
                      ;(photo_id = null), (deletePhoto = false)
                    "
                  >{{ $t('common.cancel') }}</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
                  $t('Product.deleteProduct')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{ $t('Product.AreYouSureYouWantToDeleteThisProduct') }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    :loading="isLoading"
                    @click="deleteThisProduct(item.id, dialog)"
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
      optionsDialog: false,
      loading: true,
      dialog: false,
      dialogDelete: false,
      deletePhoto: false,
      uploadingImage: false,
      photo_id: null,
      Product_id: null,
      page: this.getFilter,
      ProductImages: null,
      searchFilter: {
        searchString: ''
      },
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.Products'),
          disabled: false,
          to: '/Products'
        },
        {
          text: this.$i18n.t('menu.usersList')
        }
      ],
      headers: [
        {
          text: this.$i18n.t('SKU'),
          value: 'code'
        },
        {
          text: this.$i18n.t('Product.productImage'),
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
          text: this.$i18n.t('Product.price'),
          value: 'defaultPrice'
        },
        {
          text: this.$i18n.t('Product.quantity'),
          value: 'quantity'
        },
        {
          text: this.$i18n.t('Product.relatedQuantity'),
          value: 'relatedQuantity'
        },
        {
          text: this.$i18n.t('Product.category'),
          value: 'category.name'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },
        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        },
        {
          text: this.$i18n.t('Product.manageStock'),
          value: 'manageStock'
        },
        {
          text: this.$i18n.t('Product.productimages'),
          value: 'gallery'
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
    ...mapGetters('Product', ['getProductsList', 'getFilter', 'getLastPage'])
  },

  methods: {
    ...mapActions('Product', [
      'fetchProducts',
      'changeProductStatus',
      'deleteProduct',
      'delete_product_image',
      'add_product_image'
    ]),
    ...mapMutations('Product', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },

    blockUser(id) {
      this.changeProductStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeProductStatus({
        id: id,
        status: true
      })
    },
    deleteThisProduct(id, d) {
      this.isLoading = true
      this.deleteProduct(id).then(() => {
        this.fetchProducts()
      })
      this.isLoading = false
      d.value = false
    },
    deleteThisPhoto(id, item) {
      this.delete_product_image(id)
        .then(() => {
          item.splice(
            item.findIndex((a) => a.id === id),
            1
          )
        })
        .then(() => {
          this.fetchProducts()
        })
    },
    async addPhoto() {
      this.uploadingImage = true
      await this.add_product_image({
        id: this.Product_id,
        productImages: this.ProductImages
      })
      this.uploadingImage = false
      this.fetchProducts()
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
        this.$store.dispatch('Product/fetchProducts', route.query).then(() => {
          this.loading = false
        })
      },
      deep: true,
      immediate: true
    },
    searchFilter: {
      handler(searchFilter) {
        if (searchFilter.searchString == null)
          this.searchFilter.searchString = ''
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
.single_img {
  position: relative;
  margin: 10px;
}
.delete_img {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 500;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}
.add_img {
  width: 100px;
  height: 100px;
  position: relative;
}
.add_img_btn {
  position: absolute;
  top: 25%;
  left: 30%;
}
</style>
