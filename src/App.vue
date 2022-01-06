<template>
  <div class="navigation">
    <router-link to="/">Book</router-link>
    <router-link to="/about">About</router-link>
  </div>
  <div class="content">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1.5em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  h2 {
    margin: 40px 0 0;
  }
}

body {
  margin: 0;
}

.navigation {
  margin: 0;
  background-color: #2c3e50;
  position: fixed;
  top: 0;
  padding: 30px;
  width: 100%;

  a {
    font-weight: bold;
    color: #c8e1ff;
    height: 80px;
    padding-right: 50px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.content {
  padding: 102px 10px 10px;
}
</style>
