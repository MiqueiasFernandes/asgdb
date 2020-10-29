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
                v-if="
                  field.type === Number ||
                  (field.type === String && !field.text_area)
                "
                :type="field.type === Number ? 'number' : 'text'"
                class="form-control"
                :placeholder="field.placeholder"
                v-model="instance[field.id]"
                :disabled="loading"
                :required="field.required"
                :class="val ? erros[field.id] ? 'is-invalid' : 'is-valid' : ''"
              />
              <textarea
                v-if="field.type === String && field.text_area"
                class="form-control"
                :id="field.id"
                rows="3"
                :placeholder="field.placeholder"
                v-model="instance[field.id]"
                :disabled="loading"
                :required="field.required"
                :class="val ? erros[field.id] ? 'is-invalid' : 'is-valid' : ''"
              ></textarea>
              <div
              class="invalid-feedback"
              v-if="erros[field.id]"
              :key="field.id"
            > {{ erros[field.id] }}
            </div>
            </div>
            <div v-if="field.in_form && field.type === Object" :key="field.id">
              <label :for="field.id" class="form-label">
                <strong>{{ field.label }}</strong>
              </label>
              <select
                :required="field.required"
                class="form-select"
                v-model="instance[field.id]"
                :id="field.id"
                :disabled="loading"
                :class="val ? erros[field.id] ? 'is-invalid' : 'is-valid' : ''"
              >
                <option
                  v-if="!field.required"
                  :value="field.empty"
                >
                  ---
                </option>
                <option
                  v-for="(option, label) in field.options"
                  :key="option"
                  :value="option"
                >
                  {{ label }}
                </option>
              </select>
              <div
              class="invalid-feedback"
              v-if="erros[field.id]"
              :key="field.id"
            > {{ erros[field.id] }}
            </div>
            </div>
              
            
          </template>

          <div v-for="relation in entity.relations" :key="relation.human">
            <label :for="relation.name" class="form-label">
              <strong>{{ relation.human }}</strong>
            </label>
            <select
              :key="sel_key"
              :disabled="!entity.relations_to_use[relation.name] || loading"
              v-model="instance[relation.write]"
              class="form-select"
              :id="relation.name"
              :multiple="relation.multiple"
              :required="relation.required"
              :class="val ? erros[relation.write] ? 'is-invalid' : 'is-valid' : ''"
            >
              <option
                v-if="!relation.required"
                @click="instance[relation.write] = []"
              >
                ---
              </option>
              <option
                v-for="item in entity.relations_to_use[relation.name]"
                :key="item.id"
                :value="item.id"
              >
                {{ item.label }}
              </option>
            </select>
            <div
              class="invalid-feedback"
              v-if="erros[relation.write]"
              :key="relation.write"
            >
              {{ erros[relation.write] }}
            </div>
          </div>

          <Button type="submit" hidden>sub</Button>
        </form>
      </template>
      <template #footer>
        <strong class="mr-3 text-danger" v-if="erros.val && erros.msg">{{erros.msg}}</strong>
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
    val: (t) => t.erros.val
  },

  beforeMount() {
    this.loadEntity();
  },

  watch: {
    entityId() {
      this.loadEntity();
    },
  },

  data: () => ({
    instance: null,
    backup: null,
    loading: false,
    sel_key: 0,
    erros: {},
  }),

  methods: {
    loadEntity() {
      this.instance = null;
      this.backup = null;
      this.entity.loadRelations(() => this.sel_key++);
      if (this.mode_create) {
        this.instance = this.entity.fabric(null, true);
        this.backup = this.entity.fabric(null, true);
        setTimeout(() => this.$refs.dialog.show(), 500);
      } else {
        this.loading = true;
        this.entity.api
          .view(this.entityId)
          .then((response) => {
            this.loading = false;
            this.backup = response.data;
            this.instance = this.entity.fabric(response.data, true);
            this.$refs.dialog.show();
          })
          .catch(this.onError);
      }
    },

    reset() {
      this.instance = this.entity.fabric(this.backup, true);
    },

    save() {
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
        .catch(this.onError);
    },

    create() {
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
        .catch(this.onError);
    },

    complete() {
      this.loading = true;
      this.erros = {};
      if (this.mode_create) {
        this.create();
      }
      if (this.mode_edit) {
        this.save();
      }
    },

    onError(err) {
      this.loading = false;
      if (err && err.response && err.response.data) {
        if (typeof(err.response.data) === typeof("")) {
          const msg = err.response.data.includes('<h1>') ? 
          err.response.data.split('<h1>')[1].split('</h1>')[0] : 'Unknown error'
          this.erros = {val: true, msg} 
          return;
        }
        Object.keys(err.response.data).forEach((k) => {
          const tp = err.response.data[k];
          if (typeof(tp) === typeof(Array())) {
            err.response.data[k] = tp.join(" ");
          }
        });
        this.erros = err.response.data;
        this.erros.val = true
        return;
      }
      const msg = err ? err.message : null
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
