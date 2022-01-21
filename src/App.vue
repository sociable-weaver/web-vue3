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

  code {
    padding: 2px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    background-color: lightgrey;
    color: black;
  }

  a code {
    color: -webkit-link;
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
    border: 1px solid black;
    background-color: black;
    color: greenyellow;
  }

  .error {
    border: 1px solid black;
    background-color: orangered;
    color: white;
  }

  p.error {
    padding: 5px;
    border-radius: 5px;
  }

  span.error {
    padding: 5px;
    border-radius: 5px;
  }

  button {
    font-size: 0.8em;
    text-align: center;
    background-color: #dddddd;
    border: 1px solid #5e5e5a;
    border-radius: 2px;
    color: black;
    margin: 0 5px 0 0;
    padding: 2px 5px 3px 5px;
    vertical-align: top;
    text-decoration: none;
    cursor: pointer;
  }

  button:disabled {
    background-color: #c4c3bb;
    color: #5e5e5a;
    cursor: wait;
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

  button.danger {
    background-color: #cc3333;
    color: white;
    margin-right: 10px;
  }

  button.danger:disabled {
    background-color: #e9aeae;
    color: #5e5e5a;
    cursor: wait;
  }

  button.green {
    background-color: #42b983;
    color: white;
    margin-right: 10px;
  }

  button.green:disabled {
    background-color: #b4e2b4;
    color: #5e5e5a;
    cursor: wait;
  }

  button.dark-blue {
    background-color: #2c3e50;
    color: white;
    margin-left: 5px;
  }

  button.dark-blue:disabled {
    background-color: #c8e1ff;
    color: #5e5e5a;
    cursor: wait;
  }

  select {
    font-size: 0.8em;
    background-color: #dddddd;
    border: 1px solid #5e5e5a;
    border-radius: 2px;
    color: black;
    margin: 0 5px 0 0;
    padding: 2px 5px 1px 5px;
    text-align: left;
    vertical-align: top;
    text-decoration: none;
    cursor: pointer;
  }

  select:disabled {
    cursor: wait;
  }

  textarea {
    width: 100%;
    min-height: 300px;
    font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
      Courier New, monospace;
    font-size: 0.8em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;

    box-shadow: 1px 1px 0 #dddddd;
    background-image: -moz-linear-gradient(left, transparent, transparent 1385px, #fee8e9 0);
    background-image: -webkit-linear-gradient(left, transparent, transparent 1385px, #fee8e9 0);
    -webkit-background-size: 100% 50px;
    background-size: 100% 50px;
  }

  div.input-row {
    padding-top: 15px;
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
  padding: 80px 10px 10px;
}
</style>
