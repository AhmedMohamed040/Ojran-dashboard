<template>
  <div>
    <div class="d-flex">
      <v-btn
        color="primary"
        class="my-3 mx-auto"
        :to="{
          name: 'SubCategories-Create',
          params: { ParentCategoryId: ParentCategoryId }
        }"
      >
        {{ $t('Categories.createSubCategory') }}
      </v-btn>
    </div>

    <v-data-table
      dense
      :loading="isLoading"
      :headers="headers"
      :items="response"
      item-key="id"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-1 mb-2"
    >
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
      <template v-slot:item.actions="{item}">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ attrs }">

            <v-icon small class="pa-1" v-bind="attrs" @click="open(item)" > mdi-pencil </v-icon>

          </template>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="text-h5">{{ $t('Categories.updateCategory') }}</span>
            </v-card-title>

            <v-card-text>
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
                  @click="
                    deleteThisCategory(item.id),
                    dialog.value = false
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
  </div>
</template>

<script>
import axios from '../../../axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    ParentCategoryId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      response: [],
      Image: null,
      NameEn: '',
      NameAr: '',
      id: '',
      dialog: false,
      isLoading: false,
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

      searchQuery: '',
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
    ...mapGetters('Categories', ['getSubCategoriesList', 'getLastPage'])
  },
  methods: {
    ...mapActions('Categories', [
      'fetchSubCategory',
      'ubdateSubCategory',
      'changeCategoryStatus',
      'changeCategoryfeature',
      'deleteCategory'
    ]),
    ...mapMutations('Categories', [
      'setSubCategoryList'
    ]),
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
    blockUser(id) {
      this.changeCategoryStatus({
        UserId: id,
        IsActive: false
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
      this.Image = item.imageUrl
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.NameEn = null
      this.NameAr = null
    },
    save() {
      this.dialog = false
      this.isLoading = true
      this.ubdateSubCategory({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image,
        ParentCategoryId: this.ParentCategoryId
      }).then(() => {

        this.isLoading = false

        this.NameEn = null
        this.NameAr = null
        this.Image = null
        this.fetchSubCategory(this.ParentCategoryId)
      })
    },
    deleteThisCategory(id) {
      this.deleteCategory(id).then(() => {
        this.fetchSubCategory(this.ParentCategoryId)
      })
    }
  },
  mounted() {
    this.isLoading = true
    this.fetchSubCategory(this.ParentCategoryId)
    axios.get(`/api/v1/admin/categories?ParentCategoryId=${this.ParentCategoryId}`)
      .then((response) => {
        this.response = response.data.model
        this.isLoading = false
      })
  },
  destroyed() {
    this.setSubCategoryList([])
  }
}
</script>

<style lang="scss" scoped></style>
