<template>
  <div class="markdown" v-html="html" />
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
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
  private html = "";

  mounted(): void {
    const markdown = this.entry.parameters.join("\n");
    this.html = Marked.parse(markdown);
  }
}
</script>

<style scoped lang="scss"></style>