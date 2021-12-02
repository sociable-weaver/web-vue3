<template>
  <div class="content">
    <div v-for="entry in chapter.entries" :key="entry.id">
      {{ entry.type }}
    </div>
  </div>
</template>

<script lang="ts">
import { Chapter } from "@/models/Chapter";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Content",
  props: {
    chapter: Object,
  },
})
export default class Content extends Vue {
  private chapter!: Chapter;
}
</script>

<style scoped lang="scss"></style>
