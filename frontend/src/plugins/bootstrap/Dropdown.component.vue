<template>
  <div class="dropdown">
    <button
      class="btn dropdown-toggle"
      :class="`btn-${color}`"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-expanded="false"
    >
      {{ title }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li v-for="(option, i) in options" v-bind:key="i">
        <a class="dropdown-item" @click="send(option)">
          {{ option }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    options: Array,
    color: { type: String, default: "primary" },
  },
  methods: {
    send(option) {
      this.$emit("choose", option);
    },
  },
};
</script>