<template>
  <div v-if="onActivate">
    <span v-if="!finish">ativando usuario ...</span>
  </div>

  <div v-else>
    <h1 class="display-7 mb-5">
      <Icon name="person-plus" class="mr-3" fill />Register new user
    </h1>
    <form class="row g-3" v-if="running" novalidate>
      <div class="col-md-6">
        <label for="fname" class="form-label">Name</label>
        <input
          id="fname"
          type="text"
          class="form-control"
          :class="{
            'is-invalid': validated && fname_invalid,
            'is-valid': validated && !fname_invalid,
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
            'is-invalid': validated && lname && lname_invalid,
            'is-valid': validated && lname && !lname_invalid,
          }"
          placeholder="Last"
          aria-label="Last"
          v-model="lname"
          :disabled="submited"
        />
        <div class="invalid-feedback">Please insert a valid last name.</div>
      </div>
      <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          :class="{
            'is-invalid': validated && email_invalid,
            'is-valid': validated && !email_invalid,
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
      <div class="col-md-6">
        <label for="cemail" class="form-label">&nbsp;&nbsp;&nbsp;</label>
        <input
          id="cemail"
          type="email"
          class="form-control"
          :class="{
            'is-invalid': validated && cemail_invalid,
            'is-valid': validated && !cemail_invalid,
          }"
          placeholder="confirm email"
          aria-label="confirm email"
          v-model="cemail"
          :disabled="submited"
        />
        <div class="invalid-feedback">Emails not match.</div>
      </div>
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
      <div class="col-md-6">
        <label for="cpassword" class="form-label">&nbsp;&nbsp;&nbsp;</label>
        <input
          id="cpassword"
          :type="showpass ? 'text' : 'password'"
          class="form-control"
          :class="{
            'is-invalid': validated && cpasswd_invalid,
            'is-valid': validated && !cpasswd_invalid,
          }"
          placeholder="confirm password"
          aria-label="confirm password"
          v-model="cpasswd"
          :disabled="submited"
        />
        <div class="invalid-feedback">Passwords not match.</div>
      </div>

      <div class="col-12">
        <Button
          success
          ico="check2"
          @click.prevent="submit"
          :loading="submited"
          :disabled="invalid || submited"
        >
          Register
        </Button>
      </div>
    </form>
  </div>
</template>

<script>
import {
  invalid_first_name,
  invalid_last_name,
  invalid_email,
  invalid_password,
} from "../../shared/utils/validators";

export default {
  data: () => ({
    fname: null,
    lname: null,
    passwd: null,
    cpasswd: null,
    email: null,
    cemail: null,
    submited: false,
    running: true,
    showpass: false,
    finish: false,
  }),
  computed: {
    onActivate: (t) =>
      t.$route.query && t.$route.query.email && t.$route.query.activate,
    fname_invalid: (t) => invalid_first_name(t.fname),
    lname_invalid: (t) => t.lname && invalid_last_name(t.lname),
    email_invalid: (t) => invalid_email(t.email),
    cemail_invalid: (t) => t.email !== t.cemail,
    passwd_invalid: (t) => invalid_password(t.passwd),
    cpasswd_invalid: (t) => t.passwd !== t.cpasswd,
    validated: (t) => t.fname && t.passwd && t.cpasswd && t.email && t.cemail,
    invalid: (t) =>
      t.fname_invalid ||
      t.lname_invalid ||
      t.email_invalid ||
      t.cemail_invalid ||
      t.passwd_invalid ||
      t.cpasswd_invalid,
  },
  mounted() {
    if (this.onActivate) {
      this.$store
        .dispatch("activateUser", {
          email: this.$route.query.email,
          token: this.$route.query.activate,
        })
        .then((x) => {
          this.finish = true;
          if (x == 200) {
            this.handleActivated();
          } else {
            this.handleError();
          }
        })
        .catch(() => this.handleError(null, 0));
    }
  },
  methods: {
    submit() {
      this.submited = true;

      const data = {
        last_name: this.lname,
        first_name: this.fname,
        email: this.email,
        password: this.passwd,
      };

      this.$store
        .dispatch("addUser", data)
        .then((status) => {
          switch (status) {
            case 201:
              this.handleOk();
              this.running = false;
              break;
            case 210:
              this.handleExistis();
              this.running = false;
              break;
            case 400:
              this.handleError("invalid email");
              break;
            case 401:
              this.handleError("invalid filled fields");
              break;
            default:
              this.handleError();
          }
        })
        .catch(() => this.handleError());
    },

    handleOk() {
      this.$alert(
        "Sucesso!",
        "verifique o email de confirmação enviado para " + this.email,
        null,
        "primary",
        0
      );
    },

    handleExistis() {
      const id = this.$alert(
        "Email Cadastrado.",
        "verifique seu email de confirmação ou se já confirmou faça",
        "Login",
        "warning",
        0,
        () =>
          this.$router.push(
            { path: "/login", query: { email: this.email } },
            () => this.$alert_close(id)
          )
      );
    },

    handleActivated() {
      const id = this.$alert(
        "Ativado com sucesso.",
        "agora faça",
        "Login",
        "success",
        0,
        () =>
          this.$router
            .push({ path: "/login", query: { email: this.$route.query.email } })
            .then(() => this.$alert_close(id))
      );
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

