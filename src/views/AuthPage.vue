<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Login with MetaMask</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              @click="connectMetaMask"
              :disabled="isConnected"
              :loading="isConnecting"
              block
            >
              Connect MetaMask
            </v-btn>
            <p v-if="isConnected" class="mt-4 green--text">Connected: {{ account }}</p>
            <p v-if="errorMessage" class="mt-4 red--text">{{ errorMessage }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ethers } from 'ethers';

export default {
  name: 'AuthPage',
  props: {
    isConnected: Boolean,
    account: String,
  },
  data() {
    return {
      isConnecting: false,
      errorMessage: null,
    };
  },
  methods: {
    async connectMetaMask() {
      this.isConnecting = true;
      this.errorMessage = null;
      try {
        if (!window.ethereum) throw new Error('MetaMask not installed');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length === 0) throw new Error('No accounts selected');

        // Switch to Hedera Testnet
        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: '0x128' }]);
        } catch (switchError) {
          if (switchError.code === 4902) {
            await provider.send('wallet_addEthereumChain', [{
              chainId: '0x128',
              chainName: 'Hedera Testnet',
              rpcUrls: ['https://testnet.hashio.io/api'],
              nativeCurrency: { name: 'HBAR', symbol: 'HBAR', decimals: 18 },
              blockExplorerUrls: ['https://hashscan.io/testnet'],
            }]);
          } else {
            throw switchError;
          }
        }

        const account = accounts[0];
        this.$emit('login', { isConnected: true, account });
      } catch (error) {
        this.errorMessage = `Login failed: ${error.message}`;
        console.error(error);
      } finally {
        this.isConnecting = false;
      }
    },
  },
};
</script>