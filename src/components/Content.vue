<template>
  <div>
    <div
      v-for="(entry, index) in chapter.entries"
      :key="entry.id"
      :id="entry.id"
      class="entry"
      @mouseenter="onMouseEnter(entry)"
      @mouseleave="onMouseLeave(entry)"
    >
      <ChapterRenderer v-if="entry.type === 'chapter'" :entry="entry" />
      <Command v-else-if="entry.type === 'command'" :entry="entry" />
      <GitApplyPatch v-else-if="entry.type === 'git-apply-patch'" :entry="entry" />
      <Markdown v-else-if="entry.type === 'markdown'" :entry="entry" />
      <Question v-else-if="entry.type === 'question'" :entry="entry" />
      <Section v-else-if="entry.type === 'section'" :entry="entry" />
      <Subsection v-else-if="entry.type === 'subsection'" :entry="entry" />
      <Todo v-else-if="entry.type === 'todo'" :entry="entry" />
      <Variable
        v-else-if="entry.type === 'variable'"
        :entry="entry"
        @variable-updated="onVariableUpdated"
        @variable-initialised="onVariableInitialised"
      />
      <div v-else class="error" role="error">
        Do not know how to renter entries of type: <code>{{ entry.type }}</code>
      </div>
      <pre v-if="entry.output" class="output" :class="{ error: entry.failed }">{{ entry.output }}</pre>
      <pre v-if="entry.error" class="error">{{ entry.error }}</pre>
      <div v-if="entry.edit === true" class="buttons-bar" role="buttons-bar">
        <div class="buttons editable" role="save-buttons">
          <button :disabled="disabled" @click="onCancel(entry)">Cancel</button>
          <button :disabled="disabled" @click="onSave(entry)" class="primary" role="save">Save</button>
        </div>
      </div>
      <div v-else class="buttons-bar" role="run-buttons">
        <div v-if="isRunnable(entry)" class="buttons runnable">
          <button :disabled="disabled" @click="onCopy(entry)" class="green" title="Copy this command to the clipboard">
            Copy
          </button>
          <button :disabled="disabled" @click="onRun(entry)" class="primary" title="Run this command">Run</button>
          <button
            :disabled="disabled"
            @click="onRunUntilHere(index)"
            title="Run all commands from the beginning until this one"
          >
            Run until here
          </button>
        </div>
        <div v-if="entry.error || entry.output" class="buttons runnable">
          <button :disabled="disabled" @click="onClear(entry)" class="clear" title="Clear the command output from here">
            Clear
          </button>
        </div>
        <div class="buttons editable" role="edit-buttons" v-if="entry.showEditControls">
          <button :disabled="disabled" @click="onDelete(entry)" class="danger" title="Delete this entry">Delete</button>
          <select :disabled="disabled" @change="onAddNext($event, entry)" title="Add a new enter right after this one">
            <option disabled selected value="">Add next</option>
            <option value="command">Command</option>
            <option value="markdown">Markdown</option>
            <option value="git-apply-patch">Patch</option>
            <option value="section">Section</option>
            <option value="subsection">Subsection</option>
            <option value="todo">Todo</option>
            <option value="variable">Variable</option>
          </select>
          <button
            :disabled="disabled"
            @click="onEdit(entry)"
            title="Show this entry in edit mode, from where you can change it"
          >
            Edit
          </button>
          <button
            :disabled="disabled"
            @click="onAddQuestion(entry)"
            class="dark-blue"
            title="Add a question to the content"
          >
            Ask a question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChapterRenderer from "@/components/renderers/Chapter.vue";
import Command from "@/components/renderers/Command.vue";
import GitApplyPatch from "@/components/renderers/GitApplyPatch.vue";
import Markdown from "@/components/renderers/Markdown.vue";
import Question from "@/components/renderers/Question.vue";
import Section from "@/components/renderers/Section.vue";
import Subsection from "@/components/renderers/Subsection.vue";
import Todo from "@/components/renderers/Todo.vue";
import Variable from "@/components/renderers/Variable.vue";
import {
  Book,
  Chapter,
  doAllVariablesHaveValues,
  Entry,
  OnSaveOutcome,
  OnSaveResult,
  SaveEntry,
  VariableInitialised,
  VariableUpdated,
} from "@/models/Chapter";
import { runEntry, RunnableEntry } from "@/services/RunEntryService";
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

