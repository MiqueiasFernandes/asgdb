<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog" :class="classObj">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            <slot name="header"
              ><Icon class="mr-2" sm :name="current.ico" v-if="current.ico" />
              {{ current.title }}</slot
            >
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body">
            <p>{{ current.content }}</p>
          </slot>
        </div>
        <div
          class="modal-footer"
          :class="current.btn_center ? 'justify-content-around' : ''"
        >
          <slot name="footer">
            <Button
              v-for="(button, i) in current.actions"
              :key="i"
              :color="button.color"
              :ico="button.ico"
              @click="button.click() && hide()"
              >{{ button.label }}</Button
            >
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  emits: ["close"],
  props: {
    global: Boolean,
    title: String,
    ico: String,
    content: String,
    actions: {
      type: Array,
      default: () => [
        { label: "yes", ico: "check2", click: () => true },
        { label: "no", ico: "x", color: "secondary", click: () => true },
      ],
    },
    btn_center: Boolean,
    center: Boolean,
    scrool: Boolean,
    static: Boolean,
    sm: Boolean,
    lg: Boolean,
    keyboard: { type: Boolean, default: true },
    focus: { type: Boolean, default: true },
  },
  computed: {
    options: (t) => ({
      backdrop: t.current.static ? "static" : true,
      keyboard: t.keyboard,
      focus: t.focus,
      show: false,
    }),
    classObj: (t) => [
      t.current.center ? "modal-dialog-centered" : "",
      t.current.scrool ? "modal-dialog-scrollable" : "",
      t.current.sm ? "modal-sm" : "",
      t.current.lg ? "modal-lg" : "",
      t.shake_dialog,
    ],
    current: (t) => ({
      title: t.title || (t.queue.length > 0 ? t.queue[0].title : ""),
      ico: t.ico || (t.queue.length > 0 ? t.queue[0].ico : null),
      content: t.content || (t.queue.length > 0 ? t.queue[0].content : ""),
      actions:  t.queue.length > 0 ? t.queue[0].actions : t.actions,
      center: t.center || (t.queue.length > 0 ? t.queue[0].center : false),
      scrool: t.scrool || (t.queue.length > 0 ? t.queue[0].scrool : false),
      static: t.static || (t.queue.length > 0 ? t.queue[0].static : false),
      sm: t.sm || (t.queue.length > 0 ? t.queue[0].sm : false),
      lg: t.lg || (t.queue.length > 0 ? t.queue[0].lg : false),
      btn_center:
        t.btn_center || (t.queue.length > 0 ? t.queue[0].btn_center : false),
    }),
  },
  data: () => ({ modal: null, queue: [], shake_dialog: "" }),
  mounted() {
    this.modal = new this.$bootstrap.Modal(this.$refs.modal, this.options);
    this.$refs.modal.addEventListener("hidden.bs.modal", () => {
      this.$emit("close");
      this.next();
    });
    if (this.global) {
      this.$dialog_handler(this);
    }
  },
  methods: {
    shake() {
      this.shake_dialog = this.shake_dialog === "shake" ? "reshake" : "shake";
    },
    next() {
      if (this.queue.length > 0) {
        this.queue.shift();
        setTimeout(() => {
          if (this.queue.length > 0) {
            this.show();
          }
        }, 500);
      }
    },
    enqueue(config) {
      this.queue.push(config);
      this.show();
    },
    show() {
      this.modal.show();
    },
    hide() {
      this.shake_dialog = "";
      this.modal.hide();
    },
    close() {
      this.hide();
    },
  },
};
</script>
<style scoped>
.shake {
  animation: shakedialog 0.3s;
  animation-iteration-count: 2;
}

.reshake {
  animation: reshakedialog 0.3s;
  animation-iteration-count: 2;
}

@keyframes shakedialog {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-0.5deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(0.5deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(0.5deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-0.5deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-0.5deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(0.5deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-0.5deg);
  }
}

@keyframes reshakedialog {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-0.5deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(0.5deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(0.5deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-0.5deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-0.5deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(0.5deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-0.5deg);
  }
}
</style>