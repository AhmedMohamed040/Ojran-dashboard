<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-row class="flex-grow-0" dense>
      <v-col cols="12" xl="4" class="mb-1">
        <sales-card
        v-if="role == 'Admin'"
          class="h-full"
          style="min-height: 380px"
          :value="1837.32"
          :percentage="3.2"
          :loading="isLoading1"
          :percentage-label="$t('dashboard.lastweek')"
          :action-label="$t('dashboard.viewReport')"
        ></sales-card>
        <sales-agent-card
        v-if="role == 'Agentf'"
          class="h-full"
          style="min-height: 380px"
          :value="1837.32"
          :percentage="3.2"
          :loading="isLoading1"
          :percentage-label="$t('dashboard.lastweek')"
          :action-label="$t('dashboard.viewReport')"
        ></sales-agent-card>
      </v-col>

      <v-col cols="12" md="6"  class="mb-1">
        <pending-orders-card
          class="h-full"
          style="min-height: 380px"
          color="#8c9eff"
          :loading="isLoading2"
        ></pending-orders-card>
      </v-col>

      <v-col cols="12" md="6"  class="mb-1">
        <over-due-card v-if="role == 'Admin'" class="h-full"></over-due-card>
        <over-due-card-agent v-if="role == 'Agent'" class="h-full"></over-due-card-agent>
      </v-col>
    </v-row>

    <v-row class="flex-grow-0" dense>
      <v-col cols="12" md="6"   class="mb-1">
        <most-requested-items
          class="h-full"
          style="min-height: 380px"
        >
        </most-requested-items>
      </v-col>
      <v-col cols="12" md="6"  class="mb-1">
        <receipts-card
          v-if="role == 'Admin'"
          class="h-full"
          style="min-height: 380px"
        ></receipts-card>
        <work-plan-card
          v-if="role == 'Agent'"
          class="h-full"
          style="min-height: 380px"
        >
        </work-plan-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
// DEMO Cards for dashboard
import ActivityCard from '../../components/dashboard/ActivityCard'
import PendingOrdersCard from '../../components/dashboard/PendingOrdersCard.vue'
import MostRequestedItems from '../../components/dashboard/MostRequestedItems.vue'
import ReceiptsCard from '../../components/dashboard/ReceiptsCard'
import OverDueCard from '../../components/dashboard/OverDueCard.vue'
import SalesCard from '../../components/dashboard/SalesCard'
import SalesAgentCard from '../../components/dashboard/SalesAgentCard.vue'
import TrackCard from '../../components/dashboard/TrackCard'
import OverDueCardAgent from '../../components/dashboard/OverDueCardAgent'
import TableCard from '../../components/dashboard/TableCard'
import WorkPlanCard from '../../components/dashboard/WorkPlanCard'
import SourcesCard from '../../components/dashboard/SourcesCard'

export default {
  components: {
    SalesCard,
    SalesAgentCard,
    PendingOrdersCard,
    MostRequestedItems,
    OverDueCard,
    ReceiptsCard,
    OverDueCardAgent,
    WorkPlanCard
  },
  data() {
    return {
      role: '',
      loadingInterval: null,

      isLoading1: true,
      isLoading2: true,
      isLoading3: true,
      isLoading4: true,

      ordersSeries: [
        {
          name: 'Orders',
          data: [
            ['2020-02-02', 34],
            ['2020-02-03', 43],
            ['2020-02-04', 40],
            ['2020-02-05', 43]
          ]
        }
      ],

      customersSeries: [
        {
          name: 'Customers',
          data: [
            ['2020-02-02', 13],
            ['2020-02-03', 11],
            ['2020-02-04', 13],
            ['2020-02-05', 12]
          ]
        }
      ]
    }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.isDark
        ? this.$vuetify.theme.defaults.dark
        : this.$vuetify.theme.defaults.light
    }
  },
  mounted() {
    let count = 0

    this.role = localStorage.getItem('role')
    console.log(this.role)
    // DEMO delay for loading graphics
    this.loadingInterval = setInterval(() => {
      this[`isLoading${count++}`] = false
      if (count === 4) this.clear()
    }, 400)
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    clear() {
      clearInterval(this.loadingInterval)
    }
  }
}
</script>
