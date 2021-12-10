<template>
  <h3>{{ section }}</h3>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Section",
  props: {
    entry: Object,
  },
})
export default class Section extends Vue {
  private entry!: Entry;

  get section(): string {
    return this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss"></style>
