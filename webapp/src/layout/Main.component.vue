<template>
  <div class="main">
    <Toast global />
    <Login v-if="not_in_login" ref="login" muted />
    <Sidebar ref="sidebar" @logout="logout" />
    <Navbar
      ref="navbar"
      @login="login"
      @toggle="toggleSidebar"
      :fixed="nav_fixed"
    />
    <div
      class="container shadow-sm p-5"
      :class="{ container_nav_fix: nav_fixed, container_nav: !nav_fixed }"
      @click="closeSidebar"
    >
      <Dialog global />
      <router-view :key="$route.name"/>
    </div>
    <Footer ref="footer" @click="closeSidebar" />
  </div>
</template>

<script>
import Navbar from "./Navbar.component";
import Sidebar from "./Sidebar.component";
import Footer from "./Footer.component";
import Login from "../modules/auth/Login.component";

export default {
  title: "ASGdb.org",
  data: () => ({ nav_fixed: false }),
  components: {
    Login,
    Navbar,
    Sidebar,
    Footer,
  },
  computed: {
    not_in_login: (t) => !["Login", "Logout"].includes(t.$route.name),
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.nav_fixed =
        (document.documentElement.scrollTop || document.body.scrollTop) > 300;
    },
    toggleSidebar() {
      this.$refs.sidebar.toggle();
    },
    closeSidebar() {
      this.$refs.sidebar.close();
    },
    login() {
      if (this.not_in_login) {
        this.$refs.login.login();
      }
    },
    logout() {
      this.$refs.login.logout();
    },
  },
};
</script>

<style scoped>
.container_nav {
  margin-top: 0.3rem;
  padding-top: 2rem;
}
.container_nav_fix {
  margin-top: 2.5rem;
  padding-top: 1rem;
}
</style>