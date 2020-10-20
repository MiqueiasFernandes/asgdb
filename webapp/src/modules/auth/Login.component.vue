<template>
  <Dialog
    sm
    static
    btn_center
    ref="dialog"
    :focus="email ? 'password' : 'email'"
  >
    <template #header> <Icon name="lock" />Login </template>
    <template #body>
      <Display class="text-danger" v-if="error && !inactive" lead
        ><strong>{{ message }}</strong></Display
      >
      <Display class="text-secondary" v-if="inactive" lead>
        You need <strong>activate your account</strong> with email first to
        login. <br />
        If you lost your activation email, change your password to activate your
        account.
      </Display>
      <div class="mb-3" v-if="!inactive">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="my@email.com"
          :disabled="loading"
          @keypress="error = false"
          @keydown.enter="valid && submit()"
        />
      </div>
      <div class="mb-3" v-if="!inactive">
        <label for="password" class="form-label"
          >Password <Icon @click="show_pass = !show_pass" sm :name="eye"
        /></label>
        <input
          ref="pass"
          v-model="password"
          :type="!show_pass || loading ? 'password' : 'text'"
          class="form-control"
          id="password"
          placeholder="•••"
          @keypress="error = false"
          @keydown.enter="valid && submit()"
          :disabled="loading"
        />
      </div>
      <div class="form-check form-switch" v-if="!inactive">
        <input
          class="form-check-input"
          type="checkbox"
          id="remember"
          v-model="remember"
          :disabled="loading"
        />
        <label class="form-check-label" for="remember">Remember</label>
      </div>
    </template>
    <template #footer>
      <Button
        v-if="!inactive"
        ico="person-plus"
        success
        v-tooltip="'Register new user'"
        @click="continue_to_route('/register')"
        :disabled="loading"
      ></Button>
      <Button
        v-if="!inactive"
        :loading="loading"
        ico="unlock"
        @click="submit"
        :disabled="loading || !valid"
        >Sign in</Button
      >
      <Button
        ico="key"
        secondary
        v-tooltip="'Forgot password?'"
        @click="continue_to_route('/password')"
        :disabled="loading"
      ></Button>
    </template>
  </Dialog>
  <Display lead v-if="in_login" :hidden="muted">
    Faça
    <Button outline secondary ico="unlock" @click="show_dialog">Login</Button>
    para continuar...
  </Display>
  <Display lead v-if="in_logout" :hidden="muted">
    Efetuando <strong>Logout</strong>...
  </Display>
</template>
<script>
import auth_types from "./auth.store.types";
import { mapGetters } from "vuex";
import { valid_email, valid_password } from "@/shared/utils/validators";

export default {
  props: {
    muted: Boolean,
  },
  title() {
    return this.login_mode ? "Login" : this.logout_mode ? "Logout" : null;
  },
  emits: ["login", "logout"],
  data: () => ({
    show_pass: false,
    loading: false,
    email: null,
    password: null,
    remember: true,
    error: false,
    message: "",
    submited: false,
    inactive: false,
  }),
  computed: {
    ...mapGetters({
      is_authenticated: auth_types.getters.is_authenticated,
    }),
    in_login: (t) => t.$route.name === "Login",
    in_logout: (t) => t.$route.name === "Logout",
    eye: (t) => (t.loading || !t.show_pass ? "eye" : "eye-slash"),
    valid: (t) => valid_email(t.email) && valid_password(t.password),
    destin: (t) => t.$route.query.next || "/",
  },
  mounted() {
    this.email = this.$route.query.email;
    if (!this.muted) {
      if (this.in_login) {
        if (this.is_authenticated && this.$route.query.other !== "yes") {
          return this.onLogin();
        }
        this.login();
      } else if (this.in_logout) {
        this.logout();
      }
    }
  },
  methods: {
    login() {
      this.show_dialog();
    },

    logout() {
      return this.$store
        .dispatch(auth_types.actions.logout)
        .then(this.onLogout);
    },

    clear_dialog() {
      this.submited = false;
      this.loading = false;
      this.inactive = false;
      this.error = false;
    },

    onLogin() {
      this.clear_dialog();
      this.continue_to_route(this.destin);
      this.$emit("login");
    },

    onLogout() {
      this.clear_dialog();
      this.continue_to_route("/");
      this.$emit("logout");
    },

    show_dialog() {
      this.clear_dialog();
      this.$refs.dialog.show();
    },

    submit() {
      this.clear_dialog();
      this.submited = true;
      this.loading = true;
      this.$store
        .dispatch(auth_types.actions.login, {
          email: this.email,
          password: this.password,
          remember: this.remember,
        })
        .then((result) => {
          if (result.is_authenticated) {
            this.onLogin();
          } else {
            this.auth_error(result.error, result.message);
          }
        })
        .catch((e) => this.auth_error(e.response.status, "Unkonown error."));
    },

    auth_error(code, message) {
      this.clear_dialog();
      this.$refs.dialog.shake();
      this.password = null;
      this.message = message;
      this.inactive = code === 1;
      this.error = true;
    },

    hide_dialog() {
      if (this.$refs.dialog) {
        this.$refs.dialog.hide();
      }
    },

    continue_to_route(path) {
      this.hide_dialog();
      this.$router.push(path);
    },
  },
};
</script>
