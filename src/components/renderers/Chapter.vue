<template>
  <div v-if="entry.edit === true">
    <input v-model="editChapter" placeholder="Title" />
  </div>
  <h2 v-else>{{ chapter }}</h2>
</template>

<script lang="ts">
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Chapter",
  props: {
    entry: Object,
  },
})
export default class Chapter extends Vue {
  private entry!: Entry;
  private editChapter = "";

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.editChapter = this.entry.parameters[0];
  }

  private onSave(): OnSaveOutcome {
    this.entry.error = "";
    if (this.editChapter.length === 0) {
      this.entry.error = "The chapter title cannot be empty";
      return OnSaveOutcome.KeepEditing;
    }

    if (this.editChapter !== this.entry.parameters[0]) {
      this.entry.parameters = [this.editChapter];
      return OnSaveOutcome.Changed;
    }

    return OnSaveOutcome.NotChanged;
  }

  get chapter(): string {
    return this.entry.parameters[0];
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
