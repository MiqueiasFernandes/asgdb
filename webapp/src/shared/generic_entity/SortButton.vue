<template>
  <Button @click="sort" color="none" sm>
    <slot
      ><strong>{{ label }}</strong></slot
    >
    <Icon sm :name="icon" />
  </Button>
</template>
<script>
export default {
  emits: ["sort"],
  props: {
    field: String,
    label: String,
    ordering: String,
  },
  computed: {
    sorting: (t) => {
      if (t.ordering) {
        const trimed = t.ordering.trim();
        if (trimed.length > 0) {
          return trimed
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o.length > 0);
        }
      }
      return [];
    },
    in_sort_asc: (t) => t.sorting.includes(t.field),
    in_sort_desc: (t) => t.sorting.includes(`-${t.field}`),
    icon: (t) =>
      t.in_sort_asc
        ? "arrow-down"
        : t.in_sort_desc
        ? "arrow-up"
        : "filter-left",
  },
  methods: {
    sort() {
      let new_order = [...this.sorting];
      if (this.in_sort_asc) {
        new_order = new_order.filter((o) => o !== this.field);
        new_order.push(`-${this.field}`);
      } else if (this.in_sort_desc) {
        new_order = new_order.filter((o) => o !== `-${this.field}`);
      } else {
        new_order.push(this.field);
      }
      this.$emit("sort", new_order.join(","));
    },
  },
};
</script>