<template>
  <div v-if="!text_muted">
    <span v-if="onLogin">Faça login para continuar ...</span>
    <span v-else-if="onLogout"
      >Aguarde que vc sera redirecionado em breve ...</span
    >
    <span v-else>ERRO innesperado! :(</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import auth_types from './auth.store.types'

export default {
  data: () => ({ dialog: null, wait: false, email: null }),
  props: {
    text_muted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      is_authenticated: auth_types.getters.is_authenticated,
    }),
    onLogin: (t) => t.$route.path === "/login",
    onLogout: (t) => t.$route.path === "/logout",
    destin: (t) => t.$route.query.next || '/'
  },
  watch: {
    is_authenticated() {
      if (this.wait) {
        this.$router.push(this.destin);
      }
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.email) {
      this.email = this.$route.query.email;
    }
    if (this.onLogin) {
      this.showDialog();
    }
    if (this.onLogout) {
      this.wait = true;
      this.$store.dispatch(auth_types.actions.logout);
    }
  },
  methods: {
    loading(status) {
      if (this.dialog) {
        this.dialog.setLoading(status);
      }
    },

    showDialog() {
      this.dialog = this.$login_dialog(
        this.loginHandler,
        this.registerHandler,
        this.email,
        this.passwordHandler,
        () => this.$router.push('/')
      );
    },

    loginHandler(form) {
      if (this.dialog && this.dialog.validateForm()) {
        this.loading(true),
          this.$store
            .dispatch(auth_types.actions.login, { email: form.login, password: form.password }, {root: true})
            .then(this.verify, this.verify);
      }
    },

    passwordHandler() {
      this.$router.push("password");
      return "cancel";
    },

    registerHandler() {
      this.$router.push("register");
      return "cancel";
    },

    verify() {
      this.loading(false);
      if (this.is_authenticated) {
        if (this.dialog) {
          this.dialog.close();
        }
        this.$router.push(this.destin);
      } else if (this.dialog) {
        this.dialog.resetValidation();
        this.dialog.notify("Tente novamente!", "color: red;");
      }
    },
  },
};
</script>