interface CreateEntry {
  type: string;
  afterEntryWithId: string;
}

@Options({
  name: "Content",
  props: {
    book: Object,
  },
  components: {
    ChapterRenderer,
    Command,
    GitApplyPatch,
    Markdown,
    Question,
    Section,
    Subsection,
    Todo,
    Variable,
  },
  emits: ["variableUpdated", "variableInitialised"],
})
export default class Content extends Vue {
  private book!: Book;
  private disabled = false;

  private isRunnable(entry: Entry): boolean {
    const runnable = [
      "command",
      "create",
      "docker-tag-and-push",
      "download",
      "git-apply-patch",
      "git-commit-changes",
      "git-tag-current-commit",
      "replace",
    ];
    return runnable.find((type) => type === entry.type) !== undefined;
  }

  private get chapter(): Chapter {
    const chapterIndex = this.book.chapterIndex;
    return this.book.chapters[chapterIndex];
  }

  private onMouseEnter(entry: Entry): void {
    entry.showEditControls = true;
  }

  private onMouseLeave(entry: Entry): void {
    entry.showEditControls = false;
  }

  private onCopy(entry: Entry): void {
    entry.error = "This feature is not yet implements!!";
  }

  private onRun(entry: Entry): void {
    this.disabled = true;

    const onComplete = () => {
      /* Do nothing */
    };
    const onFinally = () => (this.disabled = false);

    this.run(entry, onComplete, onFinally);
  }

  private onRunUntilHere(index: number): void {
    this.disabled = true;
    this.runNext(0, index);
  }

  private runNext(index: number, until: number) {
    if (index > until) {
      this.disabled = false;
      return;
    }

    const entry: Entry = this.chapter.entries[index];
    if (!this.isRunnable(entry) || entry.dryRun) {
      this.runNext(index + 1, until);
      return;
    }

    this.scrollToEntry(entry);

    const onComplete = () => this.runNext(index + 1, until);
    const onFinally = () => {
      /* Do nothing */
    };

    this.run(entry, onComplete, onFinally);
  }

  private run(entry: Entry, onComplete: () => void, onFinally: () => void) {
    entry.failed = false;
    entry.output = "";
    entry.error = "";

    if (!doAllVariablesHaveValues(entry)) {
      entry.failed = true;
      entry.error = "Variables not set!!";
      return;
    }

    const runnableEntry = this.createRunnableEntry(entry);
    runEntry(runnableEntry, (message) => (entry.output += message.content))
      .then((result) => {
        switch (result.content) {
          case "FINISHED_AS_EXPECTED":
          case "FINISHED_WITH_SUPPRESSED_ERROR":
            onComplete();
            break;
          default:
            this.disabled = false;
            entry.failed = true;
        }
      })
      .catch((e) => {
        this.disabled = false;
        entry.error = `Failed to run (${formatError(e)})`;
      })
      .finally(onFinally);
  }

  private createRunnableEntry(entry: Entry): RunnableEntry {
    return {
      type: entry.type,
      id: entry.id,
      name: entry.name,
      workPath: this.book.workPath,
      workingDirectory: entry.workingDirectory,
      parameters: Object.assign([], entry.parameters),
      variables: Object.assign([], entry.variables),
      environmentVariables: Object.assign([], entry.environmentVariables),
      values: Object.assign({}, entry.values),
      ignoreErrors: entry.ignoreErrors,
      pushChanges: entry.pushChanges,
      dryRun: entry.dryRun,
      expectedExitValue: entry.expectedExitValue,
      commandTimeout: entry.commandTimeout,
    };
  }

  private onClear(entry: Entry): void {
    entry.output = "";
    entry.error = "";
  }

  private onDelete(entry: Entry): void {
    this.disabled = true;
    entry.error = "";

    this.deleteEntry(entry.id)
      .then(() => {
        const index = this.chapter.entries.indexOf(entry);
        if (index == -1) {
          entry.error = "Entry was deleted from the chapter file but cannot update the UI";
        } else {
          this.chapter.entries.splice(index, 1);
        }
      })
      .catch((e) => (entry.error = `Failed to delete entry (${formatError(e)})`))
      .finally(() => (this.disabled = false));
  }

