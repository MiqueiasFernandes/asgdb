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
      <strong>{{ page.count }} users</strong>.</Display
    >
    <table
      class="table table-sm table-striped table-hover align-middle"
      :class="loading ? 'loading' : ''"
    >
      <caption>
        List of users [{{
          page.items.join("..")
        }}] of
        {{
          page.count
        }}
      </caption>
      <thead class="table-light">
        <tr>
          <th scope="col">
            <Button color="none" sm>Id <Icon name="arrow-down" sm /></Button>
          </th>
          <th class="text-center">
            <Button color="none" sm>Email <Icon name="arrow-up" sm /></Button>
          </th>
          <th>
            <Button color="none" sm>Since <Icon name="arrow-up" sm /></Button>
          </th>
          <th class="text-center">
            <Button color="none" sm>Active <Icon name="arrow-up" sm /></Button>
          </th>
          <th>
            <Button class="text-center" color="none" sm
              >Permissions <Icon name="arrow-up" sm
            /></Button>
          </th>
          <th class="center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in page.results" :key="user.id">
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
</template>
<script>
import auth_types from "@/modules/auth/auth.store.types";
import { mapGetters } from "vuex";
import { users } from "@/shared/api";
import { short_name, p2c } from "@/shared/utils/permissions";

export default {
  title: "User",
  computed: {
    ...mapGetters({
      has_permission: auth_types.getters.has_permission,
    }),
    current_page: (t) =>
      parseInt(
        t.$route.query.page ? t.$route.query.page : t.page ? t.page.page : 1
      ),
  },
  data: () => ({
    page: null,
    loading: false,
    actives: "",
  }),
  mounted() {
    this.loadPage(this.current_page);
    users.get_actives().then((r) => (this.actives = r.data.active));
  },
  methods: {
    short_name: short_name,
    p2c: p2c,

    loadPage(page_number) {
      this.loading = true;
      users.list({ page: page_number }).then(this.load).catch(this.error);
    },

    load(page) {
      this.loading = false;
      this.page = page;
      this.$router.push({ name: "User", query: { page: page.page } });
    },

    error() {
      this.loading = false;
      alert("erro");
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