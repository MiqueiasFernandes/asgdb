<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-light shadow custom"
    :class="{
      lg: !fixed,
      'fixed-top': fixed,
      container: !fixed,
    }"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src="@/assets/logo.svg"
          class="d-inline-block align-top logo"
          alt="asgdb.org"
          loading="lazy"
        />
        ASGdb.org
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse bg-light custom"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <Icon name="house" btn fill />Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user" class="nav-link" active-class="active">
              <Icon name="people" btn fill />Users
            </router-link>
          </li>
        </ul>
        <div class="d-flex justify-content-evenly">
          <div class="input-group mr-3" style="width: 20rem">
            <input
              class="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <Button success outline>
              <Icon name="search" btn />
            </Button>
          </div>
          <Button
            v-if="!current_user || !current_user.avatar"
            @click="login"
            :outline="!is_authenticated"
          >
            <Icon name="person" btn />
          </Button>

          <img
            class="avatar rounded-circle"
            v-if="current_user && current_user.avatar"
            :src="current_user.avatar"
            @click="toggle"
          />
        </div>
      </div>
    </div>
  </nav>

  <AuthComponent :text_muted="true" ref="auth" hidden />
</template>

<script>
import { mapGetters } from "vuex";
import AuthComponent from "../modules/auth/auth.component";

export default {
  emits: ["toggle"],
  components: {
    AuthComponent,
  },
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      is_authenticated: "IS_AUTH",
      current_user: "USER_CURRENT",
    }),
  },
  methods: {
    login() {
      if (this.is_authenticated) {
        this.toggle();
      } else {
        this.$refs.auth.showDialog();
      }
    },
    toggle() {
      this.$emit("toggle");
    },
  },
};
</script>

<style scoped>
.logo {
  width: 2rem;
  height: 2rem;
}
.custom {
  z-index: 100;
  text-align: center;
}
.lg {
  height: 5rem;
}
.custom {
  z-index: 1030;
}
.avatar {
  width: 2.7rem;
  height: 2.7rem;
  border: 0.3rem solid lightgray;
}
</style>