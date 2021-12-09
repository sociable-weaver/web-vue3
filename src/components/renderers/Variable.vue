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
  private name = "";
  private sensitive = true;
  private value = "";

  mounted(): void {
    this.name = this.entry.name;
    this.sensitive = this.readSensitiveFromEntity();
    this.value = this.readDefaultValueOrEmptyFromEntry();
  }

  private onVariableSet(): void {
    const previousValue = this.readDefaultValueOrEmptyFromEntry();
    if (this.value !== previousValue) {
      this.$emit("variableUpdated", { name: this.name, value: this.value, previousValue });
    }
  }

  private readSensitiveFromEntity(): boolean {
    if (this.entry.sensitive === undefined) {
      return true;
    }
    return this.entry.sensitive;
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
