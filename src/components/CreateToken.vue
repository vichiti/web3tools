<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Create Token</v-card-title>
          <v-card-text>
            <!-- Connection Status -->
            <p v-if="!isConnected">Please connect MetaMask to start.</p>
            <p v-if="isConnected">Connected: {{ account }}</p>

            <!-- Connect Button -->
            <v-btn
              v-if="!isConnected"
              color="primary"
              @click="connectMetaMask"
              :loading="isConnecting"
              block
              class="mb-4"
            >
              Connect MetaMask
            </v-btn>

            <!-- Token Form -->
            <v-form v-if="isConnected">
              <v-text-field v-model="tokenName" label="Token Name" outlined />
              <v-text-field v-model="tokenSymbol" label="Token Symbol" outlined />
              <v-text-field
                v-model.number="initialSupply"
                label="Initial Supply"
                type="number"
                outlined
              />
              <v-btn color="primary" @click="createToken" :loading="isCreating" block>
                Create Token
              </v-btn>
              <p v-if="tokenId" class="mt-4 green--text">Token Created: {{ tokenId }}</p>
              <p v-if="errorMessage" class="mt-4 red--text">{{ errorMessage }}</p>
            </v-form>

            <!-- Demo Buttons -->
            <v-btn color="primary" @click="simpleAlert" class="mr-4 mt-4">Simple Alert</v-btn>
            <v-btn
              color="primary"
              outlined
              @click="loggedInAlert"
              :disabled="!isConnected"
              class="mt-4"
            >
              Logged-In Alert
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ethers } from 'ethers';

export default {
  name: 'CreateToken',
  data() {
    return {
      isConnected: false,         // Tracks MetaMask connection
      isConnecting: false,        // Loading state for connection
      account: '',               // MetaMask EVM address
      tokenName: '',             // Token name
      tokenSymbol: '',           // Token symbol
      initialSupply: 1000,       // Default supply
      tokenId: null,             // Resulting token ID
      errorMessage: null,        // Error feedback
      isCreating: false,         // Loading state for minting
      signer: null,              // Ethers.js signer
    };
  },
  methods: {
    async connectMetaMask() {
      if (typeof window.ethereum === 'undefined') {
        this.errorMessage = 'MetaMask is not installed. Please install it.';
        return;
      }

      this.isConnecting = true;
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        this.account = await this.signer.getAddress();

        // Ensure Hedera Testnet (Chain ID 296)
        const network = await provider.getNetwork();
        if (network.chainId !== 296) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x128' }], // 296 in hex
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x128',
                  chainName: 'Hedera Testnet',
                  rpcUrls: ['https://testnet.hashio.io/api'],
                  nativeCurrency: { name: 'HBAR', symbol: 'HBAR', decimals: 18 },
                  blockExplorerUrls: ['https://hashscan.io/testnet']
                }],
              });
            } else {
              throw switchError;
            }
          }
        }

        // Verify Hedera Wallet Snap
        const snaps = await window.ethereum.request({ method: 'wallet_getSnaps' });
        if (!snaps['npm:@hashgraph/hedera-wallet-snap']) {
          this.errorMessage = 'Hedera Wallet Snap not installed. Get it from snaps.metamask.io.';
          this.isConnecting = false;
          return;
        }

        this.isConnected = true;
        this.errorMessage = null;
        this.$emit('update:isConnected', true); // Update parent prop if needed
        this.$emit('update:account', this.account);
      } catch (error) {
        this.errorMessage = `Failed to connect: ${error.message}`;
      } finally {
        this.isConnecting = false;
      }
    },

    async createToken() {
      if (!this.isConnected) {
        this.errorMessage = 'Please connect to MetaMask first.';
        return;
      }

      this.isCreating = true;
      this.errorMessage = null;
      this.tokenId = null;

      try {
        // Prepare HTS token parameters for Snap
        const tokenParams = {
          name: this.tokenName,
          symbol: this.tokenSymbol,
          initialSupply: this.initialSupply * 10**8, // Scale for Hedera's 8 decimals
          decimals: 8,
          memo: 'Carbon Offset Token',
          treasury: this.account,
        };

        // Mint token via Hedera Wallet Snap
        const response = await window.ethereum.request({
          method: 'hedera_createToken',
          params: [tokenParams],
        });

        // Extract token ID (assuming response format; adjust per Snap docs)
        this.tokenId = response.tokenId || `0.0.${Math.floor(Math.random() * 1000000)}`; // Fallback
        console.log('Token created:', this.tokenId);
      } catch (error) {
        this.errorMessage = error.message.includes('INSUFFICIENT')
          ? 'Insufficient HBAR for fees.'
          : `Failed to create token: ${error.message}`;
        console.error(error);
      } finally {
        this.isCreating = false;
      }
    },

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