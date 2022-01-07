<template>
  <div class="open">
    <div class="openRepository">
      <h2>Book</h2>
      <div class="input-row">
        <input type="radio" id="openLocal" value="openLocal" v-model="openFrom" />
        <label for="openLocal">Open from directory</label>
      </div>
      <div class="input-row a">
        <input
          type="text"
          id="openFromFolder"
          v-model="bookPath"
          :disabled="openFrom !== 'openLocal'"
          placeholder="The path to the directory"
        />
      </div>
      <div class="input-row">
        <input type="radio" id="checkout" value="checkout" v-model="openFrom" />
        <label for="checkout">Checkout from an online Git repository, like GitHub or GitLab</label>
      </div>
      <div class="input-row a">
        <input
          type="text"
          id="pathToRepository"
          v-model="pathToRepository"
          :disabled="openFrom !== 'checkout'"
          placeholder="The HTTP/HTTPS Link to the Git repository"
        />
        <div class="tip">
          Example: <code>https://github.com/albertattard/gradle-boot-camp</code>, which is a boot camp about
          <a href="https://gradle.org/" target="_blank">Gradle</a> created with the Sociable Weaver platform.
          <a href="#" @click="tryItOut">Try it out</a>
        </div>
      </div>
      <div class="input-row a">
        <input
          type="text"
          id="checkoutToFolder"
          v-model="bookPath"
          :disabled="openFrom !== 'checkout'"
          placeholder="The path where you like to clone the Git repository"
        />
      </div>
      <div class="input-row">
        <input type="radio" id="createNew" value="createNew" v-model="openFrom" />
        <label for="createNew">New</label>
      </div>
      <div class="input-row a">
        <input
          type="text"
          id="createNewFolder"
          v-model="bookPath"
          :disabled="openFrom !== 'createNew'"
          placeholder="The path to the directory where you like to create the new book/blog"
        />
      </div>
    </div>
    <div class="workspace">
      <h2>Workspace</h2>
      <div class="input-row a">
        <input
          type="text"
          id="workspace"
          v-model="workPath"
          placeholder="The path to the directory from where the examples will be executed"
        />
      </div>
    </div>
    <div class="input-row">
      <button class="primary" v-if="openFrom === 'openLocal'" @click="onOpenBook">Open</button>
      <button class="primary" v-if="openFrom === 'checkout'" @click="onCheckoutBook">Checkout and Open</button>
      <button class="primary" v-if="openFrom === 'createNew'" @click="onCreateBook">Create</button>
      <span class="actionMessage">{{ actionMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Workspace } from "@/models/Workspace";
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

interface Book {
  title: string;
  description: string;
  chapters: Chapter[];
}

interface Chapter {
  title: string;
  description: string;
  path: string;
}

@Options({
  name: "Open",
  emits: ["bookOpened"],
  props: {
    workspace: Object,
  },
})
export default class Open extends Vue {
  private workspace!: Workspace;

  private pathToRepository = "";
  private openFrom = "openLocal";
  private actionMessage = "";
  private bookPath = "";
  private workPath = "";

  mounted(): void {
    this.$nextTick(() => {
      this.bookPath = this.workspace.bookPath;
      this.workPath = this.workspace.workPath;

      if (this.isBookPathSet() && this.isWorkPathSet()) {
        this.handleOpenBook();
      }
    });
  }

  private tryItOut() {
    this.openFrom = "checkout";
    this.pathToRepository = "https://github.com/albertattard/gradle-boot-camp";
  }

  private onCheckoutBook(): void {
    this.actionMessage = "This feature is not yet implemented";
  }

  private onCreateBook(): void {
    this.actionMessage = "This feature is not yet implemented";
  }

  private onOpenBook(): void {
    this.actionMessage = "";
    if (!this.isBookPathSet() || !this.isWorkPathSet()) {
      this.actionMessage = "Please provide both the book and workspace folder paths";
      return;
    }

    this.handleOpenBook();
  }

  private handleOpenBook(): void {
    const bookPath = this.bookPath;
    const workPath = this.workPath;

    this.openBook(bookPath)
      .then((book) => {
        const workbook = {
          ...book,
          bookPath: bookPath,
          workPath: workPath,
        };
        this.$emit("bookOpened", workbook);
      })
      .catch((e) => {
        this.actionMessage = `Failed to open working book (${formatError(e)})`;
      });
  }

  private openBook(bookPath: string): Promise<Book> {
    return apiClient
      .get("/api/book", { params: { bookPath } })
      .then((response) => response.data)
      .then((json) => json as Book);
  }

  private isBookPathSet(): boolean {
    return this.isNonBlank(this.bookPath);
  }

  private isWorkPathSet(): boolean {
    return this.isNonBlank(this.workPath);
  }

  private isNonBlank(text: string): boolean {
    return text.trim().length > 0;
  }
}
</script>

<style scoped lang="scss">
input[type="text"] {
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //margin-block-start: 0.83em;
  //margin-block-end: 0.83em;
  //margin-inline-start: 0;
  //margin-inline-end: 0;
  width: 80%;
  padding-top: 2px;
  color: #2c3e50;
}

.a {
  margin: 0 23px;
}
</style>
