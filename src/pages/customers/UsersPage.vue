<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('menu.customers') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/employees/create">
        {{ $t('users.createCustomer') }}
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
        :items="getModeratorsList"
        item-key="id"
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
                  @input="fetchModerators(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchModerators(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>  
              </div>
            </div>
          
          </v-toolbar>
        </template>
        <template v-slot:item.profileImage="{ item }">
          <img
            v-if="item.profileImage"
            :src="item.profileImage"
            class="elevation-1"
            alt="User"
            style="border-radius: 50%"
          />
          <v-img
            v-else
            src="/images/avatars/avatar1.svg"
            max-width="70"
            class="my-2"
          >
          </v-img>
        </template>
        <template v-slot:item.name="{ item }">
          <span class="moderators">{{ item.name }}</span>
        </template>
        <template v-slot:item.userName="{ item }">
          <span class="moderators">{{ item.userName }}</span>
        </template>
        <template v-slot:item.phoneNumber="{ item }">
          <span v-if="item.phone" class="moderators">{{ item.phone }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:item.email="{ item }">
          <span v-if="item.email" class="moderators">{{ item.email }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:item.Details="{ item }">
          <v-btn
            :to="{
              name: 'customers-edit',
              params: { singlecustomer_id: item.id }
            }"
            depressed
            height="45"
            class="my-5"
            dark
            color="red lighten-2"
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
      page: this.getCurr_page,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.customers'),
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
          text: this.$i18n.t('users.profileImage'),
          value: 'profileImage'
        },
        {
          text: this.$i18n.t('users.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('users.userName'),
          value: 'userName'
        },
        {
          text: this.$i18n.t('users.phoneNumber'),
          value: 'phoneNumber'
        },
        {
          text: this.$i18n.t('users.email'),
          value: 'email'
        },

        {
          text: this.$i18n.t('common.details'),
          value: 'Details'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Moderators', [
      'getModeratorsList',
      'getFilter',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('Moderators', ['fetchModerators']),
    ...mapMutations('Moderators', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path != `?page=${event}`) {
        this.$router.push(`?page=${event}`)
      }
    }
  },
  watch: {
    $route: {
      async handler(route) {
        if (!route.query.page) {
          await this.$router.replace({ query: { ...route.query, page: 1 } })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('Moderators/fetchModerators', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.page = Number(this.$route.query.page)
  }
}
</script>

<style lang="scss" scoped></style>
