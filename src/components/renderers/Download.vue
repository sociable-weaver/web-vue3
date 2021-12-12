<template>
  <pre class="download">{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Download",
  props: {
    entry: Object,
  },
})
export default class Download extends Vue {
  private entry!: Entry;

  get command(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory} ` : "";
    const commandPromptSymbol = "$";
    const link = this.entry.parameters[0];
    const path = this.entry.parameters[1];
    return `${workingDirectory}${commandPromptSymbol} curl --location '${link}' --output '${path}'`;
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
