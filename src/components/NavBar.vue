<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />
    <v-btn to="/" text>Home</v-btn>
    <v-btn to="/create-token" text>Create Token</v-btn>
    <v-btn to="/create-token-alt" text>Create Token (Contract)</v-btn> <!-- New link -->
    <v-btn to="/auth" text :disabled="isConnected">
      {{ isConnected ? 'Connected' : 'Login' }}
    </v-btn>
    <v-btn icon @click="toggleMenu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-menu v-model="menuOpen" :close-on-content-click="true" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon class="d-none" />
      </template>
      <v-list>
        <v-list-item to="/"> <v-list-item-title>Home</v-list-item-title> </v-list-item>
        <v-list-item to="/create-token"> <v-list-item-title>Create Token</v-list-item-title> </v-list-item>
        <v-list-item to="/create-token-alt"> <v-list-item-title>Create Token (Contract)</v-list-item-title> </v-list-item> <!-- New menu item -->
        <v-list-item to="/auth"> <v-list-item-title>{{ isConnected ? 'Connected' : 'Login' }}</v-list-item-title> </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    isConnected: Boolean,
    account: String,
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>