<template>
  <div>
    <div class="my-5 content">
      <v-row class="my-1 mx-0 white">
        <v-col cols="12" class="center-content h createMerchent">
          <h2>{{ $t('users.createEmployee') }}</h2>
        </v-col>
        <v-col cols="12" sm="4" xs="12">
          <v-text-field
            v-model="name"
            outlined
            hint="Accept only Character"
            :error-messages="Errors.Name"
            :label="$t('users.name')"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4" xs="12">
          <v-text-field
            v-model="userName"
            outlined
            :error-messages="Errors.Username"
            :label="$t('users.userName')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" xs="12">
          <v-text-field
            v-model="phone"
            outlined
            :error-messages="Errors.Phone"
            :label="$t('users.phoneNumber')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" xs="12">
          <v-text-field
            v-model="email"
            outlined
            :error-messages="Errors.Email"
            :label="$t('users.email')"
            :rules="emailRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4" xs="12">
          <v-text-field
            v-model="password"
            outlined
            :error-messages="Errors.Passsword"
            :label="$t('login.password')"
            :rules="PasswordRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-card-title class="mb-2 font-weight-medium">{{
            $t('users.Permissions')
          }}</v-card-title>
        </v-col>
        <v-col cols="12">
          <permission-list
            @addPermissions="addPermissions($event)"
          ></permission-list>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            class="mx-2 mt-2"
            :disabled="
              !name || !userName || !password || permissions.length === 0
            "
            @click="addModerator"
          >
            {{ $t('common.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import PermissionList from '../../../components/dashboard/PermissionList'
import swal from 'sweetalert'
import i18n from '../../../plugins/vue-i18n'

export default {
  name: 'AddModerator',
  components: {
    PermissionList
  },
  data() {
    return {
      name: '',
      userName: '',
      password: '',
      email: '',
      phone: '',
      permissions: [],
      Errors: {
        Name: null,
        Username: null,
        Phone: null,
        Email: null,
        Passsword: null
      },

      PermissionsList: [],
      NameRules: [(v) => (v && v.length >= 4) || this.$i18n.t('NameERROR')],
      PasswordRules: [
        (v) =>
          (v && v.length >= 8 && /[A-Z]/.test(v)) ||
          this.$i18n.t('passwordERROR')
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    ...mapActions('Moderators', ['postModerator']),
    addModerator() {
      this.postModerator({
        name: this.name,
        userName: this.userName,
        password: this.password,
        email: this.email,
        phone: this.phone,
        permissions: this.permissions
      }).then((res) => {
        if (res.status === 400) {
          const error = res.data.errors
          const err = Object.keys(error)

          for (let e = 0; e < err.length; e++) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.Errors.hasOwnProperty(err[e])) {
              this.Errors[err[e]] = error[err[e]]
            }
          }
        } else if (res.statusCode === 201 || res.status === 201) {
          this.name = null
          this.userName = null
          this.password = null
          this.email = null
          this.phone = null
          this.permissions = []
          swal(i18n.t('common.added'), '', 'success')
          this.$router.push('/employees/list')
        }
      })
    },
    addPermissions(permissions) {
      this.permissions = permissions

      console.log(this.permissions)
    }
  }
}
</script>

<style lang="scss">
.mapHeader {
  color: #fff;
  background-color: #042d4e;
  padding: 0.5rem;
}

.center-content {
  padding: 20px;
  width: 90%;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 15px 2px #00000020;
}

.h {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
}
</style>
