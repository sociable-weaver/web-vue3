<template>
  <ol class="breadcrumbs">
    <li><a :href="tocPath" @click="onGoToToc">Table of Contents</a></li>
    <li v-if="previous">
      <a :href="previousPath" @click="onGoToPrevious">Previous ({{ previous }})</a>
    </li>
    <li v-if="next">
      <a :href="nextPath" @click="onGoToNext">Next ({{ next }})</a>
    </li>
  </ol>
</template>

<script lang="ts">
import { Book } from "@/models/Book";
import { Chapter } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Breadcrumbs",
  props: {
    book: Object,
    chapter: Object,
  },
})
export default class Breadcrumbs extends Vue {
  private book!: Book;
  private chapter!: Chapter;

  private get chapterTitle(): string {
    const entry = this.chapter.entries.find((e) => e.type === "chapter");
    if (entry === undefined) {
      return "No title";
    }

    return entry.parameters[0];
  }

  private get tocPath(): string {
    return `/#/${encodeURIComponent(this.chapter.bookPath)}/${encodeURIComponent(this.chapter.workPath)}`;
  }

  private onGoToToc(): void {
    this.$router.push({
      name: "Book",
      params: { bookPath: this.chapter.bookPath, workPath: this.chapter.workPath, chapterPath: "" },
    });
  }

  private get previous(): string {
    const title = this.chapterTitle;
    const index = this.book.chapters.findIndex((c) => c.title === title);

    if (index < 1) {
      return "";
    }

    return this.book.chapters[index - 1].title;
  }

  private get previousPath(): string {
    return `/#/${encodeURIComponent(this.chapter.bookPath)}/${encodeURIComponent(this.chapter.workPath)}`;
  }

  private onGoToPrevious(): void {
    this.$router.push({
      name: "Book",
      params: { bookPath: this.chapter.bookPath, workPath: this.chapter.workPath, chapterPath: "" },
    });
  }

  private get next(): string {
    const title = this.chapterTitle;
    const index = this.book.chapters.findIndex((c) => c.title === title);
    console.log("Index", index);

    if (index == -1 || index >= this.book.chapters.length - 1) {
      return "";
    }

    return this.book.chapters[index + 1].title;
  }

  private get nextPath(): string {
    return `/#/${encodeURIComponent(this.chapter.bookPath)}/${encodeURIComponent(this.chapter.workPath)}`;
  }

  private onGoToNext(): void {
    this.$router.push({
      name: "Book",
      params: { bookPath: this.chapter.bookPath, workPath: this.chapter.workPath, chapterPath: "" },
    });
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
