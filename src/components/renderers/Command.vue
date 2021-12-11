<template>
  <pre>{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Command",
  props: {
    entry: Object,
  },
})
export default class Command extends Vue {
  private entry!: Entry;

  get command(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    let command = `${workingDirectory}${commandPromptSymbol} ${this.entry.parameters.join("\n")}`;

    if (this.entry.variables != undefined && this.entry.values != undefined) {
      this.entry.variables.forEach((variable) => {
        const value = this.entry.values[variable];
        if (value !== undefined) {
          command = command.replaceAll(`\${${variable}}`, value);
        }
      });
    }

    return command;
  }
}
</script>

<style scoped lang="scss">
pre {
  padding: 5px;
  background-color: black;
  color: greenyellow;
}
</style>
