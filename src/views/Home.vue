<template>
  <div class="home">
    <App />
    <Open />
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import Open from "@/components/Open.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    App,
    Open,
  },
})
export default class Home extends Vue {}
</script>
