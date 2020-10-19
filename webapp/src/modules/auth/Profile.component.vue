<template>
  <div>
    <Display ico="gear">Profile</Display>
    <Display class="mb-5" lead>
      Atualize seu <strong>perfil</strong> em sua conta.
      <Badge
        v-for="perm in permissions"
        :key="perm"
        :color="p2c(perm)"
        class="float-right mr-1"
        round
        >{{ perm }}</Badge
      >
    </Display>

    <Alert hidden ref="alert"
      ><strong>Houve um erro.</strong> tente novamente.</Alert
    >

    <form class="row g-3" @submit.prevent="submit">
      <div class="col-md-4">
        <label for="fname" class="form-label"><strong>Name</strong></label>
        <input
          id="fname"
          class="form-control"
          placeholder="First"
          v-model="fname"
          :disabled="disable_form"
          :class="{
            'is-invalid': fname && !valid_fname,
          }"
        />
      </div>
      <div class="col-md-6">
        <label for="lname" class="form-label">&#8203;</label>
        <input
          id="lnmae"
          class="form-control"
          placeholder="Last"
          v-model="lname"
          :disabled="disable_form"
          :class="{
            'is-invalid': lname && !valid_lname,
          }"
        />
      </div>
      <div class="col-md-7">
        <label for="regemail" class="form-label"><strong>Email</strong></label>
        <input
          id="regemail"
          type="email"
          readonly
          class="form-control-plaintext"
          v-model="email"
        />
      </div>
      <div class="col-md-6">
        <label for="avatar" class="form-label"><strong>Avatar</strong></label>
        <File
          ref="file"
          :clear="!original_photo"
          img
          id="avatar"
          :value="photo"
          :disabled="disable_form"
        />
      </div>
      <div class="col-12 mt-5">
        <Button
          secondary
          ico="arrow-clockwise"
          type="button"
          class="mr-3"
          :disabled="no_changed || disable_form"
          @click="reset"
          >Reset</Button
        >
        <Button
          ico="check2"
          type="submit"
          :loading="loading"
          :disabled="!valid_form || disable_form || no_changed"
          >Update</Button
        >
        <Button
          danger
          class="float-right remove"
          ico="person-x"
          type="button"
          :loading="loading_remove"
          :disabled="disable_form"
          @click="remove_account"
          >Remove account</Button
        >
      </div>
    </form>
  </div>
</template>
<script>
import user_types from "@/modules/user/user.store.types";
import auth_types from "./auth.store.types";
import { mapGetters } from "vuex";
import {
  valid_first_name,
  valid_last_name,
} from "../../shared/utils/validators";

export default {
  title: "Profile",
  computed: {
    ...mapGetters({
      current_user: user_types.getters.current_user,
      permissions: auth_types.getters.permissions,
    }),
    original_photo: (t) =>
      t.avatar === "/staticfiles/images/default_avatar.png",
    photo: (t) =>
      !t.avatar || t.avatar === "/staticfiles/images/default_avatar.png"
        ? "Choose avatar ..."
        : t.avatar.split("/")[3],
    disable_form: (t) => !t.current_user || t.loading || t.loading_remove,
    valid_fname: (t) => valid_first_name(t.fname),
    valid_lname: (t) => valid_last_name(t.lname),
    valid_form: (t) => t.valid_fname && t.valid_lname,
    no_changed: (t) =>
      !t.current_user ||
      (t.fname === t.current_user.first_name &&
        t.lname === t.current_user.last_name &&
        !t.$refs.file.fileWasChanged),
  },
  data: () => ({
    fname: null,
    lname: null,
    email: null,
    avatar: null,
    loading: false,
    loading_remove: false,
    erros: 0,
  }),
  watch: {
    current_user(user) {
      this.loadUser(user);
    },
  },
  mounted() {
    this.loadUser(this.current_user);
  },
  methods: {
    loadUser(user) {
      if (user) {
        this.fname = user.first_name;
        this.lname = user.last_name;
        this.email = user.email;
        this.avatar = user.avatar;
        this.$refs.file.restore();
      }
    },
    reset() {
      this.loadUser(this.current_user);
    },
    submit() {
      this.$refs.alert.hide();
      this.loading = true;
      let formData = new FormData();
      formData.append("first_name", this.fname);
      formData.append("last_name", this.lname);
      formData.append("avatar", this.$refs.file.selectedFile);
      formData.append("avatar_changed", this.$refs.file.fileWasChanged);
      this.$store
        .dispatch(auth_types.actions.update_profile, formData)
        .then(() => this.onSuccess())
        .catch(() => this.onError());
    },
    onSuccess() {
      this.loading = false;
      this.$toast("Profile was updated!");
    },
    onError() {
      this.loading = false;
      this.loading_remove = false;
      this.$refs.alert.show();
    },
    p2c(p) {
      if (p.startsWith("ADMIN")) {
        return "info";
      }
      if (p.startsWith("apps")) {
        return "primary";
      }
      return "secondary";
    },
    remove_account() {
      this.$dialog({
        title: "Remove account",
        ico: "trash",
        content:
          "All of your data will be deleted. Are you sure to remove your account?",
        actions: [
          {
            label: "Remove",
            ico: "x",
            color: "danger",
            click: this.remove_yes,
          },
          {
            label: "Continue",
            ico: "check2",
            color: "success",
            click: () => true,
          },
        ],
        focus: "Password",
        form: [
          {
            label: "Password",
            type: "password",
            value: "",
          },
        ],
      });
    },

    remove_yes(form) {
      this.loading_remove = true;
      this.$refs.alert.hide();
      this.$store
        .dispatch(auth_types.actions.login, {
          email: this.email,
          password: form.Password,
          remember: false,
          remove: true,
        })
        .then(this.removed)
        .catch(() => {
          this.onError();
          if (++this.erros > 3) {
            this.$router.push({ name: "Logout" });
            window.location.reload(true);
          }
        });
      return true;
    },

    removed() {
      this.loading_remove = false;
      this.$toast("Profile was removed!", "Bye bye!", "danger", 8);
      this.$router.push({ name: "Logout" });
    },
  },
};
</script>
<style scoped>
.remove {
  opacity: 0.5;
}
</style>