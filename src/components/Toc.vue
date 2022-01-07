<template>
  <div class="toc">
    <h1 class="title">{{ book.title }}</h1>
    <p class="description">{{ book.description }}</p>
    <ol>
      <li v-for="chapter in book.chapters" :key="chapter.title">
        <h2 @click="onReadChapter(chapter.path)" class="chapter">{{ chapter.title }}</h2>
        <p class="description">{{ chapter.description }}</p>
        <pre class="error" v-if="chapter.error">{{ chapter.error }}</pre>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Book } from "@/models/Book";
import { Chapter } from "@/models/Chapter";
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  emits: ["chapterRead"],
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
        this.setError(chapterPath, `Failed to open chapter (${formatError(e)})`);
      });
  }

  private readChapter(bookPath: string, chapterPath: string): Promise<Chapter> {
    return apiClient
      .get("/api/chapter", { params: { bookPath, chapterPath } })
      .then((response) => response.data)
      .then((json) => ({ ...json, bookPath, chapterPath } as Chapter));
  }

  private setError(chapterPath: string, error: string | null): void {
    const chapter = this.book.chapters.find((c) => c.path === chapterPath);
    if (chapter !== undefined) {
      chapter.error = error;
    }
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
