<template>
  <div class="book">
    <App v-if="showAppComponent()" ref="app" @app-is-running="onAppIsRunning" />
    <Open v-if="showOpenComponent()" ref="open" @book-opened="onOpenBook" :workspace="workspace" />
    <Toc
      ref="toc"
      @chapter-read="onChapterRead"
      v-if="showTocComponent()"
      :book="book"
      :chapterPath="workspace.chapterPath"
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
import { Workspace } from "@/models/Workspace";
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
export default class Home extends Vue {
  private appIsRunning = false;
  private book: Book | null = null;
  private chapter: Chapter | null = null;
  private workspace: Workspace = { bookPath: "", workPath: "", chapterPath: "" };

  updated(): void {
    this.workspace.bookPath = (this.$route.params.bookPath as string) || "";
    this.workspace.workPath = (this.$route.params.workPath as string) || "";
    this.workspace.chapterPath = (this.$route.params.chapterPath as string) || "";
  }

  private showAppComponent(): boolean {
    return !this.appIsRunning;
  }

  private showOpenComponent(): boolean {
    return this.appIsRunning && this.book === null;
  }

  private showTocComponent(): boolean {
    return this.appIsRunning && this.book !== null && this.workspace.chapterPath === "";
  }

  private showChapterComponent(): boolean {
    return this.appIsRunning && this.chapter !== null && this.workspace.chapterPath !== "";
  }

  private onAppIsRunning(state: boolean): void {
    this.appIsRunning = state;
  }

  private onOpenBook(opened: Book): void {
    this.workspace.bookPath = opened.bookPath;
    this.workspace.workPath = opened.workPath;
    this.$router.push({
      name: "Book",
      params: { bookPath: this.workspace.bookPath, workPath: this.workspace.workPath },
    });
    this.book = opened;
  }

  private onChapterRead(read: Chapter): void {
    this.workspace.chapterPath = read.chapterPath;
    this.$router.push({
      name: "Book",
      params: {
        bookPath: this.workspace.bookPath,
        workPath: this.workspace.workPath,
        chapterPath: this.workspace.chapterPath,
      },
    });
    this.chapter = read;
    this.chapter.workPath = this.workspace.workPath;
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.chapter?.entries.forEach((entry) => {
      setValue(entry, update);
    });
  }
}
</script>
