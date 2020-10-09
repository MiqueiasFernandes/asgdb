<template>
  <div class="card mb-5" style="width: 18rem" v-if="user">
    <div class="card-header">
      Usuario <span v-badge:secondary>{{ userId }}</span>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Nome:</strong> {{ user.nome }}</li>
      <li class="list-group-item"><strong>Idade:</strong> {{ user.idade }}</li>
    </ul>
    <div class="card-footer text-right">
      <router-link :to="`${'/user/' + userId + '/edit'}`">
        <button class="mr-3" v-btn><Icon icon="pencil" btn/> Edit</button>
      </router-link>

      <router-link :to="`${'/user/' + userId + '/delete'}`">
        <button v-btn:danger><Icon icon="trash" btn/> Delete</button>
      </router-link>
    </div>
  </div>

  <div v-else-if="novo">Criar um novo usuario</div>
  <div v-else>o usuario {{ userId }} nao existe</div>

  <router-view></router-view>

  <button @click="goBack" v-btn><Icon icon="arrow-left" btn/>Voltar</button>
</template>

<script>
import { mapGetters } from "vuex";
import GoTo from "@/shared/utils/go.to.router";

export default {
  props: ["userId"],
  computed: {
    ...mapGetters({
      userById: "BY_ID",
    }),
    novo: (c) => c.userId === "novo",
  },
  data: () => ({ user: null }),
  mounted() {
    this.user = this.novo ? null : this.userById(this.userId);
  },
  methods: {
    goBack() {
      GoTo.back(this.$router);
    },
  },
};
</script>