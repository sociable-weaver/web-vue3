<template>
  <div class="content">
    <div v-for="entry in chapter.entries" :key="entry.id">
      <ChapterRenderer v-if="entry.type === 'chapter'" :entry="entry" />
      <MarkdownRenderer v-else-if="entry.type === 'markdown'" :entry="entry" />
      <div v-else class="error">
        Do not know how to renter entries of type: <code>{{ entry.type }}</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChapterRenderer from "@/components/renderers/Chapter.vue";
import MarkdownRenderer from "@/components/renderers/Markdown.vue";
import { Chapter } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Content",
  props: {
    chapter: Object,
  },
  components: {
    ChapterRenderer,
    MarkdownRenderer,
  },
})
export default class Content extends Vue {
  private chapter!: Chapter;
}
</script>

<style scoped lang="scss">
div.error {
  background-color: gray;
  color: white;
}
</style>
