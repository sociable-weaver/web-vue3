<template>
  <ol class="breadcrumbs">
    <li role="toc"><a :href="tocPath">Table of Contents</a></li>
    <li role="previous" v-if="previous">
      <a :href="previousPath">Previous ({{ previous }})</a>
    </li>
    <li role="next" v-if="next">
      <a :href="nextPath">Next ({{ next }})</a>
    </li>
  </ol>
</template>

<script lang="ts">
import { Book, title } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Breadcrumbs",
  props: {
    book: Object,
  },
})
export default class Breadcrumbs extends Vue {
  private book!: Book;

  private get tocPath(): string {
    return `#/read/${encodeURIComponent(this.book.bookPath)}/${encodeURIComponent(this.book.workPath)}`;
  }

  private get previous(): string {
    const previous = this.book.chapterIndex - 1;
    if (this.isOutOfRange(previous)) {
      return "";
    }

    return title(this.book.chapters[previous]);
  }

  private get previousPath(): string {
    const previous = this.book.chapterIndex - 1;
    return `${this.tocPath}/${previous}`;
  }

  private get next(): string {
    const next = this.book.chapterIndex + 1;
    if (this.isOutOfRange(next)) {
      return "";
    }

    return title(this.book.chapters[next]);
  }

  private get nextPath(): string {
    const next = this.book.chapterIndex + 1;
    return `${this.tocPath}/${next}`;
  }

  private isOutOfRange(index: number) {
    return index < 0 || index >= this.book.chapters.length;
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
