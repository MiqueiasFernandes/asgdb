<template>
  <div v-if="current_user">
    fname: {{ current_user.first_name }} <br />
    lname: {{ current_user.last_name }} <br />
    email: {{ current_user.email }} <br />
    avatar: {{ current_user.avatar }} <br />

    <File class="mb-3 file" ref="avatar" :value="photo" img />
    <br />

    <Button @click="submitFile">update</Button>
  </div>
  <div v-else>carregado usuario ...</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      current_user: "USER_CURRENT",
    }),
    photo: (t) =>
      t.current_user.avatar === "/staticfiles/images/default_avatar.png"
        ? null
        : t.current_user.avatar.split("/")[3],
  },
  created() {
    this.$store.dispatch("getCurrentUser", true);
  },
  methods: {
    submitFile() {
      let formData = new FormData();
      formData.append("first_name", this.current_user.first_name);
      formData.append("last_name", this.current_user.last_name);
      formData.append("avatar", this.$refs.avatar.validFile([null])[0]);
      this.$store
        .dispatch("updateUser", formData)
        .then(() => console.log("SUCCESS!!"))
        .catch(() => console.log("FAILURE!!"));
    },
  },
};
</script>

<style scoped>
.file {
  max-width: 30rem;
}
</style>