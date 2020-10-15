<template>
  <Toast style="z-index: 100" />
  <Sidebar ref="sidebar" />
  <Navbar ref="navbar" @toggle="toggleSidebar" :fixed="nav_fixed" />
  <div
    class="container shadow-sm p-5"
    :class="{ container_nav_fix: nav_fixed, container_nav: !nav_fixed }"
    @click="closeSidebar"
  >
    <Alert />
    <Dialog />
    <router-view />
  </div>
  <Footer ref="footer" @click="closeSidebar" />
</template>

<script>
import Navbar from "./Navbar.component";
import Sidebar from "./Sidebar.component";
import Footer from "./Footer.component";
import user_types from '../modules/user/user.store.types'
import {is_authenticated, is_verified} from '../shared/auth'

export default {
  data: () => ({ nav_fixed: false }),
  components: {
    Navbar,
    Sidebar,
    Footer,
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
        (document.documentElement.scrollTop || document.body.scrollTop) > 100;
    },
    toggleSidebar() {
      this.$refs.sidebar.toggle();
    },
    closeSidebar() {
      this.$refs.sidebar.close();
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