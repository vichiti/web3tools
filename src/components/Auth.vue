<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Login with MetaMask</v-card-title>
          <v-card-text>
            <p>Connect your wallet to access restricted features.</p>
            <v-btn
              color="primary"
              :loading="isConnecting"
              :disabled="isConnected"
              @click="connectMetaMask"
              block
            >
              {{ isConnected ? 'Connected' : 'Connect MetaMask' }}
            </v-btn>
            <p v-if="account" class="mt-4">Connected: {{ account }}</p>
            <p v-if="errorMessage" class="mt-4 red--text">{{ errorMessage }}</p>
          </v-card-text>
          <v-card-actions v-if="isConnected">
            <v-btn to="/" text>Go to Home</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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