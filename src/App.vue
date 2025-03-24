<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Hedera DApp</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/smart-contract" text>Smart Contract</v-btn>
      <v-btn to="/ft" text>FT</v-btn>
      <v-btn to="/ft-hash-pack" text>FT HashPack</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item to="/smart-contract" prepend-icon="mdi-ethereum" title="Smart Contract"></v-list-item>
        <v-list-item to="/ft" prepend-icon="mdi-currency-usd" title="Fungible Token"></v-list-item>
        <v-list-item to="/ft-hash-pack" prepend-icon="mdi-currency-usd" title="Fungible Token HashPack"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>

<style scoped>
</style>


