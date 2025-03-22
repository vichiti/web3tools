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
              Connect MetaMask (Hedera Testnet)
            </v-btn>
            <p v-if="isConnected" class="mt-4 green--text">Connected: {{ account }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ethers } from 'ethers';

export default {
  name: 'Auth',
  props: {
    isConnected: Boolean,
    account: String,
  },
  data() {
    return {
      isConnecting: false,
    };
  },
  methods: {
    async connectMetaMask() {
      this.isConnecting = true;
      try {
        if (!window.ethereum) throw new Error('MetaMask not installed');

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 296) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x128' }], // 296 in hex
          });
        }

        const accounts = await provider.send('eth_requestAccounts', []);
        const account = accounts[0];
        this.$emit('login', { isConnected: true, account });
        this.$router.push('/create-token-alt'); // Redirect to new page for testing
      } catch (error) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x128',
              chainName: 'Hedera Testnet',
              rpcUrls: ['https://testnet.hashio.io/api'],
              nativeCurrency: { name: 'HBAR', symbolYoga: 'HBAR', decimals: 18 },
              blockExplorerUrls: ['https://hashscan.io/testnet'],
            }],
          });
          await this.connectMetaMask(); // Retry after adding
        } else {
          console.error('Auth failed:', error.message);
        }
      } finally {
        this.isConnecting = false;
      }
    },
  },
};
</script>