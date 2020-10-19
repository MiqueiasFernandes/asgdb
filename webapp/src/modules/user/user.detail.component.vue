<template>
  <Alert v-if="error" @close="goBack">
    usuario <strong>{{ userId }}</strong> não encontrado.
  </Alert>
  <div class="card mb-5" style="width: 18rem" v-if="user">
    <div class="card-header">
      Usuario <Badge class="float-right">{{ userId }}</Badge>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <strong>Nome:</strong> {{ user.full_name }}
      </li>
      <li class="list-group-item"><strong>Email:</strong> {{ user.email }}</li>
      <li class="list-group-item">
        <strong>Active:</strong> {{ user.is_active }}
      </li>
      <li class="list-group-item">
        <strong>Since:</strong> {{ user.registered_at }}
      </li>
      <li class="list-group-item">
        <strong>Avatar:</strong>
        {{
          user.avatar === "/staticfiles/images/default_avatar.png"
            ? "None"
            : user.avatar.split("/")[3]
        }}
      </li>
      <li class="list-group-item">
        <strong>Permissions:</strong> {{ user.permissions.join(", ") }}
      </li>
    </ul>
    <div class="card-footer text-right">
      <router-link :to="`/user/${userId}/edit`">
        <Button sm class="mr-3" ico="pencil"> Edit</Button>
      </router-link>

      <router-link :to="`/user/${userId}/delete`">
        <Button sm danger ico="trash"> Delete</Button>
      </router-link>
    </div>
  </div>
  <router-view></router-view>
  <Button @click="goBack" ico="arrow-left">Voltar</Button>
</template>
<script>
import { API_USER, get } from "@/shared/api";
import go from "@/shared/utils/go.to.router";

export default {
  props: ["userId"],
  data: () => ({ user: null, error: false }),
  beforeMount() {
    this.loadUser();
  },
  watch: {
    userId() {
      this.loadUser();
    },
  },
  methods: {
    loadUser() {
      this.user = null;
      this.error = false;
      get(API_USER, this.userId)
        .then((response) => (this.user = response.data))
        .catch(() => (this.error = true));
    },
    goBack() {
      go.back(this.$router);
    },
  },
};
</script>