<template>
  <Alert danger @close="closed">
    <Display subtitle><strong>:(</strong> Permissões insuficientes!</Display>
    <hr />
    <Display lead>Você não possui permissões para acessar esta página.</Display>
    <Display lead
      >Tente fazer
      <router-link :to="{path: '/login', query: next }">
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
    next: (t) => (t.$route.query.reason ? { next: t.$route.query.reason } : {}),
  },
  methods: {
    closed() {
      this.$router.push("/");
    },
  },
};
</script>