<template>
  <Display v-if="mode_create" ico="person">Create new user</Display>
  <Dialog @close="go_back" ref="dialog">
    <template #header>
      <Icon name="person" class="mr-2" /> Edit {{ mode_create ? 'new' : '' }} User
      <Badge class="ml-3" round>{{ userId }}</Badge>
    </template>
    <template v-if="user" #body>
      <form class="row g-3 align-items-center" @submit.prevent="save">
        <div class="col-md-4">
          <label for="first_name" class="form-label"
            ><strong>Name</strong></label
          >
          <input
            id="first_name"
            class="form-control"
            placeholder="First"
            v-model="user.first_name"
            :disabled="loading"
          />
        </div>
        <div class="col-md-6">
          <label for="last_name" class="form-label">&#8203;</label>
          <input
            id="lnmae"
            class="form-control"
            placeholder="Last"
            v-model="user.last_name"
            :disabled="loading"
          />
        </div>
        <div class="col-md-7">
          <label for="regemail" class="form-label"
            ><strong>Email</strong></label
          >
          <input
            id="regemail"
            type="email"
            class="form-control"
            v-model="user.email"
            :disabled="loading"
          />
        </div>
        <div class="col-md-5" v-if="mode_create">
          <label for="regpass" class="form-label" @click="toggle_eye"
            ><strong>Password</strong> <Icon sm :name="eye_ico"
          /></label>
          <input
            id="regpass"
            :type="password_type"
            class="form-control"
            v-model="user.password"
            :disabled="loading"
          />
        </div>
        <div class="form-check form-switch col-7">
          <input
            v-model="user.is_active"
            class="form-check-input"
            type="checkbox"
            id="active"
            :disabled="loading"
          />
          <label class="form-check-label" for="active">is Active</label>
        </div>

        <div class="form-check form-switch col-5">
          <input
            v-model="user.is_admin"
            class="form-check-input"
            type="checkbox"
            id="admin"
            :disabled="loading"
          />
          <label class="form-check-label" for="admin">is Admin</label>
        </div>

        <label class="col-md-3">Permissions</label>
        <div class="col-md-3">
          <select v-model="mode" class="form-select" :disabled="loading">
            <option value="view,add,change,delete">All</option>
            <option value="view">View</option>
            <option value="add">Add</option>
            <option value="change">Change</option>
            <option value="delete">Delete</option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="entity" class="form-select" :disabled="loading">
            <option selected value="users/user,">All</option>
            <option value="users/user">User</option>
          </select>
        </div>
        <div class="col-md-2 text-center">
          <Button
            type="button"
            ico="plus"
            @click="add_perm"
            :disabled="loading"
          />
        </div>

        <div class="col-12 permissions">
          <Badge
            class="m-1"
            closeable
            :color="p2c(perm)"
            @close="remove_perm(perm)"
            v-for="perm in user.permissions"
            :key="perm"
            :disabled="loading"
            >{{ perm.replace(/.+_/, "") }}
          </Badge>
        </div>
      </form>
    </template>
    <template #footer>
      <Button
        secondary
        ico="arrow-clockwise"
        @click="reset"
        :disabled="no_changed || loading"
        >Reset</Button
      >
      <Button
        v-if="mode_edit"
        ico="check2"
        :loading="loading"
        @click="save"
        :disabled="no_changed || loading"
        >Salve</Button
      >
      <Button
        v-if="mode_create"
        ico="check2"
        success
        :loading="loading"
        @click="create"
        :disabled="no_changed || loading || !user.first_name || !user.email"
        >Create</Button
      >
    </template>
  </Dialog>
</template>
<script>
import user_types from "@/modules/user/user.store.types";
import { mapGetters } from "vuex";
import { users } from "@/shared/api";
import go from "@/shared/utils/go.to.router";
import { short_name, p2c } from "@/shared/utils/permissions";

