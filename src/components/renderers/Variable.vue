<template>
  <div>
    <div>Variable</div>
    <label for="{{name}}-value">{{ name }}</label>
    <input type="password" v-if="sensitive" v-model="value" id="{{name}}-value" />
    <input v-else v-model="value" id="{{name}}-value" />
    <button @click="onVariableSet">Set</button>
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
  emits: ["variableUpdated"],
})
export default class Variable extends Vue {
  private entry!: Entry;
  private value = "";

  mounted(): void {
    this.value = this.readDefaultValueOrEmptyFromEntry();
  }

  get name(): string {
    return this.entry.name;
  }

  get sensitive(): boolean {
    if (this.entry.sensitive === undefined) {
      return true;
    }

    return this.entry.sensitive;
  }

  private onVariableSet(): void {
    const previousValue = this.readDefaultValueOrEmptyFromEntry();
    if (this.value !== previousValue) {
      this.$emit("variableUpdated", { name: this.entry.name, value: this.value, previousValue });
    }
  }

  private readDefaultValueOrEmptyFromEntry(): string {
    if (this.entry.parameters === undefined || this.entry.parameters.length == 0) {
      return "";
    }

    return this.entry.parameters[0];
  }
}
</script>

<style scoped lang="scss"></style>