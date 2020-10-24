<template>
  <Alert v-if="error" @close="goBack">
    {{ entity.human_name }} <strong>{{ entityId }}</strong> não encontrado.
  </Alert>
  <div class="card mb-5" style="width: 18rem" v-if="instance">
    <div class="card-header">
      {{ entity.human_name }}
      <Badge class="float-right">{{ entityId }}</Badge>
    </div>
    <ul class="list-group list-group-flush">
      <li
        v-for="field in entity.fields"
        :key="field.id"
        class="list-group-item"
      >
        <strong>{{ field.label }}:</strong> {{ instance[field.id] }}
      </li>
    </ul>
    <div class="card-footer text-right">
      <router-link
        v-if="has_permission(entity.permission_change)"
        :to="`/${entity.base_name}/${entityId}/edit`"
      >
        <Button sm class="mr-3" ico="pencil"> Edit</Button>
      </router-link>

      <router-link
        v-if="has_permission(entity.permission_delete)"
        :to="`/${entity.base_name}/${entityId}/delete`"
      >
        <Button sm danger ico="trash"> Delete</Button>
      </router-link>
    </div>
  </div>
  <router-view></router-view>
  <Button @click="goBack" ico="arrow-left">Voltar</Button>
</template>
<script>
import auth_types from "@/modules/auth/auth.store.types";
import { mapGetters } from "vuex";
import go from "@/shared/utils/go.to.router";

export default {
  props: {
    entity: Object,
    entityId: String,
  },
  computed: {
    ...mapGetters({
      has_permission: auth_types.getters.has_permission,
    }),
  },
  data: () => ({ instance: null, error: false }),
  beforeMount() {
    this.loadEntity();
  },
  watch: {
    entityId() {
      this.loadEntity();
    },
  },
  methods: {
    loadEntity() {
      this.instance = null;
      this.error = false;
      this.entity.api
        .view(this.entityId)
        .then((response) => (this.instance = response.data))
        .catch(() => (this.error = true));
    },
    goBack() {
      go.back(this.$router, `/${this.entity.base_name}`);
    },
  },
};
</script>