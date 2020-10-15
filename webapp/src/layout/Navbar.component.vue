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
            <router-link
              to="/"
              class="nav-link d-flex align-items-center lead"
              active-class="active"
            >
              <Icon name="house" sm fill /> <strong>Home</strong>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/user"
              class="nav-link d-flex align-items-center lead"
              active-class="active"
            >
              <Icon name="people" sm fill /> <strong>Users</strong>
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
            <Button success outline ico="search" />
          </div>
          <Button v-if="!current_user" @click="login" outline ico="person" />
          <img
            class="avatar rounded-circle"
            v-if="current_user"
            :src="current_user.avatar"
            @click="toggle"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import auth_types from "../modules/auth/auth.store.types";
import user_types from "../modules/user/user.store.types";
import { mapGetters } from "vuex";

export default {
  emits: ["toggle", "login"],
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      is_authenticated: auth_types.getters.is_authenticated,
      current_user: user_types.getters.current_user,
    }),
  },
  mounted() {
    this.$store.dispatch(user_types.actions.current_user);
  },
  methods: {
    login() {
      this.$emit("login");
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