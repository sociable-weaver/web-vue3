<template>
  <h2>{{ chapter }}</h2>
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

  get chapter(): string {
    return this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss"></style>
