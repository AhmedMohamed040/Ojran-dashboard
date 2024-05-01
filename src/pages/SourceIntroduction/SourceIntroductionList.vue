<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">
          {{ $t('SourceIntroduction.sourceIntroductionTypes') }}
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
        :items="getRequestTypesList"
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
                  @input="fetchRequestTypes(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchRequestTypes(searchFilter)
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
                    {{ $t('SourceIntroduction.createSourceIntroduction') }}
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
          <v-dialog transition="dialog-top-transition" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" icon v-bind="attrs" v-on="on">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar color="red" dark>{{
                  $t('SourceIntroduction.deleteSourceIntroduction')
                }}</v-toolbar>
                <v-card-text>
                  <h4 class="my-3 red--text">
                    {{
                      $t(
                        'SourceIntroduction.AreYouSureYouWantToDeleteThisSourceIntroduction'
                      )
                    }}
                  </h4>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    color="red"
                    dark
                    @click="
                      deleteThisRequestType(item.id), (dialog.value = false)
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
      page: this.getFilter,
      id: '',
      NameEn: '',
      NameAr: '',
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.RequestTypes'),
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
    ...mapGetters('SourceIntroduction', [
      'getRequestTypesList',
      'getFilter',
      'getLastPage'
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('SourceIntroduction.createSourceIntroduction')
        : this.$i18n.t('SourceIntroduction.updateSourceIntroduction')
    }
  },

  methods: {
    ...mapActions('SourceIntroduction', [
      'fetchRequestTypes',
      'postRequestType',
      'updateRequestType',
      'changeRequestTypeStatus',
      'deleteRequestType'
    ]),
    ...mapMutations('SourceIntroduction', ['setFilter']),
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
      this.NameEn = ''
      this.NameAr = ''
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editRequestType()
      } else {
        this.addRequestType()
      }
      this.close()
    },
    addRequestType() {
      this.postRequestType({
        NameEn: this.NameEn,
        NameAr: this.NameAr
      }).then(() => {
        this.NameEn = ''
        this.NameAr = ''
        this.fetchRequestTypes()
      })
    },
    editRequestType() {
      this.updateRequestType({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr
      }).then(() => {
        this.NameEn = ''
        this.NameAr = ''
        this.fetchRequestTypes()
      })
    },

    blockUser(id) {
      this.changeRequestTypeStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeRequestTypeStatus({
        id: id,
        status: true
      })
    },
    deleteThisRequestType(id) {
      this.deleteRequestType(id).then(() => {
        this.fetchRequestTypes()
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
          .dispatch('SourceIntroduction/fetchRequestTypes', route.query)
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
