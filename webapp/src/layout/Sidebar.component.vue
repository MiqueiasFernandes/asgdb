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
                @click="handle(button.label)"
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
      current_user: user_types.getters.current_user,
    }),
  },

  data: () => ({
    opened: false,
    showed: false,
    collapses: [],
  }),

  mounted() {
    this.close();
    if (this.collapses.length > 0) {
      this.mudar(this.collapses[0]);
    }
  },

  watch: {
    is_authenticated(auth_state) {
      if (!auth_state) {
        this.close();
      }
    },
    current_user(user) {
      if (user) {
        this.build();
        if (!this.showed) {
          this.open();
          setTimeout(this.close, 1000);
          this.showed = true;
        }
      }
    },
  },

  methods: {
    build() {
      // for default user
      const collapses = [];
      collapses.push({
        title: "Profie",
        text: null,
        id: "profile",
        buttons: [
          {
            id: "btn-1",
            label: "Logout",
            icon: "power",
            color: "warning",
          },
          {
            id: "btn-2",
            label: "Change profile",
            icon: "gear",
            color: "secondary",
          },
          {
            id: "btn-3",
            label: "Change password",
            icon: "key",
            color: "danger",
          },
        ],
      });

      this.collapses = collapses;
    },

    openFirst() {
      setTimeout(() => {
        this.collapses[0].collapse.show();
        this.collapses[0].open = true;
      }, 600);
    },

    hideAll() {
      this.collapses.forEach((c) => {
        c.open = false;
        if (!c.collapse) {
          const el = this.$refs[c.id];
          c.collapse = new this.$bootstrap.Collapse(el);
        }
        c.collapse.hide();
      });
    },

    handle(label) {
      switch (label) {
        case "Logout":
          this.logout();
          break;
        case "Change password":
          this.changepasswd();
          break;
        case "Change profile":
          this.$router.push({ name: "Profile" });
          break;
      }
      this.close();
    },

    mudar(collapse) {
      this.hideAll();
      collapse.open =
        "true" ===
        this.$refs[collapse.id + "-btn"].getAttribute("aria-expanded");
      if (!collapse.open) {
        this.openFirst();
      }
    },

    open() {
      if (!this.is_authenticated) {
        return false;
      }
      return (this.opened = true);
    },

    close() {
      this.collapses.forEach(colapse => {
        colapse.buttons.forEach(button => {
          this.$bootstrap.Tooltip.getInstance(document.getElementById(button.id)).hide()
        })
      })
      
      return (this.opened = false);
    },

    toggle() {
      this.opened = this.opened ? this.close() : this.open();
      return this.toggle;
    },

    status() {
      return this.opened;
    },

    logout() {
      this.$emit("logout");
    },

    changepasswd() {
      this.$router.push({ name: "Password" });
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