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
      is_authenticated: "IS_AUTH",
    }),
    onLogin: (t) => t.$route.path === "/login",
    onLogout: (t) => t.$route.path === "/logout",
  },
  watch: {
    is_authenticated() {
      if (this.wait) {
        this.$router.push("/");
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
      this.$store.dispatch("logout");
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
        this.passwordHandler
      );
    },

    loginHandler(form) {
      if (this.dialog && this.dialog.validateForm()) {
        this.loading(true),
          this.$store
            .dispatch("login", { email: form.login, password: form.password })
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
        this.$router.push("/");
      } else if (this.dialog) {
        this.dialog.resetValidation();
        this.dialog.notify("Tente novamente!", "color: red;");
      }
    },
  },
};
</script>