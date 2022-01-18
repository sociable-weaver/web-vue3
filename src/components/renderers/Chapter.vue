<template>
  <div v-if="entry.edit === true">
    <input v-model="editChapter" placeholder="Chapter" />
  </div>
  <h2 v-else>{{ chapter }}</h2>
</template>

<script lang="ts">
import {
  createSaveEntry,
  Entry,
  getElement,
  getPart,
  hasChanged,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
  setPart,
} from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

const TITLE_PART = "Title";
const DESCRIPTION_PART = "Description";

@Options({
  name: "Chapter",
  props: {
    entry: Object,
  },
})
export default class Chapter extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = {} as SaveEntry;

  created(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get chapter(): string {
    return getElement(Chapter.getTitlePart(this.entry.parameters));
  }

  get editChapter(): string {
    return getElement(Chapter.getTitlePart(this.entry.parameters));
  }

  set editChapter(value: string) {
    this.setTitlePart(value);
  }

  private onSave(): OnSaveResult {
    const title = Chapter.getTitlePart(this.edit.parameters);
    console.log("Title", title);
    if (title.length === 0 || title[0].length === 0) {
      this.entry.error = "The chapter cannot be empty";
      return { outcome: OnSaveOutcome.KeepEditing } as OnSaveResult;
    }

    if (hasChanged(this.entry, this.edit)) {
      return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
    }

    return { outcome: OnSaveOutcome.NotChanged } as OnSaveResult;
  }

  private static getTitlePart(parameters: string[]): string[] {
    return getPart(TITLE_PART, parameters);
  }

  private setTitlePart(value: string): void {
    setPart(TITLE_PART, [value], this.edit.parameters);
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
