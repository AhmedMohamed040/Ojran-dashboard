<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('geography.cities') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="getCitiesList"
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
                @input="fetchCities(searchFilter)"
              ></v-text-field>
              <v-btn
                color="primary"
                class="mx-2"
                @click="
                  searchFilter = {
                    searchString: ''
                  }
                  fetchCities(searchFilter)
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
                  {{ $t('geography.createCity') }}
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
                        <Countries
                          :country-id="CountryId"
                          @SelectCountryId="CountryId = $event"
                        ></Countries>
                      </v-col>
                      <v-col cols="12" md="4">
                        <Regions
                          :disabled="CountryId ? false : true"
                          :country-id="CountryId"
                          :region-id="RegionId"
                          @SelectRegionId="RegionId = $event"
                        ></Regions>
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
    <!--   <template v-slot:item.isActive="{ item }">
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
      </template> -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
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
                $t('geography.deleteCity')
              }}</v-toolbar>
              <v-card-text>
                <h4 class="my-3 red--text">
                  {{ $t('geography.AreYouSureYouWantToDeleteThisCity') }}
                </h4>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="red"
                  dark
                  @click="deleteThisCity(item.id), (dialog.value = false)"
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
import CopyLabel from '../../components/common/CopyLabel'
import Countries from '../../components/Geography/Countries.vue'
import Regions from '../../components/Geography/Region.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CopyLabel,
    Countries,
    Regions
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      dialogDelete: false,
      page: this.getFilter,
      id: '',
      NameEn: '',
      NameAr: '',
      CountryId: '',
      RegionId: '',
      breadcrumbs: [
        {
          text: this.$i18n.t('geography.cities'),
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
       /*  {
          text: this.$i18n.t('common.stutas'),
          value: 'isActive'
        }, */
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
    ...mapGetters('GeographyCrud', ['getCitiesList']),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('geography.createCity')
        : this.$i18n.t('geography.updateCity')
    }
  },

  methods: {
    ...mapActions('GeographyCrud', [
      'fetchCities',
      'postCity',
      'updateCity',
      'changeCityStatus',
      'deleteCity'
    ]),
    editItem(item) {
      this.editedIndex = 500
      this.id = item.id
      this.NameEn = item.nameEn
      this.NameAr = item.nameAr
      this.CountryId = item.countryId
      this.RegionId = item.regionId
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.NameEn = ''
      this.NameAr = ''
      this.CountryId = ''
      this.RegionId = ''
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        this.editCity()
      } else {
        this.addCity()
      }
      this.close()
    },
    addCity() {
      this.postCity({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        CountryId: this.CountryId,
        RegionId: this.RegionId
      }).then(() => {
        this.isLoading = true
        this.fetchCities()
        this.isLoading = false
        this.NameEn = ''
        this.NameAr = ''
        this.CountryId = ''
        this.RegionId = ''
      })
    },
    editCity() {
      this.updateCity({
        id: this.id,
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        CountryId: this.CountryId,
        RegionId: this.RegionId
      }).then(() => {
        this.fetchCities()
        this.NameEn = ''
        this.NameAr = ''
        this.CountryId = ''
        this.RegionId = ''
      })
    },

    blockUser(id) {
      this.changeCityStatus({
        id: id,
        status: false
      })
    },
    unblockUser(id) {
      this.changeCityStatus({
        id: id,
        status: true
      })
    },
    deleteThisCity(id) {
      this.deleteCity(id).then(() => {
        this.fetchCities()
      })
    }
  },
  mounted() {
    this.isLoading = true
    this.fetchCities().then(() => {
      this.isLoading = false
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
  opacity: 0;
}
</style>
