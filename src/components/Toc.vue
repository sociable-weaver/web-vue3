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
  emits: ["chapterRead"],
  props: {
    book: Object,
  },
})
export default class Toc extends Vue {
  private book!: Book;

  private onReadChapter(path: string): void {
    this.readChapter(path)
      .then((chapter) => {
        this.$emit("chapterRead", chapter);
      })
      .catch((e) => {
        console.log("Failed to open chapter", e);
      });
  }

  private readChapter(path: string): Promise<Chapter> {
    return apiClient
      .get("/api/book/read-chapter", { params: { path } })
      .then((response) => response.data)
      .then((json) => json as Chapter);
  }
}
</script>

<style scoped lang="scss"></style>
