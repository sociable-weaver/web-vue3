<template>
  <div v-if="entry.edit === true">
    <div role="markdown" class="row">
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
    <div v-if="missingVariables.length > 0" role="missing-variables" class="row">
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
import {
  createSaveEntry,
  Entry,
  hasChanged,
  interpolate,
  join,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
} from "@/models/Chapter";
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
    if (join(this.entry.parameters).trim().length === 0) {
      this.entry.parameters = [Markdown.defaultContent()];
    }
  }

  get html(): string {
    const markdown = join(this.entry.parameters, Markdown.defaultContent);
    const interpolated = interpolate(this.entry.variables, this.entry.values, markdown);
    return Marked.parse(interpolated);
  }

  get editMarkdown(): string {
    return join(this.edit.parameters);
  }

  set editMarkdown(value: string) {
    this.edit.parameters = value.split("\n");
  }

  get missingVariables(): string[] {
    const markdown = join(this.edit.parameters, Markdown.defaultContent);
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
    this.entry.error = "";

    const markdown = this.editMarkdown.trim();
    if (markdown.length === 0) {
      this.entry.error = "The markdown cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private static variableNameRegex(): RegExp {
    return /\${[A-Z0-9_-]+}/;
  }

  private static defaultContent(): string {
    return (
      "_**Lorem ipsum** dolor sit amet, consectetur adipiscing elit. Maecenas velit urna, bibendum ut finibus" +
      "id, lacinia quis ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos" +
      "himenaeos. Nunc sollicitudin turpis in purus consectetur faucibus. Integer magna arcu, tempus at diam" +
      "id, maximus dapibus sapien. Vestibulum quis lobortis erat. In porttitor commodo ante non aliquam. Cras" +
      "rhoncus pharetra ipsum in hendrerit. Nam ut justo aliquam, vehicula risus non, vestibulum nisl. Aenean" +
      "quis convallis metus, ut porta est. Nulla ullamcorper erat sit amet mi porttitor, et porta magna" +
      "blandit._"
    );
  }
}
</script>

<style scoped>
.markdown >>> pre {
  padding: 5px;
  border: 1px solid black;
  border-radius: 2px;
  background-color: lightgrey;
  color: black;
  white-space: pre-wrap;
}

.markdown >>> pre code {
  border: 0;
  padding: 0;
  margin: 0;
}

.markdown >>> code {
  padding: 2px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  background-color: lightgrey;
  color: black;
}

.markdown >>> a code {
  color: -webkit-link;
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
