<template>
  <span></span>
</template>
<script>
import go from "@/shared/utils/go.to.router";
import { users } from "@/shared/api";

export default {
  props: ["userId"],
  mounted() {
    this.$dialog({
      title: "Delete user " + this.userId,
      content: "Tem certeza que deseja deletar o usuario " + this.userId + "?",
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
      onClosed: () => go.back(this.$router, "/user"),
    });
  },
  methods: {
    delete() {
      users
        .remove(this.userId)
        .then((res) => {
          if (res.data && res.data.error) {
            return this.$toast(res.data.error, "ERRO", "danger");
          }
          this.$toast(`O usuario ${this.userId} foi removido.`, "OK!");
        })
        .catch(() => {
          this.$toast(
            `O usuario ${this.userId} não foi removido.`,
            "ERRO",
            "danger"
          );
        });
      return true;
    },
  },
};
</script>