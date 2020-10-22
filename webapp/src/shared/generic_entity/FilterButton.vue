<template>
  <Button @click="showDialog" secondary ico="funnel">
    <slot> Filter </slot>
  </Button>
  <Dialog ref="dialog" title="Filter" ico="funnel">
    <template #body>
      <div class="input-group mb-3">
        <select
          @change="reset_val"
          v-model="selected_field"
          class="form-select col-2"
        >
          <option v-for="field in fields" :key="field.label" :value="field">
            {{ field.label }}
          </option>
        </select>

        <select
          @change="reset_val"
          v-model="selected_filter"
          class="form-select col-2"
        >
          <option
            v-for="filter in field_opts"
            :key="filter.label"
            :value="filter"
          >
            {{ filter.label }}
          </option>
        </select>

        <input
          v-model="filter_input"
          class="form-control col-10"
          :type="input_type"
          :placeholder="input_placeholder"
          @keydown.enter="addFilter"
        />
        <Button success ico="plus" @click="addFilter"></Button>
      </div>

      <ul class="list-group">
        <li
          v-for="filter in filters"
          :key="filter.text"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <Icon sm name="filter" />
          <strong>{{ filter.field.label }}</strong>
          <em>{{ filter.filter.label }}</em>
          <mark>{{ filter.input }}</mark>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="removeFilter(filter)"
          ></button>
        </li>
      </ul>
    </template>
    <template #footer>
      <Button secondary ico="arrow-clockwise" @click="filters = []"
        >Reset</Button
      >
      <Button ico="check2" @click="filterNow">Filter</Button>
    </template>
  </Dialog>
</template>
<script>
const eq = { label: "Is Exact", value: "=" };
const inList = { label: "Is in list", value: "__in=" };
const inRange = { label: "Is in range", value: "__range=" };
const contains = { label: "Contains", value: "__icontains=" };
const not_contains = { label: "Not Contains", value: "__icontains!=" };
const lt = { label: "Less then", value: "__lt=" };
const gt = { label: "Greather then", value: "__gt=" };
const year = { label: "Year", value: "__year=" };
const yes = { label: "Yes", value: "=True" };
const no = { label: "No", value: "=False" };

export default {
  emits: ["filter"],

  props: {
    fields: Array,
  },

  computed: {
    input_placeholder: (t) => {
      if (!t.selected_filter) {
        return "";
      }
      if (inList.label === t.selected_filter.label) {
        if (t.selected_field.type === Date) {
          return "2010-01-01,2015-12-31";
        }
        return "1,345,2,88,67";
      }
      if (inRange.label === t.selected_filter.label) {
        if (t.selected_field.type === Date) {
          return "2010-01-01,2015-12-31";
        }
        return "1,10";
      }
      return "";
    },
    input_type: (t) => {
      if (!t.selected_field) {
        return "hidden";
      }
      if (
        [inList.label, inRange.label].includes(
          t.selected_filter ? t.selected_filter.label : null
        )
      ) {
        return "text";
      }
      switch (t.selected_field.type) {
        case Number:
          return "number";
        case String:
          return "text";
        case Date:
          if (t.selected_filter && t.selected_filter.label === year.label)
            return "number";
          return "date";
      }
      return "hidden";
    },
    field_opts: (t) => {
      if (!t.selected_field) {
        return [];
      }
      const extras = t.selected_field.options || [];
      switch (t.selected_field.type) {
        case Number:
          return [eq, inList, inRange, lt, gt];
        case String:
          return [eq, inList, contains, not_contains];
        case Date:
          return [eq, inList, inRange, lt, gt, year];
        case Boolean:
          return [yes, no];
      }
      return [eq, ...extras];
    },
  },

  data: () => ({
    filters: [],
    filter_input: null,
    selected_field: null,
    selected_filter: null,
  }),
  methods: {
    showDialog() {
      this.$refs.dialog.show();
    },

    reset_val() {
      this.filter_input = null;
    },

    reset() {
      this.filter_input = null;
      this.selected_field = null;
      this.selected_filter = null;
    },

    addFilter() {
      if (
        !this.selected_field ||
        (this.selected_field.type !== Boolean && !this.filter_input)
      ) {
        return;
      }
      if (
        this.filters.some(
          (f) =>
            f.field.value === this.selected_field.value &&
            f.filter.value === this.selected_filter.value
        )
      ) {
        return;
      }
      this.filters.push({
        field: this.selected_field,
        filter: this.selected_filter,
        input: this.filter_input,
      });
      this.reset();
    },

    removeFilter(filter) {
      this.filters.splice(this.filters.indexOf(filter), 1);
    },

    filterNow() {
      this.$emit(
        "filter",
        this.filters
          .map((f) => [f.field.value, ...f.filter.value.split("="), f.input])
          .reduce(
            (o, key) => ({ ...o, [key[0] + key[1]]: key.slice(2).join("") }),
            {}
          )
      );
    },
  },
};
</script>