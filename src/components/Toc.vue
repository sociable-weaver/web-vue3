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
import { apiClient } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  emits: ["chapterRead", "errorMessage"],
  props: {
    book: Object,
  },
})
export default class Toc extends Vue {
  private book!: Book;

  private onReadChapter(path: string): void {
    this.readChapter(this.book.bookPath, path)
      .then((chapter) => {
        this.$emit("chapterRead", chapter);
      })
      .catch((e) => {
        this.$emit("errorMessage", `Failed to open chapter (${e.message})`);
      });
  }

  private readChapter(bookPath: string, chapterPath: string): Promise<Chapter> {
    return apiClient
      .get("/api/book/read-chapter", { params: { bookPath, chapterPath } })
      .then((response) => response.data)
      .then((json) => json as Chapter);
  }
}
</script>

<style scoped lang="scss"></style>
