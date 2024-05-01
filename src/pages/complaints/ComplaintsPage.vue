<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('complaints.complaintsPage') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>


      </div>
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        :headers="headers"
        :items="allComplaints"
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
                  @input="fetchComplaints(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchComplaints(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>

            </div>

          </v-toolbar>
        </template>
        <template v-slot:[`item.Details`]="{ item }">
          <v-btn
            color="primary"
            dark
            class="my-2"
            :to="{
              name: 'complaint-details',
              params: { complaintId: item.id }
            }"
            depressed
          >
            {{ $t('common.details') }}
          </v-btn>
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
      loading: false,
      page: this.getFilter,
      searchFilter: {
        searchString: ''
      },
      complaints: [

      ],
      breadcrumbs: [
        {
          text: this.$i18n.t('complaints.complaints'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('complaints.complaintsPage')
        }
      ],
      headers: [

        {
          text: this.$i18n.t('complaints.fullname'),
          value: 'fullName'
        },

        {
          text: this.$i18n.t('complaints.email'),
          value: 'email'
        },

        {
          text: this.$i18n.t('complaints.phone'),
          value: 'phone'
        },
        {
          text: this.$i18n.t('complaints.details'),
          value: 'Details'
        }

      ]
    }
  },
  computed: {
    ...mapGetters('Complaints', ['getComplaints', 'getFilter', 'getLastPage']),
    allComplaints() {
      // .concat(this.getComplaints, this.getComplaints, this.getComplaints, this.getComplaints, this.getComplaints)
     return this.getComplaints
    }

  },

  methods: {
    ...mapActions('Complaints', [
      'fetchComplaints'

    ]),
    ...mapMutations('Complaints', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
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
        this.$store.dispatch('Complaints/fetchComplaints', route.query).then(() => {
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
    this.fetchComplaints()
    this.complaints = [...this.getComplaints]
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
