<template>
  <v-app>
    <nav-bar :is-connected="isConnected" :account="account" @login="handleLogin" />
    <v-main>
      <router-view :is-connected="isConnected" :account="account" @login="handleLogin" />
    </v-main>
  </v-app>
</template>

<script>
import { ethers } from 'ethers';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: { NavBar },
  data() {
    return {
      isConnected: false,
      account: null,
    };
  },
  async mounted() {
    await this.checkMetaMaskConnection();
    if (window.ethereum) {
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
          console.log('Initial connection detected:', this.account);
        } else {
          console.log('No accounts connected on load');
        }
      } catch (error) {
        console.error('Connection check failed:', error);
      }
    },
    handleLogin({ isConnected, account }) {
      this.isConnected = isConnected;
      this.account = account;
      console.log('Login event received:', { isConnected, account });
    },
    handleAccountsChanged(accounts) {
      this.isConnected = accounts.length > 0;
      this.account = accounts.length > 0 ? accounts[0] : null;
      console.log('Accounts changed:', this.account);
    },
    handleChainChanged(chainId) {
      console.log('Chain changed to:', chainId);
      this.checkMetaMaskConnection();
    },
  },
};
</script>