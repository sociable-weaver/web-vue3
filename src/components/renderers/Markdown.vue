<template>
  <div v-if="entry.edit === true">
    <div role="variables" class="row">
      <label>Markdown</label>
      <textarea v-model="editMarkdown" placeholder="Markdown" />
    </div>
    <div role="variables" class="row">
      <label>Variables</label>
      <div v-for="(variable, index) in edit.variables" :key="variable" role="variable">
        <input @change="onUpdateVariable(variable, index, $event)" :value="variable" role="update-variable" />
        <button @click="onRemoveVariable(index)" role="remove-variable">Remove</button>
      </div>
      <div>
        <input v-model="newVariable" placeholder="Variable Name" role="new-variable" />
        <button @click="onAddVariable" role="add-variable">Add</button>
      </div>
    </div>
    <div role="missing-variables" class="row">
      <label>Potential missing variables</label>
      <div v-for="variable in missingVariables" :key="variable" role="missing-variable">
        <span>{{ variable }}</span>
        <button @click="onAddMissingVariable(variable)">Add</button>
      </div>
    </div>
  </div>
  <div class="markdown" v-html="html" v-else />
</template>

<script lang="ts">
import { createSaveEntry, Entry, interpolate, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Markdown",
  props: {
    entry: Object,
  },
})
export default class Markdown extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: [""] } as SaveEntry;
  private newVariable = "";

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get html(): string {
    const markdown = this.entry.parameters.join("\n");
    const interpolated = interpolate(this.entry.variables, this.entry.values, markdown);
    return Marked.parse(interpolated);
  }

  get editMarkdown(): string {
    return this.edit.parameters.join("\n");
  }

  set editMarkdown(value: string) {
    this.edit.parameters = value.split("\n");
  }

  get missingVariables(): string[] {
    const markdown = this.edit.parameters.join("\n");
    const match = markdown.match(Markdown.variableNameRegex()) || [];
    return match.map((v) => v.substring(2, v.length - 1)).filter((v) => !this.edit.variables.includes(v));
  }

  private onAddVariable(): void {
    this.entry.error = "";
    const variable = this.newVariable.trim().toUpperCase();

    if (variable.length === 0) {
      this.entry.error = "Cannot add a variable without name";
      return;
    }

    const regex = Markdown.variableNameRegex();
    if (!regex.test(`\${${variable}}`)) {
      this.entry.error = "Invalid variable name.  Only letters, numbers, underscore and dash are permitted";
      return;
    }

    if (this.edit.variables.includes(variable)) {
      this.entry.error = "Another variable with the same name already exists";
      return;
    }

    this.edit.variables.push(variable);
    this.newVariable = "";
  }

  private onUpdateVariable(currentValue: string, index: number, event: Event): void {
    this.entry.error = "";

    const target = event.target as HTMLInputElement;
    const variable = target.value.trim().toUpperCase();

    if (currentValue === variable) {
      target.value = currentValue;
      return;
    }

    if (variable.length === 0) {
      this.entry.error = "Cannot have a variable without name";
      target.value = currentValue;
      return;
    }

    if (this.edit.variables.includes(variable)) {
      this.entry.error = "Another variable with the same name already exists";
      target.value = currentValue;
      return;
    }

    this.edit.variables[index] = variable;
  }

  private onRemoveVariable(index: number): void {
    this.edit.variables.splice(index, 1);
  }

  private onAddMissingVariable(variable: string): void {
    this.edit.variables.push(variable);
  }

  private onSave(): OnSaveResult {
    /* TODO: Check before saving!!  We are saving empty markdowns and even if the value is not changed. */
    return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
  }

  private static variableNameRegex(): RegExp {
    return /\${[A-Z0-9_-]+}/;
  }
}
</script>

<style scoped>
.markdown >>> pre {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: lightgrey;
  color: black;
}

div.row {
  padding-top: 15px;
}

textarea {
  width: 100%;
  min-height: 400px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

label {
  font-size: 1.2em;
}
</style>
