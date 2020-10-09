<template>
  <h1 class="display-7 mb-5">
    <Icon name="key" class="mr-3" fill />Change password
  </h1>
  <div v-if="onReset">
    <form class="row g-3" v-if="running" novalidate>
      <div class="col-md-6">
        <label for="password" class="form-label"
          >Password

          <Icon
            @click="showpass = !showpass"
            :outline="!showpass"
            :name="showpass ? 'eye-slash' : 'eye'"
            btn
          />
        </label>
        <input
          id="password"
          :type="showpass ? 'text' : 'password'"
          class="form-control"
          :class="{
            'is-invalid': validated && passwd_invalid,
            'is-valid': validated && !passwd_invalid,
          }"
          v-model="passwd"
          :disabled="submited"
        />
        <div class="form-text">
          8-4 characters. Must be include letter and number.
        </div>
      </div>
      <br />
      <div class="col-md-6">
        <label for="cpassword" class="form-label">Confirm password</label>
        <input
          id="cpassword"
          :type="showpass ? 'text' : 'password'"
          class="form-control"
          :class="{
            'is-invalid': validated && cpasswd_invalid,
            'is-valid': validated && !cpasswd_invalid,
          }"
          aria-label="confirm password"
          v-model="cpasswd"
          :disabled="submited"
        />
        <div class="invalid-feedback">Passwords not match.</div>
      </div>

      <div class="col-12">
        <Button success @click.prevent="submit" :disabled="invalid || submited">
          <Icon name="check2" />Change
        </Button>
      </div>
    </form>
  </div>
  <div v-else>
    <form class="row g-3" v-if="running" novalidate>
      <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          :class="{
            'is-invalid':
              email &&
              email.includes('.') &&
              email.includes('@') &&
              email_invalid,
          }"
          placeholder="em@il"
          aria-label="em@il"
          v-model="email"
          :disabled="submited"
        />
        <div class="invalid-feedback">
          Please insert a valid email as
          <span class="text-muted">user@mail.com</span>.
        </div>
      </div>

      <div class="col-12">
        <Button
          success
          @click.prevent="submit"
          :disabled="email_invalid || submited"
        >
          <Icon name="check2" />Alterar senha
        </Button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: null,
    passwd: null,
    cpasswd: null,
    submited: false,
    running: true,
    showpass: false,
  }),
  computed: {
    onReset: (t) =>
      t.$route.query &&
      t.$route.query.token &&
      t.$route.query.token.length > 10,
    email_invalid: (t) => !t.email || !/^\S+@(\S+\.)+\S{2,}$/.test(t.email),
    passwd_invalid: (t) =>
      !t.passwd ||
      !/\d+/.test(t.passwd) ||
      !/[a-zA-Z]+/.test(t.passwd) ||
      t.passwd.length < 4,
    cpasswd_invalid: (t) => t.passwd !== t.cpasswd,
    validated: (t) =>
      t.passwd && t.cpasswd && t.passwd.length === t.cpasswd.length,
    invalid: (t) => t.passwd_invalid || t.cpasswd_invalid,
  },
  methods: {
    submit() {
      this.submited = true;
      if (this.onReset) {
        this.$store
          .dispatch("updateUserPassword", {
            token: this.$route.query.token,
            password: this.passwd,
          })
          .then((result) => {
            if (result === "OK") {
              this.$router.push(`/login?email=${this.$route.query.email}`);
            } else {
              this.handleError();
            }
          })
          .catch(() => this.handleError());
      } else {
        this.$store
          .dispatch("updateUserPasswordEmail", {
            email: this.email,
          })
          .then((result) => {
            if (result === "OK") {
              this.$alert(
                "Instruções para alteração foram enviadas para seu email."
              );
              this.$router.push("/");
            } else {
              this.handleError();
            }
          })
          .catch(() => this.handleError());
      }
    },
    handleError(error, time = 5) {
      this.$alert(
        "Erro.",
        error ? error : "tente novamente.",
        null,
        "danger",
        time
      );
      this.submited = false;
    },
  },
};
</script>