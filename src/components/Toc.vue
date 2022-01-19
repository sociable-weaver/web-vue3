<template>
  <div class="toc">
    <h1 class="title">{{ book.title }}</h1>
    <p class="description">{{ book.description }}</p>
    <ol>
      <li v-for="chapter in book.chapters" :key="chapter.title">
        <h2 @click="onReadChapter(chapter.chapterPath)" class="chapter">{{ title(chapter) }}</h2>
        <p class="description" v-html="description(chapter)" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Book, Chapter, getPart, join } from "@/models/Chapter";
import { Marked } from "@ts-stack/markdown";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  props: {
    book: Object,
  },
})
export default class Toc extends Vue {
  private book!: Book;

  private onReadChapter(chapterPath: string): void {
    this.$router.push({
      name: "Book",
      params: {
        bookPath: this.book.bookPath,
        workPath: this.book.workPath,
        chapterPath: chapterPath,
      },
    });
  }

  /* TODO: move to a common place */
  private title(chapter: Chapter): string {
    const entry = chapter.entries.find((e) => e.type === "chapter");
    if (entry === undefined) {
      return "Missing chapter entry";
    }

    return join(getPart("Title", entry.parameters));
  }

  /* TODO: move to a common place */
  private description(chapter: Chapter): string {
    const entry = chapter.entries.find((e) => e.type === "chapter");
    if (entry === undefined) {
      return "Missing chapter entry";
    }

    return Marked.parse(join(getPart("Description", entry.parameters)));
  }
}
</script>

<style scoped lang="scss">
h1.title {
  margin-bottom: 1px;
}

h2.chapter {
  color: #2c3e50;
  cursor: pointer;
  text-decoration: underline;
}

p.description {
  margin-top: 0;
}
</style>
