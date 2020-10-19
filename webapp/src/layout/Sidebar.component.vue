<template>
  <nav class="shadow sidebar bg-light" :class="{ hidden: opened }">
    <div class="container-fluid">
      <div class="mx-3 mb-4 mt-2 text-center" v-if="current_user">
        <div>
          <strong>{{ current_user.full_name }}</strong>
        </div>
        <span class="text-muted">{{ current_user.email }}</span>
      </div>

      <div class="accordion" id="accordion">
        <div
          class="card"
          v-for="collapse in collapses"
          v-bind:key="collapse.id"
        >
          <div class="card-header" :id="`${'heading' + collapse.id}`">
            <h2 class="mb-0">
              <button
                class="btn btn-block text-left collapsed collapse-menu d-inline-flex align-items-center justify-content-between"
                type="button"
                data-toggle="collapse"
                :data-target="`${'#' + collapse.id}`"
                aria-expanded="false"
                :aria-controls="collapse.id"
                :ref="`${collapse.id + '-btn'}`"
                @click="mudar(collapse)"
              >
                {{ collapse.title }}
                <Icon
                  name="chevron-down"
                  class="alter"
                  :class="{ opened: collapse.open }"
                />
              </button>
            </h2>
          </div>
          <div
            :ref="collapse.id"
            :id="collapse.id"
            class="collapse show"
            :aria-labelledby="`${'heading' + collapse.id}`"
            data-parent="#accordion"
          >
            <div class="card-body d-flex justify-content-around">
              <Button
                sm
                outline
                class="mx-2"
                :color="button.color"
                v-for="(button, i) in collapse.buttons"
                :key="i"
                @click="button.action()"
                :ref="button.id"
                :id="button.id"
                :ico="button.icon"
                v-tooltip="button.label"
              >
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import user_types from "@/modules/user/user.store.types";
import auth_types from "@/modules/auth/auth.store.types";
import { mapGetters } from "vuex";

export default {
  emits: ["logout"],

  computed: {
    ...mapGetters({
      is_authenticated: auth_types.getters.is_authenticated,
      is_admin: auth_types.getters.is_admin,
      current_user: user_types.getters.current_user,
    }),
  },

  data: () => ({
    opened: false,
    collapses: [],
  }),

  watch: {
    is_authenticated(auth_state) {
      if (!auth_state) {
        this.close();
      }
    },
    current_user(user) {
      if (user) {
        this.build();
        setTimeout(() => this.mudar(this.collapses[0]), 800);
      }
    },
  },

  methods: {
    as_button(label, icon, action, color, id) {
      return {
        id: id || label.split(" ").join("-"),
        label,
        action,
        icon,
        color: color || "primary",
      };
    },

    as_collapse(title, text, id) {
      return { title, text, id: id || title.split(" ").join("-"), buttons: [] };
    },

    collapse_user() {
      let collapse = this.as_collapse("Profie");
      collapse.buttons.push(
        this.as_button("Logout", "power", this.act_logout, "warning")
      );
      collapse.buttons.push(
        this.as_button("Change profile", "gear", this.act_change, "secondary")
      );
      collapse.buttons.push(
        this.as_button("Change password", "key", this.act_pwd, "danger")
      );
      return collapse;
    },

    colapse_admin() {
      let collapse = this.as_collapse("Administration");
      collapse.buttons.push(this.as_button("Users", "people", this.act_users));
      return collapse;
    },

    build() {
      // for default user
      const collapses = [];
      collapses.push(this.collapse_user());
      if (this.is_admin) {
        collapses.push(this.colapse_admin());
      }
      this.collapses = collapses;
    },

    init() {
      this.collapses.forEach((c) => {
        true;
        if (!c.instance) {
          c.open = !!(c.instance = new this.$bootstrap.Collapse(
            this.$refs[c.id]
          ));
        }
        c.instance.hide();
        c.open = false;
      });
    },

    mudar(collapse) {
      this.init();
      collapse.open =
        "true" ===
        this.$refs[collapse.id + "-btn"].getAttribute("aria-expanded");
      if (!collapse.open) {
        setTimeout(() => {
          this.collapses[0].instance.show();
          this.collapses[0].open = true;
        }, 800);
      }
    },

    open() {
      if (!this.is_authenticated) {
        return false;
      }
      return (this.opened = true);
    },

    close() {
      this.collapses.forEach((colapse) => {
        colapse.buttons.forEach((button) => {
          this.$bootstrap.Tooltip.getInstance(
            document.getElementById(button.id)
          ).hide();
        });
      });

      return (this.opened = false);
    },

    toggle() {
      this.opened = this.opened ? this.close() : this.open();
      return this.toggle;
    },

    status() {
      return this.opened;
    },

    act_logout() {
      this.$emit("logout");
      this.close();
    },

    act_change() {
      this.$router.push({ name: "Profile" });
      this.close();
    },

    act_pwd() {
      this.$router.push({ name: "Password" });
      this.close();
    },

    act_users() {
      this.$router.push({ name: "User" });
      this.close();
    },
  },
};
</script>

<style scoped>
.hidden {
  right: 0 !important;
}

.fechars {
  transform: rotate(180deg);
  right: 21rem !important;
}

.opened {
  transform: rotate(180deg);
}

.alter {
  transition: transform 0.3s;
}

.sidebar {
  width: 20rem;
  height: 100vh;
  position: fixed;
  z-index: 1029;
  top: 0;
  padding: 6rem 0 0 0.3rem;
  right: -100%;
  transition: right 0.5s;
}
</style>