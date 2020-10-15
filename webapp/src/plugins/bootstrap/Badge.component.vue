<template>
  <span class="badge" :class="classObj">
    <slot></slot>
  </span>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "secondary",
    },
    danger: Boolean,
    warning: Boolean,
    success: Boolean,
    round: Boolean,
  },
  computed: {
    classObj: (t) => [
      `bg-${
        t.danger
          ? "danger"
          : t.warning
          ? "warning"
          : t.success
          ? "success"
          : t.color
      }`,
      t.round ? "rounded-pill" : "",
    ],
  },
};
</script>