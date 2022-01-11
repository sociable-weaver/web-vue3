<template>
  <div v-if="entry.edit === true">
    <div role="working-directory" class="row">
      <label>Working directory</label>
      <input type="text" v-model="edit.workingDirectory" role="working-directory" />
      <div class="tip">The directory from the command will be running.</div>
    </div>
    <div role="command" class="row">
      <label>Command</label>
      <div class="template">
        <label>Template</label>
        <select @change="onUseTemplate($event)" title="Select a template to simplify the creation of commands">
          <option disabled selected value="">use template</option>
          <optgroup v-for="key in Object.keys(templates)" :key="key" :label="key">
            <option
              v-for="template in templates[key]"
              :key="key.concat('-').concat(template.name)"
              :value="JSON.stringify(template.parameters)"
            >
              {{ template.name }}
            </option>
          </optgroup>
        </select>
      </div>
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
      <input type="text" v-model.number="edit.expectedExitValue" role="expected-exit-value" />
      <div class="tip">
        All commands return a value when they finish, known as the
        <a href="https://en.wikipedia.org/wiki/Exit_status" target="_blank">exit value or exit status</a>. Generally,
        <code>0</code>, means that the program finish successfully. Set this value to indicate the expected exit value.
        In some examples, we may be expecting the command to fail, and finish with exit value <code>1</code>, for
        example.
      </div>
    </div>
    <div role="command-timeout" class="row">
      <label>Command timeout <span class="unit">(in seconds)</span></label>
      <input type="text" v-model.number="edit.commandTimeout" role="command-timeout" />
      <div class="tip">
        The command is terminated if it takes more than the set value. If no value is provided the command will be
        terminated if it takes more than 5 seconds to complete.
      </div>
    </div>
    <div role="ignore-errors" class="row">
      <label>Ignore errors</label>
      <input type="checkbox" v-model="edit.ignoreErrors" role="ignore-errors" />
      <div class="tip">
        There are commands that may fails, such as deleting a resource that does not exists. Check this checkbox if you
        like to ignore the errors and proceed.
      </div>
    </div>
    <div role="dry-run" class="row">
      <label>Dry run</label>
      <input type="checkbox" v-model="edit.dryRun" role="dry-run" />
      <div class="tip">Check to prevent commands from running</div>
    </div>
  </div>
  <div v-else>
    <div v-if="usesVariables" class="variables">
      <div>This command is using the following variables:</div>
      <ul>
        <li v-for="variable in entry.variables" :key="variable">
          <code>{{ variable }}</code>
        </li>
      </ul>
    </div>
    <div class="command">
      <div v-if="workingDirectory" role="workingDirectory" class="workingDirectory">
        Working from: <code>{{ workingDirectory }}</code>
      </div>
      <pre class="runnable">{{ command }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import {
  arrayContainsValues,
  createSaveEntry,
  Entry,
  hasChanged,
  interpolate,
  join,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
} from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

interface Template {
  name: string;
  parameters: string[];
}

type Templates = {
  [key: string]: Template[];
};

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
  private templates: Templates = Command.createTemplates();

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
    if (!arrayContainsValues(this.edit.parameters)) {
      this.edit.parameters = [Command.defaultCommand()];
    }
  }

  get usesVariables(): boolean {
    return arrayContainsValues(this.entry.variables);
  }

  get workingDirectory(): string {
    return this.entry.workingDirectory ? this.entry.workingDirectory : "";
  }

  get command(): string {
    let command = join(this.entry.parameters, Command.defaultCommand);
    return interpolate(this.entry.variables, this.entry.values, command);
  }

  get editCommand(): string {
    return join(this.edit.parameters);
  }

  set editCommand(value: string) {
    this.edit.parameters = value.split("\n");
  }

  private onUseTemplate(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.edit.parameters = JSON.parse(target.value) as string[];
    target.value = "";
  }

  get missingVariables(): string[] {
    const command = join(this.edit.parameters);
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
    const command = this.editCommand.trim();
    if (command.length === 0) {
      this.entry.error = "The command cannot be empty";
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

  private static defaultCommand(): string {
    return "echo 'Hello world!!'";
  }

  private static createTemplates(): Templates {
    return {
      Commands: [
        { name: "echo 'Hello world!!'", parameters: ["echo 'Hello world!!'"] },
        { name: "curl", parameters: ["curl --location 'link' --output 'path'"] },
        { name: "SHA-256", parameters: ["openssl dgst -sha256 'src/test/resources/fixtures/sample.txt'"] },
      ],
      Git: [
        {
          name: "init",
          parameters: ["git init --initial-branch=main"],
        },
        {
          name: "config user",
          parameters: ["git config user.name '${DEVELOPER_NAME}'", "git config user.email '${DEVELOPER_EMAIL}'"],
        },
        {
          name: "add and commit",
          parameters: [
            "git add .",
            "git commit --message 'Commit message'",
            "git tag --annotate 'v1.0.0' --message 'Tag Message'",
            "git push --atomic origin main 'v1.0.0'",
          ],
        },
        {
          name: "push",
          parameters: ["git push origin main"],
        },
        {
          name: "tag last commit",
          parameters: ["git tag --annotate 'v1.0.0' --message 'Tag Message'"],
        },
        {
          name: "list config",
          parameters: ["git config --list"],
        },
      ],
      Gradle: [
        {
          name: "init",
          parameters: ["gradle init --type basic --dsl groovy --project-name hello-world"],
        },
        {
          name: "version",
          parameters: ["./gradlew --version"],
        },
        {
          name: "set wrapper version",
          parameters: ["./gradlew wrapper --gradle-version=7.3.3"],
        },
        {
          name: "create src",
          parameters: [
            "mkdir -p 'src/main/java'",
            "mkdir -p 'src/main/resources'",
            "mkdir -p 'src/test/java'",
            "mkdir -p 'src/test/resources'",
          ],
        },
        {
          name: "list tasks",
          parameters: ["./gradlew tasks"],
        },
        {
          name: "build",
          parameters: ["./gradlew build"],
        },
        {
          name: "run",
          parameters: ["./gradlew run"],
        },
        {
          name: "dependencies",
          parameters: ["./gradlew dependencies --configuration runtimeClasspath"],
        },
        {
          name: "dependency insight",
          parameters: ["./gradlew dependencyInsight --dependency org.slf4j:slf4j-api --configuration runtimeClasspath"],
        },
      ],
      Docker: [{ name: "tag and push", parameters: ["docker tag source remote", "docker push remote"] }],
    };
  }
}
</script>

<style scoped lang="scss">
.variables ul {
  margin-top: 0;
}

div.command {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

div.workingDirectory {
  padding-bottom: 0;
  margin-bottom: 0;
}

pre {
  padding: 5px;
  margin-top: 0;
  margin-bottom: 0;
  border: 1px solid black;
  border-radius: 2px;
  background-color: black;
  color: greenyellow;
}

div.row {
  padding-top: 15px;
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

.tip {
  font-size: 0.8em;
  font-style: italic;
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
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 2px;
  width: 99%;
  color: #2c3e50;
}

.unit {
  font-size: 0.8em;
}

label {
  font-size: 1.2em;
  padding-right: 5px;
}

div.template {
  float: right;
  margin-left: auto;
  margin-right: 10px;
  display: inline-block;
}
</style>
