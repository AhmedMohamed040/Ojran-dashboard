<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex flex-lg-row flex-column">
      <div class="width-fill">
        <div class="d-flex align-center py-3">
          <div>
            <div class="display-1">{{ $t('menu.agents') }}</div>
            <v-breadcrumbs
              :items="breadcrumbs"
              class="pa-0 py-2"
              link
            ></v-breadcrumbs>
          </div>
        </div>
        <div v-if="loading" class="loading">
          <loading />
        </div>
        <div v-if="!loading">
          <v-data-table
            :headers="headers"
            :items="getWorkPlanAgentVisitsList"
            loading-text="جاري تحميل البيانات"
            no-data-text="لا يوجد بيانات"
            hide-default-footer
            disable-filtering
            disable-pagination
            disable-sort
            mobile-breakpoint="0"
            class="elevation-1"
          >
            <template v-slot:[`item.merchantDetail`]="{ item }">
              <div v-if="item.merchantDetail">
                {{ item.merchantDetail.companyName }}
                <v-btn icon color="primary" @click="openMerchantDialog(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.potentialMerchant`]="{ item }">
              <div v-if="item.potentialMerchant">
                {{ item.potentialMerchant.companyName }}
                <v-btn icon color="primary">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <span dir="ltr">{{ datetimeFormater(item.createdAt) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-badge bordered color="green darken-2" icon="mdi-lock" overlap>
                <span slot="badge">{{ item.attachments.length }}</span>
                <v-btn
                  :disabled="item.attachments.length == 0"
                  outlined
                  color="indigo"
                  class="mr-2"
                  @click="openAttachmentsDialog(item.attachments)"
                >
                  <v-icon left> mdi-cards </v-icon>
                  {{ $t('common.Attachments') }}
                </v-btn>
              </v-badge>
              <v-badge bordered color="green darken-2" icon="mdi-lock" overlap>
                <span slot="badge">{{ item.images.length }}</span>
                <v-btn
                  :disabled="item.images.length == 0"
                  outlined
                  color="indigo"
                  class="mr-2"
                  @click="openAttachmentsDialog(item.images)"
                >
                  <v-icon left> mdi-cards </v-icon>
                  {{ $t('common.Images') }}
                </v-btn>
              </v-badge>
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
    </div>
    <merchant-detail-dialog
      :dialog="merchantDialog"
      :data="merchantData"
      @close="merchantDialog = false"
    />
    <attachment-dialog
      :dialog="attachmentDialog"
      :data="attachmentData"
      @close="attachmentDialog = false"
    />
  </div>
</template>

<script>
import moment from 'moment'

import CopyLabel from '../../components/common/CopyLabel'
import loading from '../../components/common/loading'
import MerchantDetailDialog from './components/MerchantDetailDialog.vue'
import AttachmentDialog from './components/AttachmentDialog.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'WorkPlanAgentVisits',
  components: {
    loading,
    MerchantDetailDialog,
    AttachmentDialog
  },
  data() {
    return {
      isLoading: false,
      loading: true,
      merchantDialog: false,
      merchantData: {},
      attachmentDialog: false,
      attachmentData: [],
      page: 1,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.workplans'),
          to: '/workplans',
          replace: true,
          'active-class': ''
        },
        {
          text: this.$i18n.t('menu.agents')
        }
      ],
      searchQuery: '',
      headers: [
        {
          text: this.$i18n.t('WorkPlan.RealMerchant'),
          value: 'merchantDetail'
        },
        {
          text: this.$i18n.t('WorkPlan.PotentialMerchant'),
          value: 'potentialMerchant'
        },
        {
          text: this.$i18n.t('common.details'),
          value: 'details'
        },
        {
          text: this.$i18n.t('common.date'),
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('common.actions'),
          value: 'actions'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Merchant', ['getDelegateList']),
    ...mapGetters('WorkPlanAgentVisit', [
      'getWorkPlanAgentVisitsList',
      'getFilter',
      'getLastPage',
      'getErrors'
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('WorkPlan.createWorkPlan')
        : this.$i18n.t('WorkPlan.updateWorkPlan')
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
        console.log(route.params)
        await this.$store.dispatch(
          'WorkPlanAgentVisit/fetchWorkPlanAgentVisits',
          route.params
        )
        this.loading = false
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions('Merchant', ['fetchDelegates']),
    ...mapActions('WorkPlanAgentVisit', ['fetchWorkPlans', 'deleteWorkPlan']),
    ...mapMutations('WorkPlanAgentVisit', ['setFilter']),
    handlingRoute(event) {
      if (this.$route.path !== `?PageNumber=${event}`) {
        this.$router.push(`?PageNumber=${event}`)
      }
    },
    openMerchantDialog(item) {
      console.log(item.merchantDetail)
      this.merchantData = item.merchantDetail
      this.merchantDialog = true
    },
    openAttachmentsDialog(data) {
      this.attachmentData = data
      this.attachmentDialog = true
    },
    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    }
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
.width-fill {
  width: -webkit-fill-available;
}
</style>
