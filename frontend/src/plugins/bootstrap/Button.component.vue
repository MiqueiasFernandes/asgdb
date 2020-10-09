<template>
  <button class="btn" :class="classObj">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    sm: {
      type: Boolean,
      default: false,
    },
    lg: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "primary",
    },
    outline: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: Boolean,
      default: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classObj: (t) => {
      const dt = { active: t.active, "btn-sm": t.sm, "btn-lg": t.lg };
      const type = t.outline ? "-outline-" : "-";
      const color = t.secondary
        ? "secondary"
        : t.success
        ? "success"
        : t.warning
        ? "warning"
        : t.danger
        ? "danger"
        : t.color;
      dt["btn" + type + color] = true;
      return dt;
    },
  },
};
</script>