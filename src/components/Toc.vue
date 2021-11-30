<template>
  <div class="toc">
    <h1>{{ book.title }}</h1>
    <p>{{ book.description }}</p>
    <h2>Chapters</h2>
    <div v-for="chapter in book.chapters" :key="chapter.title">
      <h3>{{ chapter.title }}</h3>
      <p>{{ chapter.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Book } from "@/models/Book";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Toc",
  props: {
    book: Object,
  },
})
export default class Toc extends Vue {
  private book!: Book;
}
</script>

<style scoped lang="scss"></style>
