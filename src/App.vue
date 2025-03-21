<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My App</v-toolbar-title>
      <v-spacer />
      <v-btn to="/menu" icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn to="/auth" text :disabled="isConnected">
        {{ isConnected ? 'Connected' : 'Login' }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <component :is="Component" :is-connected="isConnected" :account="account" @login="handleLogin" />
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isConnected: false,
      account: null,
    };
  },
  methods: {
    handleLogin({ isConnected, account }) {
      this.isConnected = isConnected;
      this.account = account;
    },
  },
  mounted() {
    if (window.ethereum && window.ethereum.selectedAddress) {
      this.isConnected = true;
      this.account = window.ethereum.selectedAddress;
    }
  },
};
</script>