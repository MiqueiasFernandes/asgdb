<template>
  <div class="form-file" :class="{ 'form-file-lg': lg }">
    <input
      type="file"
      class="form-file-input"
      id="fileInput"
      :disabled="disable"
      :multiple="max > 1"
      ref="file"
      v-on:change="setFile"
    />
    <label class="form-file-label" for="fileInput">
      <span class="form-file-text">
        <span v-if="files && files.length > 1" v-badge:secondary.rounded>
          {{ files.length }}
        </span>
        {{ text }}</span
      >
      <span class="form-file-button">
        <Icon :name="ico ? ico : img ? 'camera' : 'paperclip'" btn />
      </span>
    </label>
    <Button sm link @click="restore"
      ><Icon btn name="arrow-clockwise" />reset</Button
    >
    <Button sm link @click="remove"><Icon btn name="x" />clear</Button>
  </div>
</template>
<script>
export default {
  emits: ["files"],
  props: {
    disable: Boolean,
    lg: Boolean,
    img: Boolean,
    ico: String,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 1000,
    },
    types: Array,
    clear: {
      type: Boolean,
      default: true,
    },
    reset: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: "Choose file...",
    },
  },
  computed: {
    extension: (t) => (t.types ? t.types : t.img ? ["image/"] : null),
    text: (t) =>
      t.removed
        ? "-"
        : t.files && t.files.length > 0
        ? Array(...t.files)
            .map((f) => f.name)
            .join(", ")
        : t.value,
    fileWasRemoved: (t) => t.removed,
    fileWasChanged: (t) => (t.files && t.files.length > 0) || t.removed,
    selectedFile: (t) => t.validFile([null])[0],
    selectedFiles: (t) => t.validFile([]),
  },
  data: () => ({ files: [], removed: false }),
  methods: {
    restore() {
      this.removed = false;
      this.files = null;
    },

    remove() {
      this.files = null;
      this.$refs.file.files = null;
      this.removed = true;
    },

    setFile(event) {
      if (event.target && event.target.files) {
        this.files = this.validFile();
        this.removed = !this.files;
      }
    },

    validFile(or = null) {
      const files = this.$refs.file.files;
      if (!files) {
        return or;
      }
      if (files.length < this.min) {
        alert("selecione no minimo " + this.min + " arquivo");
        return or;
      }
      if (files.length > this.max) {
        this.$refs.file.value = null;
        alert("selecione no maximo " + this.max + " arquivo");
        return or;
      }
      let reset = false;
      const erros = [];

      files.forEach((file) => {
        if (
          !file.type ||
          (this.extension &&
            this.extension.every((t) => file.type.indexOf(`${t}`) !== 0))
        ) {
          if (!erros.includes(file.type)) {
            erros.push(file.type);
            alert("Tipo invalido de arquivo " + file.type);
          }
          reset = true;
          return;
        }
        if (file.size > 1000 * this.size) {
          if (!erros.includes(this.size)) {
            size = this.size < 1024 ? this.size : this.size / 1024;
            suffiz = this.size < 1024 ? "Kb" : "Mb";
            alert("Selecione arquivo menor que " + size + suffiz);
            erros.push(this.size);
          }
          reset = true;
        }
      });

      if (reset) {
        this.$refs.file.value = null;
      } else {
        this.$emit("files", files);
        return files;
      }
      return or;
    },
  },
};
</script>