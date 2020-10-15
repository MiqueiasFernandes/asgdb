<template>
  <nav aria-label="pages-navigation">
    <ul class="pagination pagination-sm justify-content-end" v-if="pages > 1">
      <li
        v-for="(page, i) in parsed_pages"
        v-bind:key="i"
        class="page-item"
        :class="{ active: page.current }"
        :aria-current="page.current ? 'page' : ''"
      >
        <span class="page-link" v-if="page.current">
          {{ page.label }}
          <!-- <span class="visually-hidden">(current)</span> -->
        </span>
        <span v-else
          ><a class="page-link" @click="$emit('page', page.label)">{{
            page.label
          }}</a></span
        >
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    pages: Number,
    current: Number,
    start: {
      type: Number,
      default: 1,
    },
    end: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    last: (c) => (c.end > 0 ? c.end : c.pages),
    parsed_pages: (c) => {
      const dt = [];
      for (let index = c.start; index <= c.last; index++) {
        dt.push({
          label: index,
          current: c.current === index,
        });
      }
      return dt;
    },
  },
};
</script>