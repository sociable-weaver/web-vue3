<template>
  <div class="book">
    <App v-if="showAppComponent()" ref="app" @app-is-running="onAppIsRunning" />
    <Open v-if="showOpenComponent()" ref="open" @book-opened="onOpenBook" :book="book" />
    <Toc
      ref="toc"
      @chapter-read="onChapterRead"
      v-if="showTocComponent()"
      :book="book"
      :chapterPath="book.chapterPath"
    />
    <div v-if="showChapterComponent()">
      <Breadcrumbs :book="book" :chapter="chapter" />
      <Content
        ref="content"
        :chapter="chapter"
        @variable-updated="onVariableUpdated"
        @variable-initialised="onVariableUpdated"
      />
      <Breadcrumbs :book="book" :chapter="chapter" />
    </div>
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Book";
import { Chapter, setValue, VariableUpdated } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    App,
    Breadcrumbs,
    Open,
    Toc,
    Content,
  },
})
export default class BookView extends Vue {
  private appIsRunning = false;
  private book: Book = { title: "", description: "", chapters: [], bookPath: "", workPath: "", chapterPath: "" };
  private chapter: Chapter | null = null;

  updated(): void {
    this.book.bookPath = (this.$route.params.bookPath as string) || "";
    this.book.workPath = (this.$route.params.workPath as string) || "";
    this.book.chapterPath = (this.$route.params.chapterPath as string) || "";
  }

  private showAppComponent(): boolean {
    return !this.appIsRunning;
  }

  private showOpenComponent(): boolean {
    return this.appIsRunning && this.book.title === "";
  }

  private showTocComponent(): boolean {
    return this.appIsRunning && this.book.title !== "" && this.book.chapterPath === "";
  }

  private showChapterComponent(): boolean {
    return this.appIsRunning && this.chapter !== null && this.book.chapterPath !== "";
  }

  private onAppIsRunning(state: boolean): void {
    this.appIsRunning = state;
  }

  private onOpenBook(opened: Book): void {
    this.book = opened;
    this.$router.push({
      name: "Book",
      params: { bookPath: this.book.bookPath, workPath: this.book.workPath },
    });
  }

  private onChapterRead(read: Chapter): void {
    this.book.chapterPath = read.chapterPath;
    this.chapter = read;
    this.chapter.workPath = this.book.workPath;
    this.$router.push({
      name: "Book",
      params: {
        bookPath: this.book.bookPath,
        workPath: this.book.workPath,
        chapterPath: read.chapterPath,
      },
    });
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.chapter?.entries.forEach((entry) => {
      setValue(entry, update);
    });
  }
}
</script>
