<template>
  <div class="markdown" v-html="html" />
</template>

<script lang="ts">
import { Entry, interpolate } from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Markdown",
  props: {
    entry: Object,
  },
})
export default class Markdown extends Vue {
  private entry!: Entry;

  get html(): string {
    const markdown = this.entry.parameters.join("\n");
    const interpolated = interpolate(this.entry.variables, this.entry.values, markdown);
    return Marked.parse(interpolated);
  }
}
</script>

<style scoped>
.markdown >>> pre {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: lightgrey;
  color: black;
}
</style>
