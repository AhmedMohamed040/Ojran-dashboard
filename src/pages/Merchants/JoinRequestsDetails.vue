<template>
  <div>

    <v-card>
      <v-card-title class="d-flex justify-space-between">
        {{ $t('Merchant.requsetDetails') }}
        <div>

          <v-row no-gutters class="justify-end" >
            <div>

            </div>
          </v-row>
        </div>
      </v-card-title>
      <v-card-text>
        <v-row class="my-2">

          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('common.name') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.name">

                {{ String(requestDetails.name) }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>

            </div>

          </v-col>
          <!-- <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.userName') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.userName">

                {{ String(requestDetails.userName) }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>

            </div>

          </v-col> -->
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.phone') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.phone">
                {{ String(requestDetails.phone) }}

              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>

            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.agent') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.agent">

                {{ String(requestDetails.agent) }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>

            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.address') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.address">

                {{ String(requestDetails.address) }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>

            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('orders.status') }}
          </v-col>
          <v-col cols="9">
            <div >
              <span v-if="requestDetails.status == 'Pending'" class="m-0 Pending--text">
                {{ $t(`common.${requestDetails.status}`) }}
              </span>
              <span v-if="requestDetails.status == 'Accepted'" class="m-0 Accepted--text">
                {{ $t(`common.${requestDetails.status}`) }}
              </span>
              <span v-if="requestDetails.status == 'Declined'" class="m-0 Rejected--text">
                {{ $t(`common.${requestDetails.status}`) }}
              </span>

            </div>

          </v-col>

          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.activity') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.activity" class="m-0">
                {{ requestDetails.activity }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.email') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.email" class="m-0">
                {{ requestDetails.email }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.commercial') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.commercialRegisterNumber" class="m-0">
                {{ requestDetails.commercialRegisterNumber }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.taxNumber') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.taxNumber" class="m-0">
                {{ requestDetails.taxNumber }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.companyName') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.companyName" class="m-0">
                {{ requestDetails.companyName }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.country') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.country" class="m-0">
                {{ requestDetails.country.name }}

              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.region') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.region" class="m-0">
                {{ requestDetails.region.name }}

              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.city') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.city" class="m-0">
                {{ requestDetails.city.name }}

              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.requestType') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.requestType" class="m-0">
                {{ requestDetails.requestType.name }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
          <v-col xs="12" sm="3" class="cyan--text">
            <v-icon small>mdi-circle-medium</v-icon>
            {{ $t('joinRequest.details') }}
          </v-col>
          <v-col cols="9">
            <div >

              <span v-if="requestDetails.details" class="m-0">
                {{ requestDetails.details }}
              </span>
              <span v-else >{{ $t('common.doesnotExist') }}</span>
            </div>

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-expansion-panels multiple class="mt-3">

      <v-expansion-panel>
        <v-expansion-panel-header class="title">{{ $t('common.Attachments') }}</v-expansion-panel-header>
        <v-expansion-panel-content class="py-2">
          <v-divider></v-divider>
          <v-row v-if="attachmentPhotos.length == 0 && otherFiles.length == 0 " no-gutters class="my-2">
            <h4>{{ $t('common.notSet') }}</h4>
          </v-row>
          <v-row v-else class="my-2">
            <v-img
              v-for="img in attachmentPhotos"
              :key="img.id"
              width="200"
              class="mx-1"
              :src="img.url"
              @click="overlay = true, overlaySrc = img.url"
            />
            <v-overlay :value="overlay" @click="overlay = false">
              <v-img :src="overlaySrc" />
            </v-overlay>
            <v-btn v-for="file in otherFiles" :key="file.id" ><a class="text-decoration-none blue--text text--darken-3" :href="file.url" target="_blank">{{ $t('common.download') }}</a></v-btn>
         </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import moment from 'moment'

import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    requestId : {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      confirmDialog: false,
      confirmText: '',
      rejectReason: '',
      overlay: false,
      overlaySrc: '',
      warehouse: null,
      attach: [
        {
          id: '1',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        },
        {
          id: '2',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        },
        {
          id: '3',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        },
        {
          id: '4',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        },
        {
          id: '5',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        },
        {
          id: '6',
          url: 'https://api.ojran.online/uploads/carousels/607c1c3bd42b4be1a5716a2f64f40ac2.jpeg'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('Merchant', ['getJoinRequest']),

    requestDetails() {
      return this.getJoinRequest
    },
    attachmentPhotos() {
      let arr = []

      const images = ['png', 'jpeg', 'jpg']

      arr = Object.values(this.requestDetails.attachments || {}).filter( (x) => {
        const exetention = x.url.split('/')[5].split('.')[1]
        console.log(exetention)
        return images.includes(exetention)
      } )

      return arr
    },
    otherFiles() {
      let arr = []

      const images = ['png', 'jpeg', 'jpg']

      arr = Object.values(this.requestDetails?.attachments  || {}).filter( (x) => {
        const exetention = x.url.split('/')[5].split('.')[1]

        return !images.includes(exetention)
      } )

      return arr
    },

  },
  mounted () {
    this.fetchRequstDetails(this.requestId)
  },
  methods: {
    ...mapActions('Merchant', ['fetchRequstDetails']),

    datetimeFormater(date) {
      return date ? moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss') : ''
    },
    forceFileDownload(response, title) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadAttachments(url) {
      console.log(url)
      axios({
        method: 'get',
        url: url,
        // url: 'https://api.ojran.sa/uploads/attachments/523da8b0b08d49b88f32f494c44cbc70.jpeg',
        responseType: 'arraybuffer'
      })
        .then((response) => {
          const name = url.split('/')[5].split('.')[1]

          this.forceFileDownload(response, name)
        })
        .catch((err) => console.log(err))
    }
  }

}
</script>

<style>

</style>
