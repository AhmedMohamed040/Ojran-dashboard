<template>
  <div>
    <div class="my-5 content">
      <div class="center-content mapHeader h">
        <h2>{{ $t('users.createEmployee') }}</h2>
      </div>
      <v-row class="my-4 mx-4">
        <v-col cols="6">
          <v-text-field v-model="name" hint="Accept only Character"  :label="$t('users.name')"></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="userName"
            :label="$t('users.userName')"
          ></v-text-field>
        </v-col>
         <v-col cols="6">
          <v-text-field
            v-model="phone"
            :label="$t('users.phoneNumber')"

          ></v-text-field>
        </v-col>
         <v-col cols="6">
          <v-text-field
            v-model="email"
            :label="$t('users.email')"
            :rules="emailRules"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="password"
            :label="$t('login.password')"
            :rules="PasswordRules"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-select
            v-model="Permissions"
            :label="$t('users.Permissions')"
            :items="
              PermissionsList.map(({ name, value }) => ({
                text: name,
                value: value,
              }))
            "
            width="10%"
            style="margin: 18px 0 0 0"
            multiple
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            class="mx-2"
            @click="addModerator"
            :disabled="
              !name || !userName || !password || Permissions.length == 0
            "
          >
            {{ $t("common.add") }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "addModerator",
  data() {
    return {
      name: "",
      userName: "",
      password: "",
      email: "",
      phone: "",
      Permissions: [],
      PermissionsList: [

        {
          name: this.$i18n.t("PermissionsList.CreateManager"),
          value: "CreateManager",
        },
        {
          name: this.$i18n.t("PermissionsList.UpdateManager"),
          value: "UpdateManager",
        },
        {
          name: this.$i18n.t("PermissionsList.DisableEnableManager"),
          value: "DisableEnableManager",
        }
      ],
      NameRules: [
        (v) => (v && v.length >= 4) || this.$i18n.t("NameERROR"),
      ],
      PasswordRules: [

        (v) => (v && v.length >= 8 && /[A-Z]/.test(v)) || this.$i18n.t("passwordERROR"),
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },

  methods: {
    ...mapActions("Moderators", ["postModerator"]),
    addModerator() {
      this.postModerator({
        name: this.name,
        userName: this.userName,
        password: this.password,
        email: this.email,
        phone: this.phone,
        permissions: this.Permissions,
      }).then(() => {
        this.name = null;
        this.userName = null;
        this.password = null;
        this.email = null;
        this.phone = null;
        this.Permissions = [];
      });
      this.$bus.$emit("showSnackbar", {
        text: "تم الاضافة بنجاح",
        color: "green darken-1",
      });
    },
  },
  mounted() {},
};
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
