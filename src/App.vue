<template>
  <v-app>
    <v-app-bar app color="white" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-toolbar-title class="primary--text font-weight-bold">My App</v-toolbar-title>
      <v-spacer />
      <v-btn v-if="isConnected" to="/auth" text color="primary">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary color="white" class="shadow-drawer">
      <v-list dense>
        <v-list-item>
          <v-img src="https://via.placeholder.com/150" alt="Logo" max-height="100" contain class="my-4" />
        </v-list-item>
        <v-divider />
        <v-list-item to="/" @click="drawer = false">
          <v-list-item-icon>
            <v-icon color="primary">mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/hashpack" @click="drawer = false">
          <v-list-item-icon>
            <v-icon color="secondary">mdi-wallet</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Hashpack</v-list-item-title>
        </v-list-item>
        <v-list-item to="/create-token" @click="drawer = false">
          <v-list-item-icon>
            <v-icon color="accent">mdi-currency-usd</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Create Token</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!isConnected" to="/auth" @click="drawer = false">
          <v-list-item-icon>
            <v-icon color="primary">mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-bg">
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
      drawer: false,
      isConnected: false,
      account: null,
    };
  },
  methods: {
    handleLogin({ isConnected, account }) {
      this.isConnected = isConnected;
      this.account = account;
      if (isConnected) this.$router.push('/'); // Redirect to home after login
    },
  },
};
</script>

<style scoped>
.main-bg {
  background: #FAFAFA;
}
.shadow-drawer {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.v-btn, .v-list-item {
  transition: all 0.3s ease;
}
.v-list-item:hover {
  background: rgba(0, 150, 136, 0.1); /* Teal hover effect */
}
</style>