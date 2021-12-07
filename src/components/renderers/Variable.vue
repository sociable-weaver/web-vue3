<template>
  <div>
    <div>Variable</div>
    <label for="{{name}}-value">{{ name }}</label>
    <input type="password" v-if="sensitive" v-model="value" id="{{name}}-value" />
    <input v-else v-model="value" id="{{name}}-value" />
    <button>Set</button>
  </div>
</template>

<script lang="ts">
import { Entry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Variable",
  props: {
    entry: Object,
  },
})
export default class Variable extends Vue {
  private entry!: Entry;
  private name = "";
  private sensitive = true;
  private value = "";

  mounted(): void {
    this.name = this.entry.name;
    this.sensitive = this.entry.sensitive === undefined ? true : this.entry.sensitive;
    this.value =
      this.entry.parameters !== undefined && this.entry.parameters.length > 0 ? this.entry.parameters[0] : "";
  }
}
</script>

<style scoped lang="scss"></style>
