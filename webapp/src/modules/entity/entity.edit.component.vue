<template>
  <div>
    <Display v-if="mode_create" :ico="entity.ico"
      >Create new {{ entity.base_name }}</Display
    >
    <Dialog @close="go_back" ref="dialog">
      <template #header>
        <Icon :name="entity.ico" class="mr-2" /> Edit
        {{ mode_create ? "new" : "" }} {{ entity.human_name }}
        <Badge class="ml-3" round>{{ entityId }}</Badge>
      </template>
      <template v-if="instance" #body>
        <form class="row g-3 align-items-center" @submit.prevent="complete">
          <template v-for="field in entity.fields">
            <div
              v-if="field.in_form && [String, Number].includes(field.type)"
              :key="field.id"
            >
              <label :for="field.id" class="form-label">
                <strong>{{ field.label }}</strong>
              </label>
              <input
                :id="field.id"
                :type="field.type === Number ? 'number' : 'text'"
                class="form-control"
                :placeholder="field.placeholder"
                v-model="instance[field.id]"
                :disabled="loading"
              />
            </div>
          </template>

          <div
            v-for="relation in entity.relations"
            :key="relation.model.base_name"
          >
            <label :for="relation.model.base_name" class="form-label">
              <strong>{{ relation.label || relation.human_name }}</strong>
            </label>
            <select 
            :key="sel_key"
            :disabled="!entity.relations_to_use[relation.model.base_name]"
              v-model="instance[relation.field]"
              class="form-select"
              :id="relation.model.base_name"
            >
              <option
                v-for="item in entity.relations_to_use[
                  relation.model.base_name
                ]"
                :key="item.id"
                :value="item.id" 
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <Button type="submit" hidden>sub</Button>
        </form>
      </template>
      <template #footer>
        <Button
          secondary
          type="button"
          ico="arrow-clockwise"
          @click="reset"
          :disabled="no_changed || loading"
          >Reset</Button
        >
        <Button
          ico="check2"
          type="submit"
          @click="complete"
          :disabled="no_changed || loading"
          :loading="loading"
        >
          {{ mode_create ? "Create" : "Save" }}
        </Button>
      </template>
    </Dialog>
  </div>
</template>
<script>
import go from "@/shared/utils/go.to.router";

export default {
  title() {
    return this.entity.plural;
  },

  props: {
    entityId: String,
    entity: Object,
  },

  computed: {
    mode_create: (t) => !t.entityId,
    mode_edit: (t) => t.entityId,
    no_changed: (t) => t.entity.compare(t.instance, t.backup),
  },

  beforeMount() {
    this.loadEntity();
  },

  watch: {
    entityId() {
      this.loadEntity();
    },
  },

  data: () => ({ instance: null, backup: null, loading: false, sel_key: 0 }),

  methods: {
    loadEntity() {
      this.instance = null;
      this.backup = null;
      this.entity.loadRelations(() => this.sel_key++);
      if (this.mode_create) {
        this.instance = this.entity.fabric();
        this.backup = this.entity.fabric();
        setTimeout(() => this.$refs.dialog.show(), 500);
      } else {
        this.loading = true;
        this.entity.api
          .view(this.entityId)
          .then((response) => {
            this.loading = false;
            this.backup = response.data;
            this.instance = this.entity.fabric(response.data);
            this.$refs.dialog.show();
          })
          .catch(this.onError);
      }
    },

    reset() {
      this.instance = this.entity.fabric(this.backup);
    },

    save() {
      this.loading = true;
      this.entity.api
        .update(this.instance)
        .then((u) => {
          this.$toast(
            `${this.entity.human_name} ${u.data.id} foi ataulizado.`,
            "Sucesso!",
            "success"
          );
          this.$refs.dialog.hide();
        })
        .catch((e) => this.onError(e.message));
    },

    create() {
     this.loading = true;
      this.entity.api
        .create(this.instance)
        .then((u) => {
          this.$toast(
            `New ${this.entity.human_name} ${u.data.id} criado.`,
            "Sucesso!",
            "success"
          );
         this.$refs.dialog.hide();
        })
        .catch((e) => this.onError(e.message));
    },

    complete() {
      if (this.mode_create) {
        this.create();
      }
      if (this.mode_edit) {
        this.save();
      }
    },

    onError(msg) {
      this.$refs.dialog.hide();
      this.$toast(
        msg || `Não foi possivel alterar o usuario ${this.userId}.`,
        "Error",
        "danger"
      );
    },

    go_back() {
      go.back(this.$router, `/${this.entity.base_name}`);
    },
  },
};
</script>
