<template>
  <button :class="classObj" :disabled="disabled">
    <span class="d-flex align-items-center" ref="content">
      <Icon
        :class="[lg ? 'btn-icon-lg' : 'btn-icon', has_content ? 'mr-1' : '']"
        :name="ico"
        :sm="sm"
        v-if="ico && !loading"
      />
      <Spiner
        :class="[
          lg ? 'btn-spiner-lg' : 'btn-spiner',
          has_content ? 'mr-1' : '',
        ]"
        v-if="loading"
        :sm="sm"
      />
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    active: Boolean,
    sm: Boolean,
    lg: Boolean,
    loading: Boolean,
    link: Boolean,
    outline: Boolean,
    secondary: Boolean,
    success: Boolean,
    warning: Boolean,
    danger: Boolean,
    ico: String,
    color: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    classObj: (t) => {
      const classes = ["btn"];

      if (t.active) classes.push("active");
      if (t.sm) classes.push("btn-sm");
      if (t.lg) classes.push("btn-lg");
      if (t.link) {
        classes.push("btn-link");
      } else {
        let color = t.color; // default: 'primary'
        if (t.success) color = "success";
        if (t.warning) color = "warning";
        if (t.danger) color = "danger";
        if (t.secondary) color = "secondary";
        if (color && color.length > 2) {
          // must have color to apply `outline`
          classes.push(`btn-${t.outline ? "outline-" : ""}${color}`);
        }
      }
      return classes;
    },
  },
  data: () => ({ has_content: false }),
  mounted() {
    if (!!this.$refs.content.innerText || this.$refs.content.children.length > 1) {
      this.has_content = true;
    }
  },
};
</script>
<style scoped>
.btn-icon {
  width: 1rem;
  height: 1rem;
}
.btn-icon-lg {
  width: 2rem;
  height: 2rem;
}
.btn-spiner {
  width: 1rem;
  height: 1rem;
}
.btn-spiner-lg {
  width: 2rem !important;
  height: 2rem !important;
}
</style>