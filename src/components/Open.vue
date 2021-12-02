<template>
  <div class="open">
    <div class="openRepository">
      <h2>Open repository</h2>
      <div>
        <input type="radio" id="checkout" value="checkout" v-model="openFrom" />
        <label for="checkout">Checkout from an online git repository, like GitHub or GitLab</label>
      </div>
      <div>
        <label for="pathToRepository">Path to repository</label>
        <input type="text" id="pathToRepository" v-model="pathToRepository" :disabled="openFrom === 'openLocal'" />
      </div>
      <div>
        <label for="checkoutToFolder">Checkout to folder</label>
        <input type="text" id="checkoutToFolder" v-model="checkoutToFolder" :disabled="openFrom === 'openLocal'" />
      </div>
      <div>
        <input type="radio" id="openLocal" value="openLocal" v-model="openFrom" />
        <label for="openLocal">Open locally</label>
      </div>
      <div>
        <label for="openFromFolder">Open from folder</label>
        <input type="text" id="openFromFolder" v-model="openFromFolder" :disabled="openFrom === 'checkout'" />
      </div>
    </div>
    <div class="workspace">
      <h2>Workspace</h2>
      <div>
        <label for="workspace">Workspace</label>
        <input type="text" id="workspace" v-model="workspace" />
      </div>
    </div>
    <div class="buttons">
      <button class="open" v-if="openFrom === 'checkout'">Checkout and Open</button>
      <button class="open" v-else @click="onOpenLocal">Open</button>
      <span class="actionMessage">{{ actionMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Book } from "@/models/Book";
import { apiClient } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Open",
  emits: ["bookOpened"],
})
export default class Open extends Vue {
  private openFrom = "checkout";
  private pathToRepository = "";
  private checkoutToFolder = "";
  private openFromFolder = "";
  private workspace = "";
  private actionMessage = "";

  onOpenLocal(): void {
    this.actionMessage = "";

    if (this.openFromFolder.trim().length === 0) {
      this.actionMessage = "Please provide the folder path";
      return;
    }

    this.openLocal(this.openFromFolder)
      .then((book) => {
        this.$emit("bookOpened", book);
      })
      .catch((e) => {
        this.actionMessage = `Failed to open book (${e.message})`;
      });
  }

  private openLocal(path: string): Promise<Book> {
    return apiClient
      .get("/api/book/open", { params: { path } })
      .then((response) => response.data)
      .then((json) => json as Book);
  }
}
</script>

<style scoped lang="scss">
input[type="text"] {
  width: 400px;
}
</style>
