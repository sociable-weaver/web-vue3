<template>
  <pre class="command">{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "DockerTagAndPush",
  props: {
    entry: Object,
  },
})
export default class DockerTagAndPush extends Vue {
  private entry!: Entry;
  private command = "";

  mounted(): void {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    const source = this.entry.parameters[0];
    const remote = this.entry.parameters[1];
    this.command = `${workingDirectory}${commandPromptSymbol} docker tag ${source} ${remote}\n`;
    this.command += `${workingDirectory}${commandPromptSymbol} docker push ${remote}`;
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