export default {
  props: ["userId"],
  computed: {
    ...mapGetters({
      current_user: user_types.getters.current_user,
    }),
    password_type: (t) => (t.loading || !t.show_password ? "password" : "text"),
    eye_ico: (t) => (t.loading || !t.show_password ? "eye" : "eye-slash"),
    mode_create: (t) => !t.userId,
    mode_edit: (t) => t.userId,
    no_changed: (t) =>
      t.user &&
      t.backup &&
      t.user.first_name === t.backup.first_name &&
      t.user.last_name === t.backup.last_name &&
      t.user.email === t.backup.email &&
      t.user.is_active === t.backup.is_active &&
      t.user.is_admin === t.backup.is_admin &&
      ((t.user.permissions.length + t.backup.permissions.length < 1) || (
      (t.user.permissions.every((x) => t.backup.permissions.includes(x)) &&
      t.backup.permissions.every((x) => t.user.permissions.includes(x))))),
  },
  data: () => ({
    user: null,
    backup: null,
    entity: "users/user,",
    mode: "view,add,change,delete",
    loading: false,
    show_password: false,
  }),
  beforeMount() {
    this.loadUser();
  },
  watch: {
    userId() {
      this.loadUser();
    },
  },
  methods: {
    short_name: short_name,
    p2c: p2c,

    toggle_eye() {
      this.show_password = !this.show_password;
    },

    loadUser() {
      this.user = null;
      if (this.mode_create) {
        this.user = {
          first_name: null,
          last_name: null,
          email: null,
          passowrd: null,
          permissions: [],
          is_active: false,
          is_admin: false,
        };
        this.backup = {
          first_name: null,
          last_name: null,
          email: null,
          passowrd: null,
          permissions: [],
          is_active: false,
          is_admin: false,
        };
        setTimeout(() => this.$refs.dialog.show(), 500);
      } else {
        users
          .view(this.userId)
          .then((response) => {
            response.data.is_admin = response.data.permissions.includes(
              "ADMIN"
            );
            response.data.permissions = response.data.permissions.filter((p) =>
              p.includes("_")
            );
            this.backup = response.data;
            this.user = JSON.parse(JSON.stringify(response.data));
            this.$refs.dialog.show();
          })
          .catch(this.onError);
      }
    },

    remove_perm(permission) {
      while (this.user.permissions.includes(permission)) {
        this.user.permissions.splice(
          this.user.permissions.findIndex((x) => x === permission),
          1
        );
      }
    },

    add_perm() {
      this.entity
        .split(",")
        .filter((e) => e.includes("/"))
        .map((e) => e.split("/"))
        .map((e) =>
          this.mode
            .split(",")
            .map((m) => `${e[0]}.${m}_${e[1]}`)
            .join(",")
        )
        .join(",")
        .split(",")
        .forEach((permission) => {
          if (!this.user.permissions.includes(permission)) {
            this.user.permissions.push(permission);
          }
        });
    },

    reset() {
      this.user = JSON.parse(JSON.stringify(this.backup));
    },

    create() {
      this.loading = true;
      users
        .register(this.user)
        .then((u) => {
          if (u.data.id) {
            this.$toast(
              `Novo suario ${u.data.id} criado.`,
              "Sucesso!",
              "success"
            );
            this.user.id = u.data.id;
            this.savePermissions();
          } else {
            this.onError(u.data.message);
          }
        })
        .catch((e) => this.onError(e.message));
    },

    savePermissions() {
      users
        .set_permissions(this.user.id, this.user.permissions)
        .then((c) => {
          if (c.data.permissions) {
            if (
              c.data.permissions.every((p) =>
                this.user.permissions.includes(p)
              ) &&
              this.user.permissions.every((p) => c.data.permissions.includes(p))
            ) {
              this.$toast(
                `Usuario ${this.user.id} foi atualizado.`,
                "Sucesso!",
                "success"
              );
              if (`${this.userId}` === `${this.current_user.id}`) {
                this.$store.dispatch(user_types.actions.current_user);
              }
              this.$refs.dialog.hide();
            } else {
              this.onError("falha ao salvar permissões.");
            }
          } else {
            this.onError(c.data.error);
          }
        })
        .catch((e) => this.onError(e.message));
    },

    save() {
      this.loading = true;
      users
        .profile_update_partial(this.user)
        .then(() => this.savePermissions())
        .catch((e) => this.onError(e.message));
    },

    onError(msg) {
      this.$refs.dialog.hide();
      this.$toast(
        msg || `Não foi possivel alterar o usuario ${this.userId}.`,
        "Error",
        "danger"
      );
    },

    go_back() {
      go.back(this.$router, "/user");
    },
  },
};
</script>
<style scoped>
.permissions {
  border: 1px solid lightgray;
  padding: 0.3rem;
  border-radius: 0.2rem;
  min-height: 3rem;
}
</style>