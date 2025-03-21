<template>
  <v-container class="auth-container">
    <v-card elevation="6" class="pa-6 mx-auto modern-card" max-width="400">
      <v-card-title class="text-h5 primary--text font-weight-bold justify-center">
        Welcome
      </v-card-title>
      <v-card-text class="text-center">
        <p class="mb-4 subtitle-1">Connect your MetaMask wallet to get started.</p>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="isConnecting"
          :disabled="isConnected"
          @click="connectMetaMask"
          block
          class="mb-4"
        >
          <v-icon left>mdi-wallet</v-icon>
          {{ isConnected ? 'Connected' : 'Login with MetaMask' }}
        </v-btn>
        <p v-if="account" class="success--text">Connected: {{ account }}</p>
        <p v-if="errorMessage" class="error--text mt-2">{{ errorMessage }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      isConnected: false,
      isConnecting: false,
      account: null,
      errorMessage: null,
    };
  },
  methods: {
    async connectMetaMask() {
      if (typeof window.ethereum === 'undefined') {
        this.errorMessage = 'MetaMask is not installed.';
        return;
      }
      try {
        this.isConnecting = true;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.isConnected = true;
        this.errorMessage = null;
        this.$emit('login', { isConnected: true, account: this.account });
      } catch (error) {
        this.errorMessage = error.code === 4001 ? 'User rejected the request.' : 'Login failed.';
        console.error(error);
      } finally {
        this.isConnecting = false;
      }
    },
  },
  mounted() {
    if (window.ethereum && window.ethereum.selectedAddress) {
      this.isConnected = true;
      this.account = window.ethereum.selectedAddress;
      this.$emit('login', { isConnected: true, account: this.account });
    }
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #FAFAFA;
}
.modern-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.v-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>