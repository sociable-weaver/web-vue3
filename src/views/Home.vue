<template>
  <div class="home">
    <MessageBar ref="messageBar" v-if="message !== null" :message="message" />
    <App ref="app" @app-is-running="onAppIsRunning" />
    <Open ref="open" @book-opened="onOpenBook" v-if="appIsRunning" :workspace="workspace" />
    <Toc
      ref="toc"
      @chapter-read="onChapterRead"
      @error-message="onErrorMessage"
      v-if="book !== null"
      :book="book"
      :chapterPath="workspace.chapterPath"
    />
    <Content
      ref="content"
      v-if="chapter !== null"
      :chapter="chapter"
      @variable-updated="onVariableUpdated"
      @variable-initialised="onVariableUpdated"
    />
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Content from "@/components/Content.vue";
import MessageBar from "@/components/MessageBar.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Book";
import { Chapter, setValue, VariableUpdated } from "@/models/Chapter";
import { Workspace } from "@/models/Workspace";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    MessageBar,
    App,
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
  private message: string | null = null;

  mounted(): void {
    /* TODO: What should we do if this is an array? */
    this.workspace.bookPath = (this.$route.params.bookPath as string) || "";
    this.workspace.workPath = (this.$route.params.workPath as string) || "";
    this.workspace.chapterPath = (this.$route.params.chapterPath as string) || "";
  }

  private onAppIsRunning(state: boolean): void {
    this.appIsRunning = state;
  }

  private onOpenBook(opened: Book): void {
    this.workspace.bookPath = opened.bookPath;
    this.workspace.workPath = opened.workPath;
    this.$router.push({
      name: "Home",
      params: { bookPath: this.workspace.bookPath, workPath: this.workspace.workPath },
    });
    this.book = opened;
  }

  private onChapterRead(read: Chapter): void {
    this.workspace.chapterPath = read.chapterPath;
    this.$router.push({
      name: "Home",
      params: {
        bookPath: this.workspace.bookPath,
        workPath: this.workspace.workPath,
        chapterPath: this.workspace.chapterPath,
      },
    });
    this.chapter = read;
    this.chapter.workPath = this.workspace.workPath;
  }

  private onErrorMessage(message: string): void {
    this.message = message;
  }

  private onVariableUpdated(update: VariableUpdated): void {
    this.chapter?.entries.forEach((entry) => {
      setValue(entry, update);
    });
  }
}
</script>
