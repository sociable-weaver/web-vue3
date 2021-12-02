<template>
  <div class="home">
    <App ref="app" @app-is-running="onAppIsRunning" />
    <Open ref="open" @book-opened="onOpenBook" v-if="appIsRunning" />
    <Toc ref="toc" @chapter-read="onChapterRead" v-if="book !== null" :book="book" />
    <Content ref="content" v-if="chapter !== null" :chapter="chapter" />
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Book";
import { Chapter } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
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

  private onAppIsRunning(state: boolean): void {
    this.appIsRunning = state;
  }

  private onOpenBook(opened: Book): void {
    this.book = opened;
  }

  private onChapterRead(read: Chapter): void {
    this.chapter = read;
  }
}
</script>
