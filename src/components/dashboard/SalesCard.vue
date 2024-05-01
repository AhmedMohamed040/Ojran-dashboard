<template>
  <v-card class="d-flex flex-grow-1 primary darken-4" dark>
    <!-- loading spinner -->
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- information -->
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-card-title>
        <div>{{ $t(label) }}</div>
        <v-spacer></v-spacer>
        <!--  <v-btn text color="primary" @click="$emit('action-clicked')">{{
          actionLabel
        }}</v-btn> -->
      </v-card-title>

      <div class="d-flex flex-column flex-grow-1">
        <div class="pa-2">
          <div class="primary--text text--lighten-1 mt-1">
            {{ lastMonth | formatCurrency }} {{ $t('dashboard.lastMonth') }}
          </div>
        </div>

        <v-spacer></v-spacer>

        <div class="px-2 pb-2">
          <div class="title mb-1">{{ $t('dashboard.currentMonth') }}</div>
          <div class="d-flex align-center">
            <div class="text-h4">
              {{ currentMonth | formatCurrency }}
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex flex-column text-right">
              <div class="font-weight-bold">
                <!-- <trend-percent :value="percentage" /> -->
              </div>
              <!--  <div class="caption">{{ percentageLabel }}</div> -->
            </div>
          </div>
        </div>
      </div>

      <apexchart
        type="area"
        height="120"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import TrendPercent from '../common/TrendPercent'

function formatDate(date) {
  return date ? moment(date).format('DD-MM-YYYY') : ''
}

/*
|---------------------------------------------------------------------
| DEMO Dashboard Card Component
|---------------------------------------------------------------------
|
| Demo card component to be used to gather some ideas on how to build
| your own dashboard component
|
*/
export default {
  components: {
    TrendPercent
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    percentageLabel: {
      type: String,
      default: 'vs. last week'
    },
    series: {
      type: Array,
      default: () => [
        {
          name: 'Sales',
          data: []
        }
      ]
    },
    xaxis: {
      type: Object,
      default: () => ({
        type: 'category',
        categories: []
        // tickAmount: 3
      })
    },
    label: {
      type: String,
      default: 'dashboard.sales'
    },
    actionLabel: {
      type: String,
      default: 'View Report'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      days: [],
      dailySales: []
    }
  },
  computed: {
    ...mapGetters('Sales', ['getSales']),

    currentMonth() {
      return this.getSales.currentMonthSales
    },
    lastMonth() {
      return this.getSales.previousMonthSales
    },
    chartOptions() {
      const primaryColor = this.$vuetify.theme.isDark
        ? this.$vuetify.theme.themes.dark.primary
        : this.$vuetify.theme.themes.light.primary

      return {
        chart: {
          height: 120,
          type: 'area',
          sparkline: {
            enabled: true
          },
          animations: {
            speed: 400
          }
        },
        series: this.series,
        colors: [primaryColor],
        fill: {
          type: 'solid',
          colors: [primaryColor],
          opacity: 0.15
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: this.xaxis,
        tooltip: {
          followCursor: true,
          theme: 'dark',
          custom: function ({ ctx, series, seriesIndex, dataPointIndex, w }) {
            const seriesName = w.config.series[seriesIndex].name

            return `<div class="rounded-lg pa-1 caption">
              <div class="font-weight-bold">${w.globals.categoryLabels[dataPointIndex]}</div>
              <div>${series[seriesIndex][dataPointIndex]} ${seriesName}</div>
            </div>`
          }
        },
        ...this.options
      }
    }
  },
  watch: {
    'xaxis.categories': {
      handler(val) {
        console.log('changed')

        return val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.fetchSales().finally(() => {
      this.setDailySales()
      this.generateChart()
    })
  },
  methods: {
    ...mapActions('Sales', ['fetchSales']),
    setDailySales() {
      const days = []
      const sales = []

      for (let s = 0; s < this.getSales.dailySales.length; s++) {
        days.unshift(this.getSales.dailySales[s].day)
        sales.unshift(this.getSales.dailySales[s].sales.toFixed(2))
      }
      this.days = days
      this.dailySales = sales
    },
    generateChart() {
      // Get the last 7 days based on today's date
      const today = moment().date() // Get the current day of the month
      const last7Days = []

      for (let i = 0; i < 7; i++) {
        let day = today - i >= 1 ? today - i : 31 - (i - today) // Handle circular logic for day numbers
        let formattedDay = moment().date(day).format('MMMM Do, YYYY')

        last7Days.unshift(formattedDay);
      }
      console.log(last7Days)

      // Create an array with all sales of the last 7 days
      const salesOfLast7Days = last7Days.map((day) => {
        const sale = this.getSales.dailySales.find((s) => moment(s.day, 'DD').format('MMMM Do, YYYY') === day)

        return sale ? sale.sales.toFixed(2) : 0.00
      })

      // Generate series for the current week days
      this.series[0].data = salesOfLast7Days // .map((day) =>
      /* Math.floor(Math.random() * 10)
      ) */
      // console.log(series)

      this.chartOptions.xaxis.categories = last7Days
      // this.chartOptions.series = [{ name: 'Sales', data: series }]
    }
  }
}
</script>
