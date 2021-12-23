<template>
  <div class="content">
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
      <Create v-else-if="entry.type === 'create'" :entry="entry" />
      <DockerTagAndPush v-else-if="entry.type === 'docker-tag-and-push'" :entry="entry" />
      <Download v-else-if="entry.type === 'download'" :entry="entry" />
      <GitApplyPatch v-else-if="entry.type === 'git-apply-patch'" :entry="entry" />
      <GitCommitChanges v-else-if="entry.type === 'git-commit-changes'" :entry="entry" />
      <GitTagCurrentCommit v-else-if="entry.type === 'git-tag-current-commit'" :entry="entry" />
      <Markdown v-else-if="entry.type === 'markdown'" :entry="entry" />
      <Replace v-else-if="entry.type === 'replace'" :entry="entry" />
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
          <button :disabled="disabled" @click="onRun(entry)" class="primary" title="Run this command">Run</button>
          <button
            :disabled="disabled"
            @click="onRunUntilHere(index)"
            title="Run all commands from the beginning until this one"
          >
            Run until here
          </button>
        </div>
        <div class="buttons editable" role="edit-buttons" v-if="entry.showEditControls">
          <button :disabled="disabled" @click="onDelete(entry)" class="danger" title="Delete this entry">Delete</button>
          <select :disabled="disabled" @change="onAddNext($event, entry)" title="Add a new enter right after this one">
            <option disabled selected value="">Add next</option>
            <option value="chapter">Chapter</option>
            <optgroup label="Command">
              <option value="command">Blank</option>
              <option value="docker-tag-and-push">Docker Tag and Push</option>
              <option value="download">Download</option>
              <option value="git-apply-patch">Git Apply Patch</option>
              <option value="git-commit-changes">Git Commit Changes</option>
              <option value="git-tag-current Commit">Git Tag Current Commit</option>
            </optgroup>
            <option value="create">Create</option>
            <option value="markdown">Markdown</option>
            <option value="replace">Replace</option>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChapterRenderer from "@/components/renderers/Chapter.vue";
import Command from "@/components/renderers/Command.vue";
import Create from "@/components/renderers/Create.vue";
import DockerTagAndPush from "@/components/renderers/DockerTagAndPush.vue";
import Download from "@/components/renderers/Download.vue";
import GitApplyPatch from "@/components/renderers/GitApplyPatch.vue";
import GitCommitChanges from "@/components/renderers/GitCommitChanges.vue";
import GitTagCurrentCommit from "@/components/renderers/GitTagCurrentCommit.vue";
import Markdown from "@/components/renderers/Markdown.vue";
import Replace from "@/components/renderers/Replace.vue";
import Section from "@/components/renderers/Section.vue";
import Subsection from "@/components/renderers/Subsection.vue";
import Todo from "@/components/renderers/Todo.vue";
import Variable from "@/components/renderers/Variable.vue";
import {
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
    chapter: Object,
  },
  components: {
    ChapterRenderer,
    Command,
    Create,
    DockerTagAndPush,
    Download,
    GitApplyPatch,
    GitCommitChanges,
    GitTagCurrentCommit,
    Markdown,
    Replace,
    Section,
    Subsection,
    Todo,
    Variable,
  },
  emits: ["variableUpdated", "variableInitialised"],
})
export default class Content extends Vue {
  private chapter!: Chapter;
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

  private onMouseEnter(entry: Entry): void {
    entry.showEditControls = true;
  }

  private onMouseLeave(entry: Entry): void {
    entry.showEditControls = false;
  }

  private onRun(entry: Entry): void {
    this.disabled = true;

    const onComplete = () => {
      /**/
    };
    const onFinally = () => (this.disabled = false);

    this.run(entry, onComplete, onFinally);
  }

  private onRunUntilHere(index: number): void {
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
      /**/
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
            entry.failed = true;
        }
      })
      .catch((e) => (entry.error = `Failed to run (${formatError(e)})`))
      .finally(onFinally);
  }

  private createRunnableEntry(entry: Entry): RunnableEntry {
    return {
      type: entry.type,
      id: entry.id,
      name: entry.name,
      workPath: this.chapter.workPath,
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

  private onDelete(entry: Entry): void {
    console.log("Coming soon...");
  }

  private onAddNext(event: Event, entry: Entry): void {
    const target = event.target as HTMLSelectElement;
    const type = target.value;
    const create = { type, afterEntryWithId: entry.id };

    this.disabled = true;
    entry.error = "";

    this.createEntry(create)
      .then((created) => {
        created.edit = true;
        const index = this.chapter.entries.indexOf(entry);
        this.chapter.entries.splice(index + 1, 0, created);
      })
      .catch((e) => (entry.error = `Failed to create entry (${formatError(e)})`))
      .finally(() => {
        this.disabled = false;
        target.value = "";
      });
  }

  private createEntry(entry: CreateEntry): Promise<Entry> {
    return apiClient
      .post("/api/entry", entry, {
        params: {
          bookPath: this.chapter.bookPath,
          chapterPath: this.chapter.chapterPath,
        },
      })
      .then((response) => response.data);
  }

  private onEdit(entry: Entry): void {
    entry.edit = true;
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
          bookPath: this.chapter.bookPath,
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
.content {
  margin: auto;
  padding: 10px;
  border: 1px black solid;
  border-radius: 5px;
  width: 98%;
}

.entry {
  padding: 2px 2px 10px;
}

.entry:hover {
  background-color: #c8e1ff;
  filter: drop-shadow(5px 5px 5px #666666);
}

div.error {
  border-radius: 2px;
  padding: 20px;
  background-color: orangered;
  color: white;
}

pre.output {
  border-radius: 2px;
  padding: 20px;
  background-color: black;
  color: aliceblue;
}

pre.error {
  border-radius: 2px;
  padding: 20px;
  background-color: orangered;
  color: white;
}

div.buttons-bar {
  height: 22px;
}

div.buttons-bar::after {
  content: "";
  clear: both;
  display: table;
}

div.buttons {
  display: inline;
}

div.editable {
  float: right;
  right: 0px;
}

button {
  background-color: #dddddd;
  border: 1px solid #5e5e5a;
  border-radius: 2px;
  color: black;
  margin: 0 5px 0 0;
  padding: 2px 5px 3px 5px;
  text-align: center;
  vertical-align: top;
  text-decoration: none;
  cursor: pointer;
}

button:disabled {
  background-color: #c4c3bb;
  color: #5e5e5a;
  cursor: wait;
}

button.primary {
  background-color: #337ab7;
  color: white;
}

button.primary:disabled {
  background-color: #84a0b8;
  color: #5e5e5a;
  cursor: wait;
}

button.danger {
  background-color: #cc3333;
  color: white;
}

button.danger:disabled {
  background-color: #e9aeae;
  color: #5e5e5a;
  cursor: wait;
}

select {
  background-color: #dddddd;
  border: 1px solid #5e5e5a;
  border-radius: 2px;
  color: black;
  margin: 0 5px 0 0;
  padding: 2px 5px 1px 5px;
  text-align: left;
  vertical-align: top;
  text-decoration: none;
  cursor: pointer;
}
</style>
