<template>
  <div v-if="login_mode">
    <Dialog sm static btn_center ref="dialog">
      <template #header> <Icon name="lock" />Login </template>
      <template #body>
        <Display class="text-danger" v-if="error" lead
          >Login ou senha <strong>incorreto</strong>.</Display
        >
        <div class="mb-3">
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
        <div class="mb-3">
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
        <div class="form-check form-switch">
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
          ico="person-plus"
          success
          v-tooltip="'Register new user'"
          @click="cancel('/register')"
          :disabled="loading"
        ></Button>
        <Button
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
          @click="cancel('/password')"
          :disabled="loading"
        ></Button>
      </template>
    </Dialog>
    <Display lead :hidden="programatic_login">
      Faça
      <Button outline secondary ico="unlock" @click="show_dialog">Login</Button>
      para continuar...
    </Display>
  </div>
  <div v-else-if="logout_mode" :hidden="programatic_login">
    <Display lead> Efetuando <strong>Logout</strong>... </Display>
  </div>
</template>
<script>
import auth_types from "./auth.store.types";
import { mapGetters } from "vuex";
import { valid_email, valid_password } from "@/shared/utils/validators";

export default {
  title() {
    return this.login_mode ? "Login" : this.logout_mode ? "Logout" : null;
  },
  emits: ["login", "logout"],
  props: {
    programatic_login: Boolean,
  },
  data: () => ({
    show_pass: false,
    loading: false,
    email: null,
    password: null,
    remember: true,
    error: false,
    submited: false,
  }),
  computed: {
    ...mapGetters({
      is_authenticated: auth_types.getters.is_authenticated,
      is_verified: auth_types.getters.is_verified,
    }),
    login_mode: (t) => t.$route.name === "Login" || t.programatic_login,
    logout_mode: (t) => t.$route.name === "Logout" || t.programatic_logout,
    eye: (t) => (t.loading || !t.show_pass ? "eye" : "eye-slash"),
    valid: (t) => valid_email(t.email) && valid_password(t.password),
    destin: (t) => t.$route.query.next || "/",
  },
  mounted() {
    if (this.$route.query && this.$route.query.email) {
      this.email = this.$route.query.email;
    }
    if (this.login_mode && !this.programatic_login) {
      this.show_dialog();
    } else if (this.logout_mode) {
      this.$store.dispatch(auth_types.actions.logout).then(() => {
        this.continue_to_route("/");
        this.$emit("logout");
      });
    }
  },
  watch: {
    is_verified(verified) {
      if (this.login_mode) {
        if (!verified) {
          return;
        }
        if (this.is_authenticated) {
          this.submited = false;
          this.loading = false;
          this.continue_to_route(this.destin);
          this.$emit("login");
        } else if (this.submited) {
          this.auth_error();
          this.submited = false;
        }
      }
    },
  },
  methods: {
    login() {
      this.show_dialog();
    },
    logout() {
      return this.$store
        .dispatch(auth_types.actions.logout)
        .then(() => this.$emit("logout"));
    },
    show_dialog() {
      this.error = false;
      this.$refs.dialog.show();
    },
    submit() {
      this.submited = true;
      this.error = false;
      this.loading = true;
      this.$store.dispatch(auth_types.actions.login, {
        email: this.email,
        password: this.password,
        remember: this.remember,
      });
    },
    auth_error() {
      this.loading = false;
      this.$refs.dialog.shake();
      this.password = null;
      this.error = true;
    },
    continue_to_route(path, cancel) {
      if (this.$refs.dialog) {
        this.$refs.dialog.hide();
      }
      if (!this.programatic_login || cancel) {
        this.$router.push(path);
      }
    },
    cancel(path) {
      this.continue_to_route(path, true);
    },
  },
};
</script>
