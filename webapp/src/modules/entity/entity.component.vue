<template>
  <Display :ico="entity.config.ico">{{ entity.config.plural }}</Display>
  {{ entity.model.fields }}
  {{ page }}
</template>
<script>
export default {
  title() {
    return this.entity.config.plural;
  },
  props: {
    entity: Object,
  },
  data: () => ({page: null}),
  mounted() {
      this.entity.api.list().then(r => (this.page = r))
  }
};
</script>