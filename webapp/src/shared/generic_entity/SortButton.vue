<template>
  <Button @click="sort" color="none" sm>
    <slot><strong>{{ label }}</strong></slot>
    <Icon sm :name="icon" />
  </Button>
</template>
<script>
export default {
  emits: ["sort"],
  props: {
    field: String,
    label: String,
    ordering: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    in_sort_asc: (t) => t.ordering.includes(t.field),
    in_sort_desc: (t) => t.ordering.includes(`-${t.field}`),
    icon: (t) =>
      t.in_sort_asc ? "sort-down" : t.in_sort_desc ? "sort-up" : "filter-left",
  },
  methods: {
    sort() {
      let new_order = this.ordering.join(",").split(",");
      if (this.in_sort_asc) {
        new_order = new_order.filter((o) => o !== this.field);
        new_order.push(`-${this.field}`);
      } else if (this.in_sort_desc) {
        new_order = new_order.filter((o) => o !== `-${this.field}`);
        //new_order.push(this.field);
      } else {
        new_order.push(this.field);
      }
      this.$emit("sort", new_order.filter(s => s.length > 1).join(","));
    },
  },
};
</script>