<template>
  <div class="toc">
    <h1>{{ book.title }}</h1>
    <p>{{ book.description }}</p>
    <h2>Chapters</h2>
    <div v-for="chapter in book.chapters" :key="chapter.title">
      <h3 @click="onReadChapter(chapter.path)">{{ chapter.title }}</h3>
      <p>{{ chapter.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Book } from "@/models/Book";
import { Chapter } from "@/models/Chapter";
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  emits: ["chapterRead", "errorMessage"],
  props: {
    book: Object,
    chapterPath: String,
  },
})
export default class Toc extends Vue {
  private book!: Book;
  private chapterPath!: string;

  mounted(): void {
    this.$nextTick(() => {
      if (this.chapterPath.trim().length > 0) {
        this.onReadChapter(this.chapterPath);
      }
    });
  }

  private onReadChapter(chapterPath: string): void {
    this.readChapter(this.book.bookPath, chapterPath)
      .then((chapter) => {
        this.$emit("chapterRead", chapter);
      })
      .catch((e) => {
        this.$emit("errorMessage", `Failed to open chapter (${formatError(e)})`);
      });
  }

  private readChapter(bookPath: string, chapterPath: string): Promise<Chapter> {
    return apiClient
      .get("/api/chapter", { params: { bookPath, chapterPath } })
      .then((response) => response.data)
      .then((json) => ({ ...json, bookPath, chapterPath } as Chapter));
  }
}
</script>

<style scoped lang="scss"></style>
