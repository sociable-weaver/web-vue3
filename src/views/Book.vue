<template>
  <div class="book">
    <App v-if="showAppComponent()" ref="app" @app-is-running="onAppIsRunning" />
    <Open v-if="showOpenComponent()" ref="open" @book-opened="onOpenBook" />
    <Toc v-if="showTocComponent()" ref="toc" @chapter-read="onChapterRead" :book="book" />
    <div v-if="showChapterComponent()">
      <!--
      <Breadcrumbs :book="book" :chapter="chapter" />
      -->
      <Content
        ref="content"
        :chapter="readChapter()"
        @variable-updated="onVariableUpdated"
        @variable-initialised="onVariableUpdated"
      />
      <!--
        <Breadcrumbs :book="book" :chapter="chapter" />
      -->
    </div>
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book, Chapter, emptyBook, VariableUpdated } from "@/models/Chapter";
import { isNonBlank } from "@/models/Common";
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
  private book: Book = emptyBook();

  private showAppComponent(): boolean {
    return !this.appIsRunning;
  }

  private showOpenComponent(): boolean {
    return this.appIsRunning && !this.book.opened;
  }

  private showTocComponent(): boolean {
    return this.appIsRunning && this.book.opened && !isNonBlank(this.book.chapterPath);
  }

  private showChapterComponent(): boolean {
    return this.appIsRunning && this.book.opened && isNonBlank(this.book.chapterPath);
  }

  private readChapter(): Chapter {
    const chapterPath = this.book.chapterPath;
    return this.book.chapters.find((chapter) => chapter.chapterPath === chapterPath) as Chapter;
  }

  private onAppIsRunning(appIsRunning: boolean): void {
    this.appIsRunning = appIsRunning;
  }

  private onOpenBook(book: Book): void {
    this.book = book;
  }

  private onChapterRead(read: Chapter): void {
    // this.book.chapterPath = read.chapterPath;
    // this.chapter = read;
    // this.chapter.workPath = this.book.workPath;
    // this.$router.push({
    //   name: "Book",
    //   params: {
    //     bookPath: this.book.bookPath,
    //     workPath: this.book.workPath,
    //     chapterPath: read.chapterPath,
    //   },
    // });
  }

  private onVariableUpdated(update: VariableUpdated): void {
    // this.chapter?.entries.forEach((entry) => {
    //   setValue(entry, update);
    // });
  }
}
</script>
