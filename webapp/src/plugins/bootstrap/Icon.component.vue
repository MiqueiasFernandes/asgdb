<template>
  <svg
    ref="svg"
    :class="color ? ['bi', 'text-' + color] : 'bi'"
    :width="sm ? '20' : lg ? '38' : size"
    :height="sm ? '20' : lg ? '38' : size"
    fill="currentColor"
  >
    <use
      :xlink:href="
        require('@/assets/bootstrap-icons.svg') +
        '#' +
        name +
        (fill ? '-fill' : '')
      "
    />
  </svg>
</template>

<script>
export default {
  props: {
    fill: Boolean,
    color: {
      type: String,
    },
    name: {
      type: String,
    },
    size: {
      type: String,
      default: "32",
    },
    sm: Boolean,
    lg: Boolean,
  },
};
</script>