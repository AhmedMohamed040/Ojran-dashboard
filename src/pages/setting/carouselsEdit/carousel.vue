<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.carouselEdit') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="getCarouselsList"
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
                  @input="fetchCarousels(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchCarousels(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>

            </div>

          </v-toolbar>
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-switch
            v-if="item.isActive === false"
            v-model="item.isActive"
            inset
            @change="onCarousel(item.id)"
          ></v-switch>

          <v-switch
            v-if="item.isActive === true"
            v-model="item.isActive"
            inset
            @change="offCarousel(item.id)"
          ></v-switch>
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
                  <div class="Product_images my-5 d-flex flex-row flex-wrap" >
                    <div
                      v-for="img in item.images"
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
                          photo_id = img.id;
                          deleteThisPhoto(photo_id, item.images)
                        "
                      >x</span>
                    </div>
                  </div>
                  <v-divider></v-divider>
                  <div>
                    <p class="font-weight-regular">
                      {{ $t('carousels.preferUploading') }}
                    </p>
                  </div>
                  <div class="photo_content add_img">
                    <v-file-input
                      v-model="carouselImages"
                      class="add_img_btn"
                      :prepend-icon="
                        carouselImages != null
                          ? 'mdi-camera primary'
                          : 'mdi-camera'
                      "
                      hide-input
                      multiple
                      @change="carousel_id = item.id"
                    ></v-file-input>
                    <div v-if="carouselImages != null">
                      <v-btn :loading="uploadingImage" @click="addPhoto()"> {{ $t("image.upload") }}</v-btn>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="dialog.value = false;(photo_id = null), (deletePhoto = false)"
                  >{{ $t('common.cancel') }}</v-btn>
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

import CopyLabel from '@/components/common/CopyLabel'
import loading from '@/components/common/loading'
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

      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      dialogDelete: false,
      deletePhoto: false,
      uploadingImage: false,
      photo_id: null,
      carousel_id: null,
      page: this.getFilter,
      carouselImages: null,
      searchFilter: {
        searchString: ''
      },
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('menu.carouselEdit')
        }
      ],
      headers: [

        {
          text: this.$i18n.t('carousels.name'),
          value: 'name'
        },

        {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        },

        {
          text: this.$i18n.t('carousels.editImages'),
          value: 'gallery'
        }

      ]
    }
  },
  computed: {
    ...mapGetters('Carousels', ['getCarouselsList', 'getFilter', 'getLastPage'])
  },

  methods: {
    ...mapActions('Carousels', [
      'fetchCarousels',
      'changeCarouselStatus',
      'deleteCarouselimages',
      'addCarouselimages'

    ]),
    ...mapMutations('Carousels', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },

    offCarousel(id) {
      this.changeCarouselStatus({
        id: id,
        status: false
      }).then((res) => {
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },
    onCarousel(id) {
      this.changeCarouselStatus({
        id: id,
        status: true
      }).then((res) => {
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      })
    },
    deleteThisPhoto(id, item) {
      this.deleteCarouselimages(id)
        .then((res) => {
          item.splice(
            item.findIndex((a) => a.id === id),
            1
          )
          if (res.statusCode == 200 || res.status == 200) {
            this.snackbar = true
          }

        }).catch((err) => {
          if (err.name == 'AxiosError') {
            this.error = true
          }
        })
        .finally(() => {
          this.fetchCarousels()
        })
    },
    async addPhoto() {
      this.uploadingImage = true
      await this.addCarouselimages({
        id: this.carousel_id,
        images: this.carouselImages
      }).then((res) => {
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      }) .finally(() => {
        this.uploadingImage = false
        this.fetchCarousels()
        this.carouselImages = null
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
        this.$store.dispatch('Carousels/fetchCarousels', route.query).then(() => {
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
