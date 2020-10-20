<template>
  <Alert danger @close="closed">
    <Display subtitle><strong>:(</strong> Permissões insuficientes!</Display>
    <hr />
    <Display lead>Você não possui permissões para acessar esta página.</Display>
    <Display lead
      >Tente fazer
      <router-link :to="{ name: 'Login', query: query }">
        <Button outline secondary ico="unlock">login</Button>
      </router-link>
      novamente com outra conta.</Display
    >
    <Display lead>Contate o administrador.</Display>
  </Alert>
</template>
<script>
export default {
  computed: {
    query: (t) =>
      t.$route.query.reason
        ? { next: t.$route.query.reason, other: "yes" }
        : { other: "yes" },
  },
  methods: {
    closed() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>