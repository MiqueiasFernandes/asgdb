<template>
  <div hidden>editar usuario {{ userId }}</div>
</template>

<script>
import { mapGetters } from "vuex";
import GoTo from "@/shared/utils/go.to.router";
import EditDialog from "@/shared/utils/edit.entity.dialog";
import ChangeEntityAlert from "@/shared/utils/change.entity.alert";
import user_types from "./user.store.types";

import {
  FormBuilder,
  ValidatorRequired,
  ValidatorRegex,
  ValidatorRange,
} from "../../shared/utils/formBuilder";

export default {
  props: ["userId"],
  computed: {
    ...mapGetters({
      userById: user_types.getters.get_user_by_id,
    }),
    novo: (c) => c.userId === "novo",
  },
  mounted() {
    this.user = this.novo ? null : this.userById(this.userId);
    if (this.user || this.novo) {
      EditDialog.show(
        this,
        this.novo ? "novo User" : "User " + this.user.id,
        this.buildForm(this.novo ? {} : this.user),
        this.novo ? this.createUser : this.editUserByFormm,
        () => GoTo.back(this.$router)
      );
    }
  },
  methods: {
    buildForm(user) {
      return new FormBuilder()

        .addField("nome")
        .withLabel("Nome")
        .withPlaceholder("nome")
        .withValue(user.nome)
        .withValidation([
          new ValidatorRequired(),
          new ValidatorRegex("[a-zA-Z]+ ([a-zA-Z]+\\s*)+", "nome incorreto."),
        ])

        .addField("idade")
        .withType("number")
        .withLabel("Idade")
        .withValue(user.idade)
        .withValidation([new ValidatorRequired(), new ValidatorRange(1, 100)])

        .build();
    },
    editUserByFormm(user_data) {
      this.user.nome = user_data.nome;
      this.user.idade = user_data.idade;
      ChangeEntityAlert.alert(this, "User", this.userId, "alterado");
      GoTo.back(this.$router);
    },
    createUser(user_data) {
      this.$store.commit(UserMutations.ADD_USER, user_data);
      ChangeEntityAlert.alert(this, "User", "novo", "criado");
      GoTo.back(this.$router);
    },
  },
};
</script>
