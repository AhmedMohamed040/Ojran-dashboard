<template>
  <div>
    <v-card>

      <v-list three-line dense class="justify-center">

        <v-card-title class="mr-1 font-weight-medium justify-space-between">{{ $t('profile.notififcations') }}
          <v-btn class="mr-0 text-subtitle-2" color="primary" elevation="0" @click="readAll()">{{ $t('notififcations.readAll') }}</v-btn>

        </v-card-title>
        <div v-if="loading" class="loading">
          <loading />
        </div>
        <div v-if="!loading">
          <v-progress-linear v-if="progressing >= 25 && progressing < 100 ? true : false" absolute :value="progressing"></v-progress-linear>

          <div v-for="(item, index) in notificationsList" :key="index">
            <v-divider v-if="index > 0 && index < items.length" inset></v-divider>
            <v-list-item
              :class="{ 'blue': !item.read, 'lighten-5': !item.read }"
              @click="notificationRead(item.id); goNotificaton(item)"
            >
              <v-list-item-avatar size="45" class="align-self-center " color="blue">
                <v-icon dark dense>{{ icon }}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1" v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle class="caption text-subtitle-2" v-text="item.text"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class=" ml-3 align-center">
                <v-list-item-action-text>{{ $moment(item.createdAt).format('DD-MM-YYYY') }} <br> {{ $moment(item.createdAt).format('HH:mm:ss') }}</v-list-item-action-text>
                <v-btn class="mt-1 text-subtitle-2" elevation="0" @click.stop="notificationRead(item.id)">{{ $t('notififcations.read')
                }}</v-btn>
              </v-list-item-action>
            </v-list-item>
          </div>
        </div>

      </v-list>
    </v-card>

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
</template>

<script>

import loading from '@/components/common/loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    loading
  },
  data() {
    return {
      isLoading: false,
      loading: true,
      progressing: 0,
      hide: false,
      page: this.getFilter,
      items: [],
      icon: 'mdi-email-outline',
      iconColor: 'primary'
    }
  },
  computed: {
    ...mapGetters('Info', ['getNotifications', 'getFilter', 'getLastPage']),
    notificationsList() {
      return this.getNotifications
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
        this.$store.dispatch('Info/allNotifications', route.query).then(() => {
          this.loading = false
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.theNotifications()
    this.page = Number(this.$route.query.PageNumber)

  },
  methods: {
    ...mapActions('Info', ['allNotifications', 'changeNotificationStatus', 'changeNotificationsStatus']),
    ...mapMutations('Info', ['setFilter']),

    handlingRoute(event) {
      if (this.$route.path != `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },

    notificationRead(id) {
      this.progressing = 25

      this.changeNotificationStatus({
        id: id,
        read: true
      }).then(() => {
        this.progressing = 50
        this.allNotifications()
        this.progressing = 99
        setTimeout(() => {
          this.progressing = 100
        }, 300)
      })
    },

    notificationNotRead(id) {
      this.progressing = 25
      this.changeNotificationStatus({
        id: id,
        read: false
      }).then(() => {
        this.progressing = 50
        this.allNotifications()
        this.progressing = 99
        setTimeout(() => {
          this.progressing = 100
        }, 300)
      })
    },

    theNotifications() {
      this.allNotifications()
    },

    readAll() {
      this.progressing = 25
      this.changeNotificationsStatus()
      this.progressing = 50
      this.theNotifications()
      this.progressing = 99
      this.progressing = 100
    },
    goNotificaton(item) {
      //window.location.href = "https://google.com/contact";
      if (item.type == 'Order') {
        this.$router.replace({
          name: 'details-of-order',
          params: { orderId: item.url }
        }).catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error
          }
        })
      } if (item.type == 'WorkPlan') {
        this.router.replace({
          name: 'Workplan-agents',
          params: { id: item.url }
        }).catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error
          }
        })
      } if (item.type == 'PriceCategory') {
        this.router.replace({
          name: 'PriceCategories-list'
        }).catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error
          }
        })
      }

    }

  }
}
</script>
