<template>
  <div class="filePath">Replace the file: {{ filePath }}, with the following contents</div>
  <pre class="content">{{ content }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Replace",
  props: {
    entry: Object,
  },
})
export default class Replace extends Vue {
  private entry!: Entry;

  get filePath(): string {
    const workingDirectory = this.entry.workingDirectory ? `${this.entry.workingDirectory}/` : "";
    return `${workingDirectory}${this.entry.parameters[0]}`;
  }

  get content(): string {
    return `${this.entry.parameters.slice(1).join("\n")}\n`;
  }
}
</script>

<style scoped lang="scss">
pre {
  padding: 5px;
  background-color: black;
  color: darkgoldenrod;
}
</style>
