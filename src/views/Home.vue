<template>
  <div class="home">
    <App msg="Sociable Weaver" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import App from "@/components/App.vue";

@Options({
  components: {
    App,
  },
})
export default class Home extends Vue {}
</script>
