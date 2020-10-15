<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    style="position: relative"
  >
    <div style="position: absolute; top: 3em; right: 5em">
      <div
        v-for="toast in toast_queue"
        :id="toast.id"
        v-bind:key="toast.id"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :data-delay="1000 * toast.time"
        style="min-width: 15em"
      >
        <div class="toast-header">
          <strong class="mr-auto">{{ toast.title }}</strong>
          <small class="text-muted"> {{ toast.detail }} </small>
          <button
            type="button"
            class="ml-2 mb-1 close"
            data-dismiss="toast"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          {{ toast.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      default: 5,
    },
  },

  created() {
    this.toast_queue = [];
    this.$toast_handler(this);
  },

  data() {
    return { toast_queue: [], toasts_cont: 0 };
  },

  updated() {
    this.toast_queue.forEach((t) => (t.elem ? null : this.show(t)));
  },

  methods: {
    push(title, text, detail = "Just now", time) {
      this.toast_queue.push({
        title,
        text,
        detail,
        id: "toast-" + this.toasts_cont++,
        time: time ? time : this.time,
      });
    },

    show(toast) {
      const elem = document.getElementById(toast.id);
      if (elem) {
        toast.elem = true;
        elem.addEventListener("hidden.bs.toast", () =>
          this.toast_queue.splice(this.toast_queue.indexOf(toast.id), 1)
        );
        const tb = new this.$bootstrap.Toast(elem);
        tb.show();
      }
    },
  },
};
</script>