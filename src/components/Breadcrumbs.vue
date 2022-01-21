<template>
  <ol class="breadcrumbs">
    <li><a :href="tocPath">Table of Contents</a></li>
    <li v-if="previous">
      <a :href="previousPath">Previous ({{ previous }})</a>
    </li>
    <li v-if="next">
      <a :href="nextPath">Next ({{ next }})</a>
    </li>
  </ol>
</template>

<script lang="ts">
import { Book, Chapter, getPart, join } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Breadcrumbs",
  props: {
    book: Object,
  },
})
export default class Breadcrumbs extends Vue {
  private book!: Book;

  private get chapterTitle(): string {
    const chapterIndex = this.book.chapterIndex;
    const chapter = this.book.chapters[chapterIndex];

    return this.title(chapter);
  }

  private get tocPath(): string {
    return `/#/${encodeURIComponent(this.book.bookPath)}/${encodeURIComponent(this.book.workPath)}`;
  }

  private get previous(): string {
    const chapterIndex = this.book.chapterIndex;
    if (chapterIndex < 1) {
      return "";
    }

    return this.title(this.book.chapters[chapterIndex - 1]);
  }

  private get previousPath(): string {
    const chapterIndex = this.book.chapterIndex;
    const previousIndex = chapterIndex - 1;
    return `/#/${encodeURIComponent(this.book.bookPath)}/${encodeURIComponent(this.book.workPath)}/${previousIndex}`;
  }

  private get next(): string {
    const chapterIndex = this.book.chapterIndex;
    if (chapterIndex < 0 || chapterIndex >= this.book.chapters.length - 1) {
      return "";
    }

    return this.title(this.book.chapters[chapterIndex + 1]);
  }

  private get nextPath(): string {
    const chapterIndex = this.book.chapterIndex;
    const nextIndex = chapterIndex + 1;
    return `/#/${encodeURIComponent(this.book.bookPath)}/${encodeURIComponent(this.book.workPath)}/${nextIndex}`;
  }

  /* TODO: move to a common place */
  private title(chapter: Chapter): string {
    const entry = chapter.entries.find((e) => e.type === "chapter");
    if (entry === undefined) {
      return "Missing chapter entry";
    }

    return join(getPart("Title", entry.parameters));
  }
}
</script>

<style scoped lang="scss">
.breadcrumbs {
  font-size: 0.8em;
  list-style-type: none;
  padding-inline-start: 10px;

  li {
    display: inline;
    padding-right: 10px;
  }
}
</style>
