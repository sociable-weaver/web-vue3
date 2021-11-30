<template>
  <div class="home">
    <App ref="app" @app-is-running="onAppIsRunning" />
    <Open ref="open" @book-opened="onOpenBook" v-if="appIsRunning" />
    <Toc v-if="book !== null" :book="book" />
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Book";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    App,
    Open,
    Toc,
  },
})
export default class Home extends Vue {
  private appIsRunning = false;
  private book: Book | null = null;

  private onAppIsRunning(state: boolean): void {
    this.appIsRunning = state;
  }

  private onOpenBook(opened: Book): void {
    this.book = opened;
  }
}
</script>
