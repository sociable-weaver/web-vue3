<template>
  <h2 class="chapter">{{ chapter }}</h2>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Chapter",
  props: {
    entry: Object,
  },
})
export default class Chapter extends Vue {
  private entry!: Entry;
  private chapter = "";

  mounted(): void {
    this.chapter = this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss"></style>