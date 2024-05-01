<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-badge
        bordered
        :content="String(notificationsCount)"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-on="on">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-list three-line dense max-width="400" min-width="400">
        <v-subheader class="pa-2 font-weight-bold">{{ $t('profile.notififcations') }}</v-subheader>
        <div v-for="(item, index) in notifications" :key="index">
          <v-divider v-if="index > 0 && index < items.length" inset></v-divider>

          <v-list-item
            :class="{ 'blue': !item.read, 'lighten-5': !item.read }"
            @click="goNotificaton(item); notificationRead(item.id)"
          >
            <v-list-item-avatar size="32" :color="iconColor">
              <v-icon dark small>{{ icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <v-list-item-subtitle class="caption" v-text="item.text"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="align-self-center">
              <v-list-item-action-text>{{ $moment(item.createdAt).format('DD-MM-YYYY') }} <br> {{ $moment(item.createdAt).format('HH:mm:ss') }} </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-list>

      <div class="text-center py-2">
        <v-btn small color="primary" :to="{name: 'notififcations'}">{{ $t('common.showAll') }}</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {

  data() {
    return {

      items: [],
      icon: 'mdi-email-outline',
      iconColor: 'primary'
    }
  },
  computed: {
    ...mapGetters('Info', ['getNotifications']),
    notifications() {
      return this.getNotifications.slice(-4)
    },
    notificationsCount() {

      return this.getNotifications.filter((item)=> item.read == false).length
    }
  },

  mounted() {

    this.items = this.allNotifications()
  },

  methods: {
    ...mapActions('Info', ['allNotifications', 'changeNotificationStatus']),

    theNotifications() {
      this.allNotifications()
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

    goNotificaton(item) {
      //window.location.href = "https://google.com/contact";
      console.log(item.type)
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
          params: { orderId: item.url }
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
