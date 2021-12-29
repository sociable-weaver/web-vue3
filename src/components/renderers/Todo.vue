<template>
  <div v-if="entry.edit === true">
    <div role="variables" class="row">
      <label>Todo</label>
      <textarea v-model="editMarkdown" placeholder="Markdown" />
    </div>
  </div>
  <div v-else>
    <label>Todo</label>
    <div class="todo" v-html="html" />
  </div>
</template>

<script lang="ts">
import { createSaveEntry, Entry, interpolate, OnSaveOutcome, OnSaveResult, SaveEntry } from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Todo",
  props: {
    entry: Object,
  },
})
export default class Todo extends Vue {
  private entry!: Entry;
  private edit: SaveEntry = { parameters: [""] } as SaveEntry;

  mounted(): void {
    this.entry.onSave = this.onSave;
    this.edit = createSaveEntry(this.entry);
  }

  get html(): string {
    const markdown = this.entry.parameters.join("\n");
    const interpolated = interpolate(this.entry.variables, this.entry.values, markdown);
    return Marked.parse(interpolated);
  }

  get editMarkdown(): string {
    return this.edit.parameters.join("\n");
  }

  set editMarkdown(value: string) {
    this.edit.parameters = value.split("\n");
  }

  private onSave(): OnSaveResult {
    /* TODO: Check before saving!!  We are saving empty markdowns and even if the value is not changed. */
    return { outcome: OnSaveOutcome.Changed, entry: this.edit } as OnSaveResult;
  }
}
</script>

<style scoped>
.todo {
  background-color: #ffb6ba;
  padding: 10px;
}

.todo >>> pre {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: lightgrey;
  color: black;
}

div.row {
  padding-top: 15px;
}

textarea {
  width: 100%;
  min-height: 400px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

label {
  font-size: 1.2em;
}
</style>
