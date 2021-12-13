<template>
  <pre>{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "GitTagCurrentCommit",
  props: {
    entry: Object,
  },
})
export default class GitTagCurrentCommit extends Vue {
  private entry!: Entry;

  get command(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    const tag = this.entry.parameters[0];
    const message = this.entry.parameters.length > 1 ? this.entry.parameters[1] : false;
    let command = `${workingDirectory}${commandPromptSymbol} git tag --annotate '${tag}'`;
    if (message) {
      command += ` --message '${message}'`;
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
