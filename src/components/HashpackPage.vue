<template>
  <v-container class="modern-container">
    <v-card elevation="6" class="pa-6 modern-card">
      <v-card-title class="text-h5 secondary--text font-weight-bold">Hashpack</v-card-title>
      <v-card-text>
        <p v-if="account" class="subtitle-1">Connected: {{ account }}</p>
        <v-btn color="success" variant="elevated" @click="simpleAlert" class="mr-4">Simple Alert</v-btn>
        <v-btn color="info" variant="elevated" @click="loggedInAlert" :disabled="!isConnected">
          Logged-In Alert
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'HashpackPage',
  props: {
    isConnected: Boolean,
    account: String,
  },
  methods: {
    simpleAlert() {
      alert('This works without login!');
    },
    loggedInAlert() {
      if (this.isConnected) {
        alert('You are logged in! Special alert.');
      } else {
        alert('Please login with MetaMask first.');
      }
    },
  },
};
</script>

<style scoped>
.modern-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.modern-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.v-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>