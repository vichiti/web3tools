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
import { ethers } from 'ethers';

export default {
  name: 'App',
  data() {
    return {
      isConnected: false,
      account: null,
    };
  },
  async mounted() {
    await this.checkMetaMaskConnection();
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      window.ethereum.on('chainChanged', this.handleChainChanged);
    }
  },
  beforeUnmount() {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    }
  },
  methods: {
    async checkMetaMaskConnection() {
      if (!window.ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.isConnected = true;
          console.log('Initial MetaMask connection detected:', this.account);
        } else {
          console.log('No accounts connected on load');
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
      }
    },

    handleLogin({ isConnected, account }) {
      this.isConnected = isConnected;
      this.account = account;
      console.log('Login event received:', { isConnected, account });
    },

    handleAccountsChanged(accounts) {
      if (accounts.length > 0) {
        this.isConnected = true;
        this.account = accounts[0];
        console.log('Accounts changed:', this.account);
      } else {
        this.isConnected = false;
        this.account = null;
        console.log('MetaMask disconnected');
      }
    },

    handleChainChanged(chainId) {
      console.log('Chain changed to:', chainId);
      // Optionally recheck connection if needed
      this.checkMetaMaskConnection();
    },
  },
};
</script>