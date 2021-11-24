<template>
  <div class="home">
    <App msg="Sociable Weaver" />
  </div>
</template>

<script lang="ts">
import App from "@/components/App.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    App,
  },
})
export default class Home extends Vue {}
</script>
