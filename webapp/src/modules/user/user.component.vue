<template>
  <Display ico="people">
    User
    <router-link :to="'/user/new'">
      <Button
        success
        ico="plus"
        class="float-right"
        :disabled="!has_permission('users.add_user')"
      >
        New</Button
      >
    </router-link>
  </Display>
  <div v-if="page">
    <Display lead>
      Has {{ actives }} active in
      <strong>{{ page.total_items }} users</strong>.</Display
    >
    <table
      class="table table-sm table-striped table-hover align-middle"
      :class="loading ? 'loading' : ''"
    >
      <caption>
        List of users [{{
          page.current_items.join("..")
        }}] of
        {{
          page.total_items
        }}
      </caption>
      <thead class="table-light">
        <tr>
          <th scope="col">
            <SortButton
              field="id"
              :ordering="query.ordering"
              @sort="sort"
              label="Id"
            />
          </th>
          <th class="text-center">
            <SortButton
              field="email"
              :ordering="query.ordering"
              @sort="sort"
              label="Email"
            />
          </th>
          <th>
            <SortButton
              field="registered_at"
              :ordering="query.ordering"
              @sort="sort"
              label="Since"
            />
          </th>
          <th class="text-center">
            <SortButton
              field="is_active"
              :ordering="query.ordering"
              @sort="sort"
              label="Active"
            />
          </th>
          <th class="text-center">
            <SortButton
              field="is_staff"
              :ordering="query.ordering"
              @sort="sort"
              label="Admin"
            />
          </th>
          <th class="text-center">
            <Button color="none" sm>Permissions </Button>
          </th>
          <th class="center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in page.items" :key="user.id">
          <th scope="row">
            <span v-tooltip:left="index + 1">{{ user.id }}</span>
          </th>
          <td class="text-center">
            <span v-tooltip="user.full_name">{{ user.email }}</span>
          </td>
          <td>
            {{
              user.registered_at.replaceAll(".", "/").slice(0, -4) +
              user.registered_at.slice(-2)
            }}
          </td>
          <td class="text-center">
            <Icon
              :name="user.is_active ? 'check2' : 'x'"
              :color="user.is_active ? 'success' : 'danger'"
            />
          </td>
          <td class="text-center">
            <Icon
              :name="user.is_staff ? 'check2' : 'x'"
              :color="user.is_staff ? 'success' : 'danger'"
            />
          </td>
          <td class="text-center">
            <Badge
              v-for="perm in user.permissions"
              :key="perm"
              :color="p2c(perm)"
              class="mr-1"
              >{{ short_name(perm) }}</Badge
            >
          </td>
          <td class="text-right">
            <div class="btn-group" role="group">
              <Button @click="view(user.id)" sm ico="eye-fill"> View </Button>
              <Button
                @click="edit(user.id)"
                sm
                secondary
                ico="pencil-fill"
                :disabled="!has_permission('users.change_user')"
              >
                Edit
              </Button>
              <Button
                @click="remove(user.id)"
                sm
                danger
                ico="trash-fill"
                :disabled="!has_permission('users.delete_user')"
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
    <Display lead><Spiner class="mr-2" />Loading users ...</Display>
  </div>
  <Alert v-if="error"
    ><strong>ERRO.</strong> Falhou ao carregar a pagnia.
    {{ error.message }}</Alert
  >
</template>
<script>
import auth_types from "@/modules/auth/auth.store.types";
import { mapGetters } from "vuex";
import { users } from "@/shared/api";
import { short_name, p2c } from "@/shared/utils/permissions";
import SortButton from "../../shared/generic_entity/SortButton";

export default {
  title: "User",
  components: {
    SortButton,
  },
  computed: {
    ...mapGetters(["search_query"]),
    ...mapGetters({
      has_permission: auth_types.getters.has_permission,
    }),
  },
  data: () => ({
    page: null,
    query: {},
    error: null,
    loading: false,
    actives: "",
  }),
  watch: {
    search_query(query) {
      if (query && query.trim().length > 0) {
        this.start_search(query.trim());
      }
    },
  },
  mounted() {
    this.query = Object.assign(this.query, this.$route.query) 
    this.query.page = parseInt(this.query.page || 1)
    this.loadPage();
    users.get_actives().then((r) => (this.actives = r.data.active));
  },
  methods: {
    short_name: short_name,
    p2c: p2c,

    sort(by) {
      this.loading = true;
      this.query.ordering = by;
      this.loadPage(1);
    },

    loadPage(page) {
      this.loading = true;
      this.query.page = page || this.query.page || 1;
      users.list(this.query).then(this.loadResults).catch(this.onError);
    },

    loadResults(results) {
      this.stop_loading_search();
      this.loading = false;
      this.error = null;
      this.query = results.query;
      this.page = results.page;
      this.$router.push({ name: "User", query: this.query });
    },

    onError(e) {
      this.stop_loading_search();
      this.loading = false;
      this.error = e;
    },

    start_search(query) {
      this.$store.commit("search_loading", true);
      console.log(query);
      try {
        const q = JSON.parse(query);
        users.list(q).then(this.load);
      } catch {
        console.log(query);
        this.stop_loading_search();
      }
    },

    stop_loading_search() {
      this.$store.commit("search_loading", false);
    },

    view(id) {
      this.$router.push({ path: `/user/${id}` });
    },
    edit(id) {
      this.$router.push({ path: `/user/${id}/edit` });
    },
    remove(id) {
      this.$router.push({ path: `/user/${id}/delete` });
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