  private deleteEntry(entryId: string): Promise<Entry> {
    return apiClient
      .delete("/api/entry", {
        params: {
          bookPath: this.book.bookPath,
          chapterPath: this.chapter.chapterPath,
          entryId: entryId,
        },
      })
      .then((response) => response.data);
  }

  private onAddNext(event: Event, entry: Entry): void {
    const target = event.target as HTMLSelectElement;
    const type = target.value;
    target.value = "";

    const create = { type, afterEntryWithId: entry.id };
    this.handleCreateEntry(create, entry);
  }

  private onEdit(entry: Entry): void {
    entry.edit = true;
  }

  private onAddQuestion(entry: Entry): void {
    const create = { type: "question", afterEntryWithId: entry.id };
    this.handleCreateEntry(create, entry);
  }

  private handleCreateEntry(create: CreateEntry, entry: Entry): void {
    this.disabled = true;
    entry.error = "";

    this.createEntry(create)
      .then((created) => {
        created.edit = true;
        created.workingDirectory = entry.workingDirectory;
        const index = this.chapter.entries.indexOf(entry);
        this.chapter.entries.splice(index + 1, 0, created);
      })
      .catch((e) => (entry.error = `Failed to create entry (${formatError(e)})`))
      .finally(() => (this.disabled = false));
  }

  private createEntry(entry: CreateEntry): Promise<Entry> {
    return apiClient
      .post("/api/entry", entry, {
        params: {
          bookPath: this.book.bookPath,
          chapterPath: this.chapter.chapterPath,
        },
      })
      .then((response) => response.data);
  }

  private onCancel(entry: Entry): void {
    entry.edit = false;
  }

  private onSave(entry: Entry): void {
    entry.error = "";
    const result: OnSaveResult = entry.onSave();
    switch (result.outcome as OnSaveOutcome) {
      case OnSaveOutcome.Changed:
        this.handleChanged(entry, result.entry as SaveEntry);
        break;

      case OnSaveOutcome.NotChanged:
        this.handleNotChanged(entry);
        break;
    }
  }

  private handleChanged(entry: Entry, saveEntry: SaveEntry): void {
    this.disabled = true;
    this.saveEntry(saveEntry)
      .then((saved) => Object.assign(entry, saved))
      .then((updated) => (updated.edit = false))
      .catch((e) => (entry.error = `Failed to save entry (${formatError(e)})`))
      .finally(() => (this.disabled = false));
  }

  private handleNotChanged(entry: Entry): void {
    entry.edit = false;
  }

  private saveEntry(entry: SaveEntry): Promise<Entry> {
    return apiClient
      .put("/api/entry", entry, {
        params: {
          bookPath: this.book.bookPath,
          chapterPath: this.chapter.chapterPath,
        },
      })
      .then((response) => response.data);
  }

  private onVariableInitialised(init: VariableInitialised): void {
    this.$emit("variableInitialised", init);
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.$emit("variableUpdated", update);
  }

  private scrollToEntry(entry: Entry): void {
    const element = document.getElementById(entry.id);
    if (element !== null) {
      element.scrollIntoView({ behavior: "auto" });
    }
  }
}
</script>

<style scoped lang="scss">
.entry {
  padding: 2px 10px;
  margin-bottom: 5px;
}

//.entry:hover {
//  border-radius: 2px;
//  background-color: whitesmoke;
//  filter: drop-shadow(5px 5px 5px #666666);
//}

div.error {
  border-radius: 2px;
  border: 1px solid #5e5e5a;
  padding: 5px;
  background-color: orangered;
  color: white;
}

pre.output {
  border-radius: 2px;
  border: 1px solid #5e5e5a;
  padding: 5px;
  background-color: lightgray;
  color: black;
  white-space: pre-wrap;
}

pre.error {
  border-radius: 2px;
  border: 1px solid #5e5e5a;
  padding: 5px;
  background-color: orangered;
  color: white;
  white-space: pre-wrap;
}

div.editable {
  float: right;
  right: 0;
}

div.buttons-bar {
  height: 30px;
}
div.buttons-bar::after {
  content: "";
  clear: both;
  display: table;
}

div.buttons {
  display: inline;
}

button.clear {
  margin-left: 5px;
}
</style>
