<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Create Token</v-card-title>
          <v-card-text>
            <!-- Connection Status -->
            <p v-if="!isConnected">Please <router-link to="/auth">connect MetaMask</router-link> to start.</p>
            <p v-if="isConnected">Connected: {{ account }}</p>

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
  props: {
    isConnected: {
      type: Boolean,
      default: false,
    },
    account: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tokenName: '',
      tokenSymbol: '',
      initialSupply: 1000,
      tokenId: null,
      errorMessage: null,
      isCreating: false,
      signer: null,
    };
  },
  async mounted() {
    // Initialize signer if connected
    if (this.isConnected && this.account) {
      await this.initializeSigner();
    }
  },
  watch: {
    // React to prop changes from auth page
    isConnected(newVal) {
      if (newVal && this.account) {
        this.initializeSigner();
      }
    },
  },
  methods: {
    async initializeSigner() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        const connectedAccount = await this.signer.getAddress();
        if (connectedAccount.toLowerCase() !== this.account.toLowerCase()) {
          this.errorMessage = 'Account mismatch. Please ensure the correct account is selected in MetaMask.';
          return;
        }
        console.log('Signer initialized for account:', this.account);
      } catch (error) {
        this.errorMessage = `Failed to initialize signer: ${error.message}`;
        console.error(error);
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
        // Ensure Hedera Testnet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 296) {
          this.errorMessage = 'Please switch to Hedera Testnet (Chain ID 296) in MetaMask.';
          this.isCreating = false;
          return;
        }

        // Verify Hedera Snap
        const snaps = await window.ethereum.request({ method: 'wallet_getSnaps' });
        if (!snaps['npm:@hashgraph/hedera-wallet-snap']) {
          this.errorMessage = 'Hedera Wallet Snap not installed. Get it from snaps.metamask.io.';
          this.isCreating = false;
          return;
        }

        const tokenParams = {
          name: this.tokenName,
          symbol: this.tokenSymbol,
          initialSupply: this.initialSupply * 10**8, // Hedera uses 8 decimals
          decimals: 8,
          memo: 'Carbon Offset Token',
          treasury: this.account,
        };

        const response = await window.ethereum.request({
          method: 'hedera_createToken',
          params: [tokenParams],
        });

        this.tokenId = response.tokenId || `0.0.${Math.floor(Math.random() * 1000000)}`;
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