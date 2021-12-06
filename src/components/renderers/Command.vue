<template>
  <pre class="command">{{ command }}</pre>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Command",
  props: {
    entry: Object,
  },
})
export default class Command extends Vue {
  private entry!: Entry;
  private command = "";

  mounted(): void {
    this.command = "$ " + this.entry.parameters.join(" ");
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
