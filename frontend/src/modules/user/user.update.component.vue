<template>
  <div v-if="current_user">
    <h1 class="display-7 mb-5">
      <Icon name="person" class="mr-3" fill />Update user profile
    </h1>
    <div class="row mb-3">
      <div class="col-md-6">
        <label for="fname" class="form-label">Name</label>
        <input
          id="fname"
          type="text"
          class="form-control"
          :class="{
            'is-invalid': fname_invalid,
          }"
          placeholder="First"
          aria-label="First"
          v-model="fname"
          :disabled="submited"
        />
        <div class="invalid-feedback">Please insert a valid name.</div>
      </div>
      <div class="col-md-6">
        <label for="lastname" class="form-label">&nbsp;&nbsp;&nbsp;</label>
        <input
          id="lastname"
          type="text"
          class="form-control"
          :class="{
            'is-invalid': lname_invalid,
          }"
          placeholder="Last"
          aria-label="Last"
          v-model="lname"
          :disabled="submited"
        />
        <div class="invalid-feedback">Please insert a valid last name.</div>
      </div>
    </div>

    <div class="row mb-3">
      <span class="text-muted">
        Email: <strong>{{ current_user.email }}</strong></span
      >
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <File ref="avatar" :value="photo" img />
      </div>
    </div>

    <Button
      @click="reset"
      secondary
      class="mr-3"
      ico="arrow-clockwise"
      :disabled="!changed || submited"
    >
      Reset
    </Button>

    <Button
      @click="submitFile"
      :loading="submited"
      ico="check2"
      :disabled="!changed || submited"
    >
      update
    </Button>
  </div>
  <div v-else>carregado usuario ...</div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  invalid_first_name,
  invalid_last_name,
} from "../../shared/utils/validators";

export default {
  computed: {
    ...mapGetters({
      current_user: "USER_CURRENT",
    }),
    photo: (t) =>
      t.current_user.avatar === "/staticfiles/images/default_avatar.png"
        ? "Choose avatar ..."
        : t.current_user.avatar.split("/")[3],
    fname_invalid: (t) => t.init && invalid_first_name(t.fname),
    lname_invalid: (t) => t.lname && invalid_last_name(t.lname),
    changed: (t) =>
      t.current_user &&
      !t.fname_invalid &&
      !t.lname_invalid &&
      (t.fname !== t.current_user.first_name ||
        t.lname !== t.current_user.last_name ||
        t.$refs.avatar.fileWasChanged),
  },

  watch: {
    current_user(u) {
      this.setProfile(u);
    },
  },

  data: () => ({ fname: null, lname: null, submited: false, init: false }),

  created() {
    this.$store.dispatch("getCurrentUser", true);
  },

  methods: {
    setProfile(p) {
      if (p) {
        this.fname = p.first_name;
        this.lname = p.last_name;
        this.init = true;
      }
    },

    reset() {
      this.setProfile(this.current_user);
      this.$refs.avatar.restore();
    },

    submitFile() {
      if (!this.changed || this.fname_invalid || this.lname_invalid) {
        return;
      }
      this.submited = true;
      let formData = new FormData();
      formData.append("first_name", this.fname);
      formData.append("last_name", this.lname);
      formData.append("avatar", this.$refs.avatar.selectedFile);
      formData.append("avatar_changed", this.$refs.avatar.fileWasChanged);
      this.$store
        .dispatch("updateUser", formData)
        .then(() => this.onSuccess())
        .catch(() => this.onError());
    },

    onSuccess() {
      this.$refs.avatar.restore();
      this.submited = false;
    },

    onError() {
      this.submited = false;
      this.$alert("Houve um erro, tente novamente.");
    },
  },
};
</script>
