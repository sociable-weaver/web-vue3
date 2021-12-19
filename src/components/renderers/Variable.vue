<template>
  <div v-if="entry.edit === true">
    <div>
      <label>Sensitive</label>
      <input type="checkbox" v-model="edit.sensitive" />
      <span class="tip">(Passwords or keys are considered as sensitive values)</span>
    </div>
    <div>
      <label>Name</label>
      <input type="text" v-model="edit.name" role="name" />
    </div>
    <div>
      <label>Default value</label>
      <input type="password" v-if="edit.sensitive" v-model="edit.parameters[0]" role="value" />
      <input type="text" v-else v-model="edit.parameters[0]" role="value" />
    </div>
  </div>
  <div v-else>
    <div>Variable</div>
    <label>{{ name }}</label>
    <input type="password" v-if="sensitive" v-model="value" role="value" />
    <input type="text" v-else v-model="value" role="value" />
    <button @click="onVariableSet" role="set-variable">Set</button>
  </div>
</template>

<script lang="ts">
import { createSaveEntry, Entry, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Variable",
  props: {
    entry: Object,
  },
  emits: ["variableUpdated", "variableInitialised"],
})
export default class Variable extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { name: "", parameters: [""], sensitive: true } as SaveEntry;
  private value = "";

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);

    this.value = this.getDefaultValue();
    if (this.value.length > 0) {
      const init = { name: this.entry.name, value: this.value };
      this.$emit("variableInitialised", init);
    }
  }

  private get sensitive(): boolean {
    if (this.entry.sensitive === undefined) {
      return true;
    }

    return this.entry.sensitive;
  }

  private get name(): string {
    return this.entry.name;
  }

  private onVariableSet(): void {
    const previousValue = this.getDefaultValue();
    if (this.value !== previousValue) {
      this.entry.parameters = [this.value];
      this.$emit("variableUpdated", { name: this.entry.name, value: this.value, previousValue });
    }
  }

  private onSave(): OnSaveResult {
    if (this.edit.name.length === 0) {
      this.entry.error = "The variable name cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (this.hasChanged()) {
      this.value = this.edit.parameters[0];
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private hasChanged() {
    return (
      this.edit.sensitive !== this.entry.sensitive ||
      this.edit.name !== this.entry.name ||
      this.edit.parameters[0] !== this.entry.parameters[0]
    );
  }

  private getDefaultValue(): string {
    return !Array.isArray(this.entry.parameters) || this.entry.parameters.length == 0 ? "" : this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss">
input[type="text"],
input[type="password"] {
  font-size: 1em;
  font-weight: bold;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-top: 2px;
  margin-top: 0;
  width: 99%;
  color: #2c3e50;
}

.tip {
  font-size: 0.8em;
  font-style: italic;
}
</style>
