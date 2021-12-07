<template>
  <h4>{{ subsection }}</h4>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Subsection",
  props: {
    entry: Object,
  },
})
export default class Subsection extends Vue {
  private entry!: Entry;
  private subsection = "";

  mounted(): void {
    this.subsection = this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss"></style>
