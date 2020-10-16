<template>
  <div>
    <Display ico="person-plus">Register</Display>
    <Display class="mb-5" v-if="activate" lead>
      <Spiner v-if="loading" /> Ativando sua account,
      <strong> please wait ...</strong>
    </Display>
    <Display class="mb-5" v-else lead>
      Create new user account to access <strong>ASGdb.org</strong>
    </Display>

    <Alert hidden ref="alert" :color="error_level"> {{ error_message }} </Alert>

    <div v-if="activate">
      <Button
        @click="try_again"
        secondary
        ico="arrow-clockwise"
        :disabled="!activate_error"
      >
        Try again
      </Button>
    </div>
    <div v-else>
      <form class="row g-3" @submit.prevent="submit">
        <div class="col-md-4">
          <label for="fname" class="form-label">Name</label>
          <input
            id="fname"
            class="form-control"
            placeholder="First"
            v-model="fname"
            :disabled="disable_form"
            :class="{
              'is-valid': validate && valid_fname,
              'is-invalid': validate && !valid_fname,
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
              'is-valid': validate && valid_lname,
              'is-invalid': validate && !valid_lname,
            }"
          />
        </div>
        <div class="col-md-5">
          <label for="regemail" class="form-label">Email</label>
          <input
            id="regemail"
            type="email"
            class="form-control"
            placeholder="email@any.com"
            v-model="regemail"
            :disabled="disable_form"
            :class="{
              'is-valid': validate && valid_email,
              'is-invalid': validate && !valid_email,
            }"
          />
        </div>
        <div class="col-md-5">
          <label for="emialc" class="form-label">&#8203;</label>
          <input
            id="emialc"
            type="email"
            class="form-control"
            placeholder="re type email"
            v-model="emailc"
            :disabled="disable_form"
            :class="{
              'is-valid': validate && valid_emailc,
              'is-invalid': validate && !valid_emailc,
            }"
          />
        </div>
        <div class="col-md-3">
          <label
            for="regpassword"
            class="form-label eye"
            @click="toggle_eye"
          >
            Password <Icon sm :name="eye_ico" />
          </label>
          <input
            id="regpassword"
            :type="password_type"
            class="form-control"
            v-model="regpassword"
            :disabled="disable_form"
            :class="{
              'is-valid': validate && valid_password,
              'is-invalid': validate && !valid_password,
            }"
          />
        </div>
        <div class="col-md-3">
          <label for="passwordc" class="form-label">&#8203;</label>
          <input
            id="passwordc"
            :type="password_type"
            class="form-control"
            placeholder="re type password"
            v-model="passwordc"
            :disabled="disable_form"
            :class="{
              'is-valid': validate && valid_passwordc,
              'is-invalid': validate && !valid_passwordc,
            }"
          />
        </div>
        <div class="col-12">
          <Button
            ico="check2"
            type="submit"
            :loading="submited"
            :disabled="!valid_form || disable_form"
            >Register</Button
          >
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {
  valid_first_name,
  valid_last_name,
  valid_email,
  valid_password,
} from "../../shared/utils/validators";
import auth_types from "./auth.store.types";

export default {
  title: 'Register',
  computed: {
    password_type: (t) =>
      t.disable_form || !t.show_password ? "password" : "text",
    eye_ico: (t) => (t.disable_form || !t.show_password ? "eye" : "eye-slash"),
    valid_fname: (t) => valid_first_name(t.fname),
    valid_lname: (t) => !t.lname || valid_last_name(t.lname),
    valid_email: (t) => valid_email(t.regemail),
    valid_emailc: (t) => t.regemail === t.emailc,
    valid_password: (t) => valid_password(t.regpassword),
    valid_passwordc: (t) => t.regpassword === t.passwordc,
    valid_form: (t) =>
      t.valid_fname &&
      t.valid_lname &&
      t.valid_email &&
      t.valid_emailc &&
      t.valid_password &&
      t.valid_passwordc,
    validate: (t) =>
      t.fname &&
      t.regemail &&
      t.emailc &&
      t.regpassword &&
      t.passwordc &&
      t.passwordc.length === t.regpassword.length &&
      !t.valid_form,
    activate: (t) =>
      t.$route.query && t.$route.query.activate && t.$route.query.email,
  },
  data: () => ({
    fname: null,
    lname: null,
    regemail: null,
    emailc: null,
    regpassword: null,
    passwordc: null,
    show_password: false,
    disable_form: false,
    submited: false,
    error_level: "warning",
    error_message: "",
    activate_error: false,
    loading: false,
  }),
  mounted() {
    if (this.activate) {
      this.activate_account();
    }
  },
  methods: {
    toggle_eye() {
      this.show_password = !this.show_password;
    },
    submit() {
      this.$refs.alert.hide();
      this.disable_form = true;
      this.submited = true;
      this.$store
        .dispatch(auth_types.actions.register, {
          first_name: this.fname,
          last_name: this.lname,
          email: this.emailc,
          password: this.passwordc,
        })
        .then(this.reg_sucess)
        .catch(this.error);
    },

    error(error) {
      this.disable_form = false;
      this.submited = false;
      this.error_message = error[0];
      this.error_level = error[1];
      this.$refs.alert.show();
    },

    reg_sucess() {
      this.$router.push({ name: "Home" });
      this.$toast(
        "Verifique sua caixa entrada e span de seu email para ativar sua conta.",
        "Conta criada com sucesso!",
        "success",
        20
      );
    },

    activate_account() {
      this.activate_error = false;
      this.loading = true;
      this.$store
        .dispatch(auth_types.actions.activate, {
          token: this.$route.query.activate,
        })
        .then(this.activate_success)
        .catch(() => {
          this.activate_error = true;
          this.loading = false;
        });
    },

    activate_success() {
      this.loading = false;
      this.$router.push({
        name: "Login",
        query: { email: this.$route.query.email },
      });
    },

    try_again() {
      this.activate_account();
    },
  },
};
</script>
<style scoped>
.eye {
  cursor: pointer;
}
</style>