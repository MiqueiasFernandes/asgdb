<template>
  <div>
    <Display ico="key">Password</Display>
    <Display v-if="mode_change_password" class="mb-5" lead>
      Redefina sua <strong>senha</strong> para uma senha segura.
    </Display>
    <Display v-else class="mb-5" lead>
      Informe seu <strong>email</strong> para receber o link de redefinir senha.
    </Display>

    <Alert hidden ref="alert"
      ><strong>Houve um erro.</strong> tente novamente.</Alert
    >

    <div v-if="mode_change_password">
      <fieldset class="row mb-5" :disabled="disable_form">
        <div class="col-md-3">
          <label
            for="changepassword"
            class="form-label toggle_eye"
            @click="toggle_eye"
          >
            Password <Icon sm :name="eye_ico" />
          </label>
          <input
            id="changepassword"
            :type="password_type"
            class="form-control"
            placeholder="password"
            v-model="password"
            :class="{
              'is-invalid': validate_password && !valid_password,
            }"
            @keydown.enter="change_password"
            aria-describedby="pssHelp"
          />
          <div id="pssHelp" class="form-text">
            A senha deve ter entre 4 e 12 caracteres e incluir letras e numeros.
          </div>
        </div>
        <div class="col-md-3">
          <label for="passwordc" class="form-label">&#8203;</label>
          <input
            id="passwordc"
            class="form-control"
            :type="password_type"
            placeholder="confirm password"
            v-model="passwordc"
            :class="{
              'is-invalid': validate_password && !valid_passwordc,
            }"
            @keydown.enter="change_password"
          />
        </div>
      </fieldset>
      <div class="col-12">
        <Button
          ico="check2"
          :disabled="!valid_password || !valid_passwordc || disable_form"
          @click="change_password"
          :loading="loading"
          >Change password</Button
        >
      </div>
    </div>
    <div v-else class="row">
      <div class="col-md-5">
        <input
          type="email"
          class="form-control"
          placeholder="email@any.com"
          v-model="email"
          :disabled="disable_form"
          :class="{
            'is-invalid': validate_email && !valid_email,
          }"
          @keydown.enter="send_email"
        />
      </div>
      <div class="col-auto">
        <Button
          ico="check2"
          :loading="loading"
          :disabled="!valid_email || disable_form"
          @click="send_email"
          >Send mail</Button
        >
      </div>
    </div>
  </div>
</template>
<script>
import auth_types from "./auth.store.types";
import { valid_email, valid_password } from "../../shared/utils/validators";
export default {
  title: 'Password',
  computed: {
    mode_change_password: (t) => t.$route.query && t.$route.query.token,
    validate_email: (t) =>
      t.email && t.email.includes("@") && t.email.includes("."),
    validate_password: (t) =>
      t.password &&
      t.passwordc &&
      t.password.length > 4 &&
      t.password.length === t.passwordc.length,
    valid_email: (t) => valid_email(t.email),
    valid_password: (t) => valid_password(t.password),
    valid_passwordc: (t) => t.password === t.passwordc,
    password_type: (t) =>
      t.disable_form || !t.show_password ? "password" : "text",
    eye_ico: (t) => (t.disable_form || !t.show_password ? "eye" : "eye-slash"),
  },
  data: () => ({
    email: null,
    password: null,
    passwordc: null,
    disable_form: false,
    loading: false,
    show_password: false,
  }),
  methods: {
    toggle_eye() {
      this.show_password = !this.show_password;
    },

    reset() {
      this.loading = true;
      this.disable_form = true;
      this.$refs.alert.hide();
    },

    send_email() {
      this.reset();
      this.$store
        .dispatch(auth_types.actions.reset_password, {
          email: this.email,
        })
        .then(this.send_sucess)
        .catch(this.error);
    },

    change_password() {
      this.reset();
      this.$store
        .dispatch(auth_types.actions.update_password, {
          token: this.$route.query.token,
          password: this.password,
        })
        .then(this.change_success)
        .catch(this.error);
    },

    send_sucess() {
      this.$router.push({ name: "Home" });
      this.$toast(
        "Verifique a caixa entrada e span de seu email para redefinir sua senha.",
        "Email de recuperação enviado com sucesso!",
        "success",
        20
      );
    },

    change_success() {
      this.$router.push({
        name: "Login",
        query: { email: this.$route.query.email },
      });
    },

    error() {
      this.loading = false;
      this.disable_form = false;
      this.$refs.alert.show();
    },
  },
};
</script>
<style scoped>
.eye {
  cursor: pointer;
}
</style>