<template>
  <div class="toc">
    <h1 class="title">{{ book.title }}</h1>
    <p class="description">{{ book.description }}</p>
    <ol>
      <li v-for="(chapter, index) in book.chapters" :key="chapter.chapterPath">
        <h2 @click="onReadChapter(index)" class="chapter">{{ getTitle(chapter) }}</h2>
        <p class="description" v-html="getDescription(chapter)" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Book, Chapter, description, title } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  props: {
    book: Object,
  },
})
export default class Toc extends Vue {
  private book!: Book;

  private onReadChapter(chapterIndex: number): void {
    this.$router.push({
      name: "Book",
      params: {
        action: "read",
        bookPath: this.book.bookPath,
        workPath: this.book.workPath,
        chapterIndex: chapterIndex,
      },
    });
  }

  private getTitle(chapter: Chapter): string {
    return title(chapter);
  }

  private getDescription(chapter: Chapter): string {
    return description(chapter);
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
