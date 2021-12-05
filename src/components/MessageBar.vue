<template>
  <div class="message-bar">
    <div>{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "MessageBar",
  props: {
    message: String,
  },
})
export default class MessageBar extends Vue {
  private message!: string;
}
</script>

<style scoped lang="scss"></style>
