<template>
  <div v-if="entry.edit === true">
    <div role="working-directory" class="row">
      <label>Working directory</label>
      <input type="text" v-model="edit.workingDirectory" role="working-directory" />
    </div>
    <div role="command" class="row">
      <label>Command</label>
      <textarea v-model="editCommand" placeholder="command" role="command" />
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
    <div role="environment-variables" class="row">
      <label>Environment Variables</label>
      <div v-for="(variable, index) in edit.environmentVariables" :key="variable" role="environment-variable">
        <input
          @change="onUpdateEnvironmentVariable(variable, index, $event)"
          :value="variable"
          role="update-environment-variable"
        />
        <button @click="onRemoveEnvironmentVariable(index)" role="remove-environment-variable">Remove</button>
      </div>
      <div>
        <input
          v-model="newEnvironmentVariable"
          placeholder="Environment Variable Name"
          role="new-environment-variable"
        />
        <button @click="onAddEnvironmentVariable" role="add-environment-variable">Add</button>
      </div>
    </div>
    <div role="expected-exit-value" class="row">
      <label>Expected exit value</label>
      <input type="text" v-model="edit.expectedExitValue" role="expected-exit-value" />
    </div>
  </div>
  <pre v-else>{{ command }}</pre>
</template>

<script lang="ts">
import { createSaveEntry, Entry, interpolate, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Command",
  props: {
    entry: Object,
  },
})
export default class Command extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: [""] } as SaveEntry;
  private newVariable = "";
  private newEnvironmentVariable = "";

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get command(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    let command = `${workingDirectory}${commandPromptSymbol} ${this.entry.parameters.join("\n")}`;

    return interpolate(this.entry.variables, this.entry.values, command);
  }

  get editCommand(): string {
    return this.edit.parameters.join("\n");
  }

  set editCommand(value: string) {
    this.edit.parameters = value.split("\n");
  }

  get missingVariables(): string[] {
    const command = this.edit.parameters.join("\n");
    const match = command.match(Command.variableNameRegex()) || [];
    return match.map((v) => v.substring(2, v.length - 1)).filter((v) => !this.edit.variables.includes(v));
  }

  private onAddVariable(): void {
    this.entry.error = "";
    const variable = this.newVariable.trim().toUpperCase();

    if (variable.length === 0) {
      this.entry.error = "Cannot add a variable without name";
      return;
    }

    const regex = Command.variableNameRegex();
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

  private onAddEnvironmentVariable(): void {
    this.entry.error = "";
    const variable = this.newEnvironmentVariable.trim().toUpperCase();

    if (variable.length === 0) {
      this.entry.error = "Cannot add an environment variable without name";
      return;
    }

    const regex = Command.variableNameRegex();
    if (!regex.test(`\${${variable}}`)) {
      this.entry.error = "Invalid environment variable name.  Only letters, numbers, underscore and dash are permitted";
      return;
    }

    if (this.edit.environmentVariables.includes(variable)) {
      this.entry.error = "Another environment variable with the same name already exists";
      return;
    }

    this.edit.environmentVariables.push(variable);
    this.newEnvironmentVariable = "";
  }

  private onUpdateEnvironmentVariable(currentValue: string, index: number, event: Event): void {
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

    if (this.edit.environmentVariables.includes(variable)) {
      this.entry.error = "Another variable with the same name already exists";
      target.value = currentValue;
      return;
    }

    this.edit.environmentVariables[index] = variable;
  }

  private onRemoveEnvironmentVariable(index: number): void {
    this.edit.environmentVariables.splice(index, 1);
  }

  private onAddMissingVariable(variable: string): void {
    this.edit.variables.push(variable);
  }

  private onSave(): OnSaveResult {
    const command = this.entry.parameters.join("\n").trim();
    if (command.length === 0) {
      this.entry.error = "The command cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (this.hasChanged()) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private hasChanged() {
    return this.entry.parameters.join("\n") !== this.edit.parameters.join("\n");
  }

  private static variableNameRegex(): RegExp {
    return /\${[A-Z0-9_-]+}/;
  }
}
</script>

<style scoped lang="scss">
pre {
  padding: 5px;
  background-color: black;
  color: greenyellow;
}

div.row {
  padding-top: 15px;
}

input[type="text"] {
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

textarea {
  width: 99%;
  min-height: 200px;
  font-family: monospace;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

label {
  font-size: 1.2em;
}
</style>
