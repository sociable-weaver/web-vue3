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
      <button class="open" v-else>Open</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Open extends Vue {
  private openFrom = "checkout";
  private pathToRepository = "";
  private checkoutToFolder = "";
  private openFromFolder = "";
  private workspace = "";
}
</script>

<style scoped lang="scss">
input[type="text"] {
  width: 400px;
}
</style>
