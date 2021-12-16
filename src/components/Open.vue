<template>
  <div class="open">
    <div class="openRepository">
      <h2>Open repository</h2>
      <div>
        <input type="radio" id="openLocal" value="openLocal" v-model="openFrom" />
        <label for="openLocal">Open</label>
      </div>
      <div>
        <label for="openFromFolder">Open from folder</label>
        <input type="text" id="openFromFolder" v-model="bookPath" :disabled="openFrom !== 'openLocal'" />
      </div>
      <div>
        <input type="radio" id="checkout" value="checkout" v-model="openFrom" />
        <label for="checkout">Checkout from an online git repository, like GitHub or GitLab</label>
      </div>
      <div>
        <label for="pathToRepository">Path to repository</label>
        <input type="text" id="pathToRepository" v-model="pathToRepository" :disabled="openFrom !== 'checkout'" />
      </div>
      <div>
        <label for="checkoutToFolder">Checkout to folder</label>
        <input type="text" id="checkoutToFolder" v-model="bookPath" :disabled="openFrom !== 'checkout'" />
      </div>
      <div>
        <input type="radio" id="createNew" value="createNew" v-model="openFrom" />
        <label for="createNew">New</label>
      </div>
      <div>
        <label for="createNewFolder">Open from folder</label>
        <input type="text" id="createNewFolder" v-model="bookPath" :disabled="openFrom !== 'createNew'" />
      </div>
    </div>
    <div class="workspace">
      <h2>Workspace</h2>
      <div>
        <label for="workspace">Workspace</label>
        <input type="text" id="workspace" v-model="workPath" />
      </div>
    </div>
    <div class="buttons">
      <button class="open" v-if="openFrom === 'openLocal'" @click="onOpenBook">Open</button>
      <button class="open" v-if="openFrom === 'checkout'" @click="onCheckoutBook">Checkout and Open</button>
      <button class="open" v-if="openFrom === 'createNew'" @click="onCreateBook">Create</button>
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
  width: 400px;
}
</style>
