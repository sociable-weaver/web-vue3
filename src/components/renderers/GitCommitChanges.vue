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
  private command = "";

  mounted(): void {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    const message = this.entry.parameters[0];
    const tag = this.entry.parameters.length > 1 ? this.entry.parameters[1] : false;
    const pushChanges = this.entry.pushChanges || false;
    this.command = `${workingDirectory}${commandPromptSymbol} git add .`;
    this.command += `\n${workingDirectory}${commandPromptSymbol} git commit --message "${message}"`;
    if (tag) {
      this.command += `\n${workingDirectory}${commandPromptSymbol} git tag --annotate "${tag}" --message "${message}"`;
      if (pushChanges) {
        this.command += `\n${workingDirectory}${commandPromptSymbol} git push --atomic origin main "${tag}"`;
      }
    } else if (pushChanges) {
      this.command += `\n${workingDirectory}${commandPromptSymbol} git push origin main`;
    }
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
