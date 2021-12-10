<template>
  <pre>{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "GitCommitChanges",
  props: {
    entry: Object,
  },
})
export default class GitCommitChanges extends Vue {
  private entry!: Entry;

  get command(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    const message = this.entry.parameters[0];
    const tag = this.entry.parameters.length > 1 ? this.entry.parameters[1] : false;
    const pushChanges = this.entry.pushChanges || false;
    let command = `${workingDirectory}${commandPromptSymbol} git add .`;
    command += `\n${workingDirectory}${commandPromptSymbol} git commit --message "${message}"`;
    if (tag) {
      command += `\n${workingDirectory}${commandPromptSymbol} git tag --annotate "${tag}" --message "${message}"`;
      if (pushChanges) {
        command += `\n${workingDirectory}${commandPromptSymbol} git push --atomic origin main "${tag}"`;
      }
    } else if (pushChanges) {
      command += `\n${workingDirectory}${commandPromptSymbol} git push origin main`;
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
