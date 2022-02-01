<template>
  <div class="open">
    <div class="openRepository">
      <h2>Book</h2>
      <div class="input-row">
        <input type="radio" id="openLocal" value="openLocal" v-model="openFrom" />
        <label for="openLocal">Open from directory</label>
      </div>
      <div class="input-row a" v-if="openFrom === 'openLocal'">
        <input type="text" id="openFromFolder" v-model="bookPath" placeholder="The path to the directory" />
      </div>
      <div class="input-row">
        <input type="radio" id="checkout" value="checkout" v-model="openFrom" />
        <label for="checkout">Checkout from an online Git repository, like GitHub or GitLab</label>
      </div>
      <div class="input-row a" v-if="openFrom === 'checkout'">
        <input
          type="text"
          id="pathToRepository"
          v-model="pathToRepository"
          placeholder="The HTTP/HTTPS Link to the Git repository"
        />
        <div class="tip">
          Example: <code>https://github.com/albertattard/gradle-boot-camp</code>, which is a boot camp about
          <a href="https://gradle.org/" target="_blank">Gradle</a> created with the Sociable Weaver platform.
          <a href="#" @click="tryItOut">Try it out</a>
        </div>
      </div>
      <div class="input-row a" v-if="openFrom === 'checkout'">
        <input
          type="text"
          id="checkoutToFolder"
          v-model="bookPath"
          placeholder="The path where you like to clone the Git repository"
        />
      </div>
      <div class="input-row">
        <input type="radio" id="createNew" value="createNew" v-model="openFrom" />
        <label for="createNew">New</label>
      </div>
      <div class="input-row a" v-if="openFrom === 'createNew'">
        <input
          type="text"
          id="createNewFolder"
          v-model="bookPath"
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
      <span v-if="book.error" class="error">{{ book.error }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Book } from "@/models/Chapter";
import { asString, isNonBlank } from "@/models/Common";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Open",
  props: {
    book: Object,
  },
})
export default class Open extends Vue {
  private book!: Book;
  private pathToRepository = "";
  private openFrom = "openLocal";
  private bookPath = "";
  private workPath = "";

  mounted() {
    if (this.bookPath === "") {
      this.bookPath = asString(this.$route.params.pathParam1);
    }
    if (this.workPath === "") {
      this.workPath = asString(this.$route.params.pathParam2);
    }
  }

  private tryItOut() {
    this.openFrom = "checkout";
    this.pathToRepository = "https://github.com/albertattard/gradle-boot-camp";
  }

  private onCheckoutBook(): void {
    this.book.error = "This feature is not yet implemented";
  }

  private onCreateBook(): void {
    this.book.error = "This feature is not yet implemented";
  }

  private onOpenBook(): void {
    if (!this.isBookPathSet() || !this.isWorkPathSet()) {
      this.book.error = "Please provide both the book and workspace directory paths";
      return;
    }

    this.$router.push({
      name: "Book",
      params: { action: "read", pathParam1: this.bookPath, pathParam2: this.workPath },
    });
  }

  private isBookPathSet(): boolean {
    return isNonBlank(this.bookPath);
  }

  private isWorkPathSet(): boolean {
    return isNonBlank(this.workPath);
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
