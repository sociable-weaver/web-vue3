<template>
  <pre>{{ command }}</pre>
</template>

<script lang="ts">
import { Entry, interpolate } from "@/models/Chapter";
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

    return interpolate(this.entry.variables, this.entry.values, command);
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
