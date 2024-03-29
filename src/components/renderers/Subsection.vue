<template>
  <div v-if="entry.edit === true">
    <input v-model="editSubsection" placeholder="Subsection" />
  </div>
  <h4 v-else>{{ subsection }}</h4>
</template>

<script lang="ts">
import {
  createSaveEntry,
  Entry,
  getElement,
  hasChanged,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
} from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Subsection",
  props: {
    entry: Object,
  },
})
export default class Subsection extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = {} as SaveEntry;

  created(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get subsection(): string {
    return getElement(this.entry.parameters);
  }

  get editSubsection(): string {
    return getElement(this.edit.parameters);
  }

  set editSubsection(value: string) {
    this.edit.parameters = [value];
  }

  private onSave(): OnSaveResult {
    if (getElement(this.edit.parameters).length === 0) {
      this.entry.error = "The subsection cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }
}
</script>

<style scoped lang="scss">
input {
  font-size: 1em;
  font-weight: bold;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  width: 99%;
  color: #2c3e50;
}

h4 {
  margin-top: 2em;
  padding: 1px;
}
</style>
