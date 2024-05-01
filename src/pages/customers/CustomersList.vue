<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">{{ $t('customers.customers') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <!--    <v-spacer></v-spacer>
      <v-btn color="primary" to="/employees/create">
        {{ $t('users.createCustomer') }}
      </v-btn> -->
    </div>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <div v-if="!loading">
      <v-data-table
        dense
        :loading="isLoading"
        :headers="headers"
        :items="getCustomers"
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
                  @input="fetchCustomers(searchFilter)"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="mx-2"
                  @click="
                    searchFilter = {
                      searchString: ''
                    }
                    fetchCustomers(searchFilter)
                  "
                >
                  {{ $t('common.showAll') }}
                </v-btn>
              </div>
            </div>

          </v-toolbar>
        </template>
        <!--   <template v-slot:item.profileImage="{ item }">
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
        </template> -->
        <template v-slot:item.name="{ item }">
          <span class="moderators">{{ item.name }}</span>
        </template>
        <template v-slot:item.userName="{ item }">
          <span class="moderators">{{ item.userName }}</span>
        </template>
        <template v-slot:item.phone="{ item }">
          <span v-if="item.phone" class="moderators">{{ item.phone }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:item.email="{ item }">
          <span v-if="item.email" class="moderators">{{ item.email }}</span>
          <span v-else class="moderators">----</span>
        </template>
        <template v-slot:[`item.options`]="{ item }">

          <div class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  class="my-2"
                  v-on="on"
                >
                  {{ $t('common.options') }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(option, index) in optionsList"
                  :key="index"
                  style="cursor: pointer"
                  @click="optionsClick(item, index)"
                >
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>

      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination
                  v-model="PageNumber"
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
      PageNumber: this.getCurr_page,
      optionsList: [
        this.$i18n.t('Bills.bills'),
        this.$i18n.t('common.details')
      ],
      breadcrumbs: [
        {
          text: this.$i18n.t('customers.customers'),
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
          text: this.$i18n.t('users.name'),
          value: 'name'
        },
        {
          text: this.$i18n.t('users.userName'),
          value: 'userName'
        },
        {
          text: this.$i18n.t('users.phoneNumber'),
          value: 'phone'
        },
        {
          text: this.$i18n.t('users.email'),
          value: 'email'
        },

        {
          text: this.$i18n.t('common.options'),
          value: 'options'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Moderators', [
      'getCustomers',
      'getFilter',
      'getLastPage'
    ])
  },

  methods: {
    ...mapActions('Moderators', ['fetchCustomers']),
    ...mapMutations('Moderators', ['setFilter']),
    optionsClick(item, index) {
      if (index === 0) {
        console.log(item.id);
        this.$router.push({ name:'customers-bills', params:{ singlecustomer_id: item.id } })

      } else {
        this.$router.push({ name:'customers-edit', params:{ singlecustomer_id: item.id } })
      }
    },
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
          await this.$router.replace({ query: { ...route.query, PageNumber: 1 } })

          return
        }
        this.setFilter({ ...route.query })
        this.$store
          .dispatch('Moderators/fetchCustomers', route.query)
          .then(() => {
            this.loading = false
          })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.PageNumber = Number(this.$route.query.PageNumber)
  }
}
</script>

<style lang="scss" scoped></style>
