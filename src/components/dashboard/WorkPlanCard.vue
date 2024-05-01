<template>

  <v-card>
    <v-card-title>
      {{ $t('dashboard.workPlans') }}
    </v-card-title>
    <div v-if="loading" class="loading">
      <loading />
    </div>
    <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="workPlans"
      loading-text="جاري تحميل البيانات"
      no-data-text="لا يوجد بيانات"
      hide-default-footer
      disable-filtering
      disable-pagination
      disable-sort
      class="elevation-0"
      :item-class="cursor"
      @click:row="goToPlan"
    >
      <template v-slot:[`item.Period`]="{ item }">
        <div>
          <div>
            <v-icon small>mdi-calendar</v-icon>
            <span>{{ $t('Commission.StartAt') }} :
              {{ item.startDate.substr(0, 10) }}</span>
          </div>
          <div>
            <v-icon small>mdi-calendar</v-icon>
            <span>{{ $t('Commission.EndAt') }} :
              {{ item.endDate.substr(0, 10) }}</span>
          </div>
        </div>
      </template>
      <template v-slot:[`item.workPlanType.target`]="{ item }">
        {{ $t('WorkPlan.' + item.workPlanType.target) }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        {{ $t('WorkPlan.' + item.status) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

import loading from '@/components/common/loading'

import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    loading
  },

  data () {
    return {
      headers: [
        {
          text: this.$i18n.t('common.name'),
          value: 'name'
        },

        {
          text: this.$i18n.t('WorkPlanType.target'),
          value: 'workPlanType.target'
        },
        {
          text: this.$i18n.t('users.Period'),
          value: 'Period'
        },
        {
          text: this.$i18n.t('common.stutas'),
          value: 'status'
        }

      ]
    }
  },
  computed: {
    ...mapGetters('Dashboard', ['getWorkPlans', 'getLoading']),
    workPlans() {

      return this.getWorkPlans
    },
    loading() {
      return this.getLoading
    }
  },
  mounted() {
    this.theWorkPlans()
  },

  methods: {
    ...mapActions('Dashboard', ['fetchWorkPlans']),
    theWorkPlans() {

      this.fetchWorkPlans()
    },
    cursor(item) {
      console.log(item)
      const rowClass = 'cursor'

      return rowClass
    },
    goToPlan(item) {
      console.log(item)
      if (item.acceptStatus === 'Pending' || item.acceptStatus === 'Started') {
        this.$router.push({ name: 'WorkPlans-list' })
      }
      if (item.acceptStatus === 'Accepted' || item.acceptStatus === 'Finished') {
        this.$router.push({ name: 'acceptedWorkPlans-list' })
      }
      if (item.acceptStatus === 'Declined' || item.acceptStatus === 'Rejected') {
        this.$router.push({ name: 'declinedWorkPlans-list' })
      }
    }
  }

}
</script>

<style>
.cursor {
  cursor: pointer;
  border-spacing: 0 0.5rem;

}

</style>
