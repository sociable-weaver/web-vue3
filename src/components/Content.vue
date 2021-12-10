<template>
  <div class="content">
    <div v-for="entry in chapter.entries" :key="entry.id">
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
      <Variable v-else-if="entry.type === 'variable'" :entry="entry" @variable-updated="onVariableUpdated" />
      <div v-else class="error">
        Do not know how to renter entries of type: <code>{{ entry.type }}</code>
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
import { Chapter, VariableUpdated } from "@/models/Chapter";
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
  emits: ["variableUpdated"],
})
export default class Content extends Vue {
  private chapter!: Chapter;

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
