<template>
  <div class="book">
    <App v-if="showAppComponent()" ref="app" @app-is-running="onAppIsRunning" />
    <Open v-if="showOpenComponent()" ref="open" :book="book" />
    <Toc v-if="showTocComponent()" ref="toc" :book="book" />
    <div v-if="showChapterComponent()">
      <Breadcrumbs :book="book" />
      <Content
        ref="content"
        :book="book"
        @variable-updated="onVariableUpdated"
        @variable-initialised="onVariableUpdated"
      />
      <Breadcrumbs :book="book" />
    </div>
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book, emptyBook, setValue, VariableUpdated } from "@/models/Chapter";
import { asNumber, asString } from "@/models/Common";
import { apiClient, formatError } from "@/services/ServiceApi";
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

  updated(): void {
    const action = asString(this.$route.params.action);
    switch (action) {
      case "":
      case "read":
        this.handleReadBook();
        break;
      default:
        this.handleUnknownAction(action);
    }
  }

  private showAppComponent(): boolean {
    return !this.appIsRunning;
  }

  private showOpenComponent(): boolean {
    return this.appIsRunning && !this.book.opened;
  }

  private showTocComponent(): boolean {
    return this.appIsRunning && this.book.opened && this.book.chapterIndex === -1;
  }

  private showChapterComponent(): boolean {
    return this.appIsRunning && this.book.opened && this.book.chapterIndex !== -1;
  }

  private onAppIsRunning(appIsRunning: boolean): void {
    this.appIsRunning = appIsRunning;
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.book.chapters.forEach((chapter) => {
      chapter.entries.forEach((entry) => setValue(entry, update));
    });
  }

  private handleReadBook() {
    const bookPath = asString(this.$route.params.pathParam1);
    const workPath = asString(this.$route.params.pathParam2);
    const chapterIndex = asNumber(this.$route.params.chapterIndex);
    const entryId = asString(this.$route.params.entryId);

    if (bookPath === "") {
      this.handleShowOpenBookPane();
    } else if (this.book.bookPath !== bookPath) {
      this.handleOpenBook(bookPath, workPath);
    } else if (this.book.chapterIndex !== chapterIndex) {
      this.handleReadChapter(chapterIndex);
    } else if (this.book.entryId !== entryId) {
      this.handleReadEntry(entryId);
    }
  }

  private handleShowOpenBookPane() {
    this.book.opened = false;
  }

  private handleOpenBook(bookPath: string, workPath: string): void {
    this.openBook(bookPath)
      .then((book) => {
        this.book = {
          ...book,
          bookPath: bookPath,
          workPath: workPath,
          chapterIndex: -1,
          entryId: "",
          opened: true,
        };
      })
      .catch((e) => {
        this.book = emptyBook();
        this.book.bookPath = bookPath;
        this.book.workPath = workPath;
        this.book.error = `Failed to open working book (${formatError(e)})`;
      });
  }

  private openBook(bookPath: string): Promise<Book> {
    return apiClient
      .get("/api/book", { params: { bookPath } })
      .then((response) => response.data)
      .then((json) => json as Book);
  }

  private handleReadChapter(chapterIndex: number) {
    this.book.chapterIndex = chapterIndex;
  }

  private handleReadEntry(entryId: string) {
    this.book.entryId = entryId;
  }

  private handleUnknownAction(action: string) {
    this.book.opened = false;
    this.book.error = `Something went wrong.  Unknown action '${action}'!!`;
  }
}
</script>
