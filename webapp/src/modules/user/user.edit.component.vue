<template>
  <Dialog @close="goBack" ref="dialog">
    <template #header>
      <Icon name="person" class="mr-2" /> Edit User
      <Badge class="ml-3" round>{{ userId }}</Badge>
    </template>
    <template v-if="user" #body>
      <form class="row g-3" @submit.prevent="save">
        <div class="form-check form-switch">
          <input
            v-model="user.is_active"
            class="form-check-input"
            type="checkbox"
            id="active"
          />
          <label class="form-check-label" for="active">is Active</label>
        </div>
        <label for="permissions" class="form-label">Permissions</label>
        <div class="input-group" id="permissions">
          <input
            class="form-control"
            list="datalistOptions"
            placeholder="Type to search..."
            v-model="permission"
            aria-describedby="permHelp"
          />
          <datalist id="datalistOptions">
            <option
              v-for="permission in permissions"
              :value="permission"
              :key="permission"
            >
              {{ permission }}
            </option>
          </datalist>
          <Button
            outline
            success
            type="button"
            ico="plus"
            :disabled="has_perm"
            @click="add_perm"
          ></Button>
          <Button
            outline
            danger
            type="button"
            ico="x"
            :disabled="!has_perm"
            @click="remove_perm"
          ></Button>
        </div>
          <div id="permHelp" class="form-text">{{ user.permissions.join(', ')}}</div>
      </form>
    </template>
    <template #footer>
      <Button secondary ico="arrow-clockwise" @click="reset">Reset</Button>
      <Button ico="check2" @click="save">Salve</Button>
    </template>
  </Dialog>
</template>
<script>
import { API_USER, get } from "@/shared/api";
import go from "@/shared/utils/go.to.router";

export default {
  props: ["userId"],
  computed: {
    mode_create: (t) => !t.userId,
    mode_edit: (t) => t.userId,
    has_perm: (t) =>
      t.permission &&
      t.user &&
      t.user.permissions &&
      t.user.permissions.includes(t.permission),
  },
  data: () => ({
    user: null,
    backup: null,
    error: false,
    permissions: ["ADMIN", "USER"],
    permission: null,
  }),
  beforeMount() {
    this.loadUser();
  },
  watch: {
    userId() {
      this.loadUser();
    },
    user(user) {
      if (user) {
        this.$refs.dialog.show();
      } else {
        this.$refs.dialog.hide();
      }
    },
  },
  methods: {
    loadUser() {
      this.user = null;
      this.error = false;
      if (this.mode_create) {
        this.user = {};
      }
      if (this.mode_edit) {
        get(API_USER, this.userId)
          .then((response) => {
            this.backup = response.data;
            this.user = JSON.parse(JSON.stringify(response.data));
          })
          .catch(() => (this.error = true));
      }
    },
    remove_perm() {
      this.user.permissions.splice(
        this.user.permissions.findIndex((x) => x === this.permission),
        1
      );
    },
    add_perm() {
      this.user.permissions.push(this.permission);
    },
    reset() {
      this.user =JSON.parse(JSON.stringify(this.backup));
    },
    save() {
      console.log("salve");
    },
    goBack() {
      go.back(this.$router);
    },
  },
};
</script>