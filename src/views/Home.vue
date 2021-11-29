<template>
  <div class="home">
    <App @app-is-running="onAppIsRunning" />
    <Open v-if="appIsRunning" />
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
export default class Home extends Vue {
  private appIsRunning = false;

  private onAppIsRunning(state: boolean): void {
    console.log("State", state);
    this.appIsRunning = state;
  }
}
</script>
