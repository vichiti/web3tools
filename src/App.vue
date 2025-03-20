<template>
  <div id="app">
    <nav>
      <router-link to="/">Home (MetaMask)</router-link> |
      <router-link to="/hashpack">Hashpack Page</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
nav {
  padding: 10px;
  text-align: center;
}
nav a {
  margin: 0 10px;
}
</style>