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
          <!-- <li class="nav-item">
            <router-link
              to="/"
              class="nav-link d-flex align-items-center lead"
              active-class="active"
            >
              <Icon name="house" sm /> <strong>Home</strong>
            </router-link>
          </li> -->
          <li class="nav-item">
            <router-link
              to="/analise"
              class="nav-link d-flex align-items-center lead"
              active-class="active"
            >
              <Icon name="bootstrap-reboot" sm /> <strong>Analise</strong>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link
              to="/browse"
              class="nav-link d-flex align-items-center lead"
              active-class="active"
            >
              <Icon name="compass" sm /> <strong>Browse</strong>
            </router-link>
          </li>

          <li class="nav-item">
            <a :href="api"
              class="nav-link d-flex align-items-center lead"
            >
              <Icon name="plug" sm /> <strong>API</strong>
            </a>
          </li>


          <li class="nav-item  align-items-center lead dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
           <Icon name="puzzle" sm />  <strong>Entity</strong>
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li
            v-for="entity in entityes"
            :key="entity.base_name"
            class="dropdown-item"
          >
            <router-link
              :to="`/${entity.base_name}`"
              active-class="active"
            >
              <Icon :name="entity.ico" sm />
              <strong>{{ entity.plural }}</strong>
            </router-link>
          </li>
          </ul>
        </li>


          
        </ul>
        <div class="d-flex justify-content-evenly">
          <div class="input-group mr-3" style="width: 20rem">
            <input
              v-model="query"
              class="form-control"
              type="search"
              :placeholder="search_placeholder"
              aria-label="Search"
              :disabled="search_loading"
              @keydown.enter="search"
            />
            <Button
              success
              outline
              ico="search"
              @click="search"
              :loading="search_loading"
              :disabled="search_loading"
            />
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
import user_types from "../modules/user/user.store.types";
import { mapGetters } from "vuex";
import Annotation from "@/models/Annotation";
import Condition from "@/models/Condition";
import Domain from "@/models/Domain";
import Expression from "@/models/Expression";
import Feature from "@/models/Feature";
import Gene from "@/models/Gene";
import Isoform from "@/models/Isoform";
import Organism from "@/models/Organism";
import Protein from "@/models/Protein";

const ENTITYTES = [
  Annotation,
  Condition,
  Domain,
  Expression,
  Feature,
  Gene,
  Isoform,
  Organism,
  Protein,
].map((e) => new e());

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
      current_user: user_types.getters.current_user,
    }),
    ...mapGetters([
      "search_loading",
      "search_query",
      "search_all",
      "search_placeholder",
    ]),
    entityes: () => ENTITYTES,
    api: () => `http://${window ? window.location ? window.location.host : '' :''}/api`
  },
  watch: {
    search_query(q) {
      if (this.search_all) {
        alert("Metodo não implementado!");
      } else {
        this.query = q;
      }
    },
  },
  data: () => ({ query: "" }),
  methods: {
    login() {
      this.$emit("login");
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.$store.commit("search", this.query);
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