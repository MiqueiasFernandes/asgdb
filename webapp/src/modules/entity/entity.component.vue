<template>
  <Display :ico="entity.ico"
    >{{ entity.plural }}
    <router-link :to="`/${entity.base_name}/new`">
      <Button success ico="plus" class="float-right ml-3" :disabled="!can_add">
        New</Button
      >
    </router-link>
  </Display>
  <div v-if="page">
    <div class="row mb-3">
      <Display class="col-auto" lead>
        Has {{ page.total_items }} {{ entity.plural }}.
        <span v-if="has_filters"
          >(Há filtros de pesquisa aplicados! click
          <a href="" class="link" @click.prevent="reset">here to remove</a>)
        </span></Display
      >
      <div class="col-auto">
        <FilterButton @filter="filter" :fields="filtered_fields" />
      </div>
    </div>

    <table
      class="table table-sm table-striped table-hover align-middle"
      :class="loading ? 'loading' : ''"
    >
      <caption>
        List of
        {{
          entity.plural_lower
        }}
        [{{
          page.current_items.join("..")
        }}] of
        {{
          page.total_items
        }}
      </caption>
      <thead class="table-light">
        <tr>
          <template v-for="field in entity.fields">
            <th
              v-if="field.in_table"
              :scope="field.is_header ? 'col' : ''"
              :key="field.id"
              :class="field.center ? 'text-center' : ''"
            >
              <SortButton
                :disabled="!field.in_sort"
                :field="field.id"
                :ordering="query.ordering"
                @sort="sort"
                :label="field.label"
              />
            </th>
          </template>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ item, item_id } in page.items" :key="item.id">
          <template v-for="field in entity.fields">
            <th
              scope="row"
              v-if="field.in_table && field.is_header"
              :key="field.id"
              :class="field.center ? 'text-center' : ''"
            >
              <span v-tooltip:left="item_id">{{ item[field.id] }}</span>
            </th>
            <td
              v-if="field.in_table && !field.is_header"
              :key="field.id"
              :class="field.center ? 'text-center' : ''"
            >
              <span>{{ item[field.id] }}</span>
            </td>
          </template>
          <td class="text-right">
            <div class="btn-group" role="group">
              <Button @click="view(item.id)" sm ico="eye-fill"> View </Button>
              <Button
                @click="edit(item.id)"
                sm
                secondary
                ico="pencil-fill"
                :disabled="!can_change"
              >
                Edit
              </Button>
              <Button
                @click="remove(item.id)"
                sm
                danger
                ico="trash-fill"
                :disabled="!can_delete"
              >
                Remove
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      ref="pagination"
      :pages="page.pages"
      :current="page.page"
      @page="loadPage"
    />
  </div>
  <div v-else>
    <Display lead
      ><Spiner class="mr-2" />Loading {{ entity.plural_lower }} ...</Display
    >
  </div>
  <Alert v-if="error">
    <strong>ERRO.</strong> Falhou ao carregar a pagnia. {{ error.message }}
  </Alert>
</template>
<script>
import { mapGetters } from "vuex";
import SortButton from "@/shared/generic_entity/SortButton";
import FilterButton from "@/shared/generic_entity/FilterButton";
import auth_types from "@/modules/auth/auth.store.types";

export default {
  title() {
    return this.entity.plural;
  },
  components: {
    SortButton,
    FilterButton,
  },
  props: {
    entity: Object,
  },
  data: () => ({
    page: null,
    query: {},
    error: null,
    loading: false,
    filtered_fields: [],
  }),
  computed: {
    ...mapGetters({
      has_permission: auth_types.getters.has_permission,
    }),
    ...mapGetters(["search_query"]),
    has_filters: (t) =>
      Object.keys(t.query).filter((x) => !["ordering", "page"].includes(x))
        .length,
    can_add: (t) => t.has_permission(t.entity.permission_add),
    can_change: (t) => t.has_permission(t.entity.permission_change),
    can_delete: (t) => t.has_permission(t.entity.permission_delete),
  },
  watch: {
    search_query(query) {
      this.search(query);
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.$store.commit("search_unregister");
  },
  methods: {
    init() {
      this.page = null;
      this.error = null;
      this.loading = false;
      this.query = Object.assign(this.query, this.$route.query);
      this.query.page = parseInt(this.query.page || 1);
      this.filtered_fields = this.entity.fields.filter((f) => f.in_filter);
      this.$store.commit(
        "search_register",
        `Search ${this.entity.plural_lower}`
      );
      this.loadPage();
    },

    reset() {
      this.$store.commit("reset_search");
      this.query = {};
      this.loadPage(1);
    },

    sort(by) {
      this.loading = true;
      this.query.ordering = by;
      this.loadPage(1);
    },

    search(query) {
      if (!query || query.trim().length < 1) return;
      this.query.search = query.trim();
      this.$store.commit("search_loading", true);
      this.loadPage(1);
    },

    filter(filters) {
      this.query = filters;
      this.loadPage(1);
    },

    loadPage(page) {
      this.loading = true;
      this.query.page = page || this.query.page || 1;
      this.entity.api
        .list(this.query)
        .then(this.loadResults)
        .catch(this.onError);
    },

    loadResults(results) {
      this.stop_loading_search();
      this.loading = false;
      this.error = null;
      this.query = results.query;
      this.page = results.page;
      this.$router.push({
        name: this.entity.human_name,
        query: this.query,
      });
    },

    onError(e) {
      this.stop_loading_search();
      this.loading = false;
      this.error = e;
    },

    stop_loading_search() {
      this.$store.commit("search_loading", false);
    },

    view(id) {
      this.$router.push({ path: `/${this.entity.base_name}/${id}` });
    },
    edit(id) {
      this.$router.push({ path: `/${this.entity.base_name}/${id}/edit` });
    },
    remove(id) {
      this.$router.push({ path: `/${this.entity.base_name}/${id}/delete` });
    },
  },
};
</script>
<style scoped>
.loading {
  animation: animatedblur 3s linear infinite;
  -webkit-animation: animatedblur 3s linear infinite;
  filter: blur(5px);
}
@keyframes animatedblur {
  0% {
    filter: blur(10px);
  }

  40% {
    filter: blur(20px);
  }

  80% {
    filter: blur(10px);
  }

  100% {
    filter: blur(15px);
  }
}
</style>