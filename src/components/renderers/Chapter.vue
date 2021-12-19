<template>
  <div v-if="entry.edit === true">
    <input v-model="editChapter" placeholder="Chapter" />
  </div>
  <h2 v-else>{{ chapter }}</h2>
</template>

<script lang="ts">
import { createSaveEntry, Entry, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Chapter",
  props: {
    entry: Object,
  },
})
export default class Chapter extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: [""] } as SaveEntry;

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get chapter(): string {
    return Chapter.getChapterFrom(this.entry.parameters);
  }

  get editChapter(): string {
    return Chapter.getChapterFrom(this.edit.parameters);
  }

  set editChapter(value: string) {
    this.edit.parameters = [value];
  }

  private onSave(): OnSaveResult {
    if (this.edit.parameters[0].length === 0) {
      this.entry.error = "The chapter cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (this.hasChanged()) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private hasChanged() {
    return this.edit.parameters[0] !== this.entry.parameters[0];
  }

  private static getChapterFrom(parameters: string[]): string {
    return !Array.isArray(parameters) || parameters.length == 0 ? "" : parameters[0];
  }
}
</script>

<style scoped lang="scss">
input {
  font-size: 1.5em;
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

h2 {
  padding: 1px;
}
</style>
