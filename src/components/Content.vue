<template>
  <div class="content">
    <div v-for="entry in chapter.entries" :key="entry.id" :id="entry.id">
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
      <Variable
        v-else-if="entry.type === 'variable'"
        :entry="entry"
        @variable-updated="onVariableUpdated"
        @variable-initialised="onVariableInitialised"
      />
      <div v-else class="error">
        Do not know how to renter entries of type: <code>{{ entry.type }}</code>
      </div>
      <pre v-if="entry.output" class="output" :class="{ error: entry.failed }">{{ entry.output }}</pre>
      <pre v-if="entry.error" class="error">{{ entry.error }}</pre>
      <div v-if="entry.runnable" class="buttons runnable">
        <button :disabled="disabled" @click="onRun(entry)" class="primary">Run</button>
        <button :disabled="disabled" @click="onRunUntilHere(entry)">Run Until Here</button>
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
import Variable from "@/components/renderers/Variable.vue";
import { Chapter, Entry, VariableInitialised, VariableUpdated } from "@/models/Chapter";
import { run } from "@/services/RunEntryService";
import { Options, Vue } from "vue-class-component";

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
    Variable,
  },
  emits: ["variableUpdated", "variableInitialised"],
})
export default class Content extends Vue {
  private chapter!: Chapter;
  private disabled = false;

  private onRun(entry: Entry): void {
    this.disabled = true;

    entry.failed = false;
    entry.output = "";
    entry.error = "";
    run(entry, (message) => (entry.output += message.content))
      .then((result) => {
        switch (result.content) {
          case "FINISHED_AS_EXPECTED":
          case "FINISHED_WITH_SUPPRESSED_ERROR":
            break;
          default:
            entry.failed = true;
        }
      })
      .catch((e) => (entry.error = `Failed to run (${e.meesage})`))
      .finally(() => (this.disabled = false));
  }

  private onRunUntilHere(entry: Entry): void {
    console.log("Running until", entry);
  }

  private onVariableInitialised(init: VariableInitialised): void {
    this.$emit("variableInitialised", init);
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.$emit("variableUpdated", update);
  }
}
</script>

<style scoped lang="scss">
div.error {
  padding: 20px;
  background-color: orangered;
  color: white;
}

.content {
  width: 95%;
  padding: 8px 8px 0 8px;
}
</style>
