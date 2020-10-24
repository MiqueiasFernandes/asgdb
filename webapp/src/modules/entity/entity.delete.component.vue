<template>
  <span></span>
</template>
<script>
import go from "@/shared/utils/go.to.router";

export default {
  props: {
    entity: Object,
    entityId: String,
  },
  mounted() {
    this.$dialog({
      title: `Delete ${this.entity.human_name} ${this.entityId}`,
      content: `Tem certeza que deseja deletar o ${this.entity.base_name} ${this.entityId}?`,
      actions: [
        {
          label: "Delete",
          color: "danger",
          ico: "x",
          click: this.delete,
        },
        {
          label: "No",
          ico: "check2",
          color: "secondary",
          click: () => true,
        },
      ],
      onClosed: () => go.back(this.$router, `/${this.entity.base_name}`),
    });
  },
  methods: {
    delete() {
      this.entity.api
        .remove(this.entityId)
        .then(() => {
          this.$toast(
            `${this.entity.human_name} ${this.entityId} removido.`,
            "OK!"
          );
        })
        .catch(() => {
          this.$toast(
            `${this.entity.human_name} ${this.entityId} não foi removido.`,
            "ERRO",
            "danger"
          );
        });
      return true;
    },
  },
};
</script>