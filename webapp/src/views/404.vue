<template>
  <Alert @close="closed">
    <Display subtitle><strong>:(</strong> Página não encontrada!</Display>
    <hr />
    <Display lead>A página que você está procurando foi removida.</Display>
    <Display lead>Tente por outra coisa parecida.</Display>
    <Display lead>Contate o administrador.</Display>
  </Alert>
</template>
<script>
export default {
  methods: {
    closed() {
      this.$router.push("/");
    },
  },
};
</script>