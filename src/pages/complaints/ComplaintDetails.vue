<template>
  <div>
    <v-card>
      <v-card-title class="font-weight-medium d-flex justify-space-between">
        {{ $t('complaints.details') }}
        <div >
          <v-btn color="error" class="mx-1" @click="remove()">{{ $t('common.delete') }}</v-btn>

          <v-btn v-if="complaint.isRead == false" color="primary" class="mx-1" @click="read()">{{ $t('complaints.read') }}</v-btn>
          <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            color="blue darken-1"
            top
            bottom
            text
          >
            {{ snackbarText }}

            <template v-slot:action="{ attrs }">
              <v-btn color="blue darken-1" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
          <v-snackbar
            v-model="error"
            :timeout="timeout"
            color="error darken-1"
            top
            bottom
            text
          >
            {{ errorText }}

            <template v-slot:action="{ attrs }">
              <v-btn color="error darken-1" text v-bind="attrs" @click="error = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </div>

      </v-card-title>

      <v-card-text>
        <v-row class="my-2 ">
          <v-col cols="3" >
            {{ $t('complaints.fullname') }}
          </v-col>
          <v-col cols="9">
            {{ complaint.fullName }}
          </v-col>
          <v-col cols="3">
            {{ $t('complaints.phone') }}
          </v-col>
          <v-col cols="9">
            {{ complaint.phone }}
          </v-col>

          <v-col cols="3">
            {{ $t('complaints.email') }}
          </v-col>
          <v-col cols="9">
            {{ complaint.email }}
          </v-col>
          <v-col cols="3">
            {{ $t('complaints.details') }}
          </v-col>
          <v-col cols="9">
            <div v-if="complaint.body" >
              <span>{{ complaint.body }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    complaintId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    // Complaint: this.$route.params.orderId,
      complaint: '',
      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: '',
      timeout: 2000
    }
  },
  computed: {
    ...mapGetters('Complaints', ['getComplaints', 'getComplaint'])

  },
  mounted() {
    this.fetchComplaints().then(() => {
      this.complaintDetails()
    })
  },
  methods: {
    ...mapActions('Complaints', ['fetchComplaints', 'deleteComplaint', 'editCompaints']),

    complaintDetails() {
      const complaint = this.getComplaints.find((complaint) => complaint.id === this.complaintId)

      this.complaint = complaint
    },
    remove() {
      this.deleteComplaint({
        id: this.complaint.id
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'Success') {
          this.snackbarText = this.$i18n.t('setting.deleted')
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      }).finally(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.$router.push({ name: 'complaints' })
      })

    },
    read() {
      this.editCompaints({
        id:  this.complaint.id,
        isRead: true
      }).then((res) => {
        this.complaint = this.getComplaint
        console.log(res)

        if (res.status === 200 || res.message == 'Success') {
          this.snackbarText = this.$i18n.t('setting.dataSaved')

          this.snackbar = true
        }

      }).catch((err) => {

        if (err.name == 'AxiosError') {
          this.error = true
        }
      })

    }
  }

}
</script>

<style>

</style>
