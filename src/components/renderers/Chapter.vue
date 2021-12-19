<template>
  <div v-if="entry.edit === true">
    <input v-model="editChapter" placeholder="Chapter title" />
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

  get editChapter(): string {
    return this.getChapterFrom(this.edit.parameters);
  }

  set editChapter(value: string) {
    this.edit.parameters = [value];
  }

  private onSave(): OnSaveResult {
    this.entry.error = "";
    if (this.edit.parameters[0].length === 0) {
      this.entry.error = "The chapter title cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (this.edit.parameters[0] !== this.entry.parameters[0]) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  get chapter(): string {
    return this.getChapterFrom(this.entry.parameters);
  }

  private getChapterFrom(parameters: string[]): string {
    return !Array.isArray(parameters) || parameters.length == 0 ? "" : parameters[0];
  }
}
</script>

<style scoped lang="scss">
input {
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  width: 99%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h2 {
  padding: 1px;
}
</style>
