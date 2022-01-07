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

  pre {
    padding: 5px;
    border: 1px solid #2c3e50;
    border-radius: 5px;
    background-color: lightgrey;
    white-space: pre-wrap;
  }

  pre code {
    border: 0;
    padding: 0;
    margin: 0;
  }

  pre.runnable {
    background-color: black;
  }

  pre.error {
    border: 1px solid #5e5e5a;
    background-color: orangered;
    color: white;
  }

  button.primary {
    background-color: #337ab7;
    color: white;
  }

  button.primary:disabled {
    background-color: #84a0b8;
    color: #5e5e5a;
    cursor: wait;
  }

  .tip {
    font-size: 0.8em;
    font-style: italic;
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
