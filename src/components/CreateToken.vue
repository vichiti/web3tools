<template>
  <v-container class="modern-container">
    <v-card elevation="6" class="pa-6 modern-card">
      <v-card-title class="text-h5 accent--text font-weight-bold">Create Token</v-card-title>
      <v-card-text>
        <p v-if="account" class="subtitle-1">Connected: {{ account }}</p>
        <v-form v-if="isConnected">
          <v-text-field
            v-model="tokenName"
            label="Token Name"
            variant="outlined"
            color="primary"
          />
          <v-text-field
            v-model="tokenSymbol"
            label="Token Symbol"
            variant="outlined"
            color="primary"
          />
          <v-text-field
            v-model.number="initialSupply"
            label="Initial Supply"
            type="number"
            variant="outlined"
            color="primary"
          />
          <v-btn
            color="primary"
            variant="elevated"
            @click="createToken"
            :loading="isCreating"
            block
          >
            Create Token
          </v-btn>
          <p v-if="tokenId" class="mt-2 success--text">Token Created: {{ tokenId }}</p>
          <p v-if="errorMessage" class="mt-2 error--text">{{ errorMessage }}</p>
        </v-form>
        <v-btn color="success" variant="elevated" @click="simpleAlert" class="mr-4 mt-4">Simple Alert</v-btn>
        <v-btn color="info" variant="elevated" @click="loggedInAlert" :disabled="!isConnected" class="mt-4">
          Logged-In Alert
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { Client, TokenCreateTransaction, Hbar, AccountId, PrivateKey } from '@hashgraph/sdk';

export default {
  name: 'CreateToken',
  props: {
    isConnected: Boolean,
    account: String,
  },
  data() {
    return {
      tokenName: '',
      tokenSymbol: '',
      initialSupply: 1000,
      tokenId: null,
      errorMessage: null,
      isCreating: false,
      client: null,
    };
  },
  methods: {
    async createToken() {
      if (!this.isConnected) {
        this.errorMessage = 'Please connect to MetaMask first.';
        return;
      }

      try {
        this.isCreating = true;
        this.client = Client.forTestnet();
        const hederaAccountId = AccountId.fromString('0.0.YOUR_ACCOUNT_ID'); // Replace with your Hedera testnet account ID
        const privateKey = PrivateKey.fromString('YOUR_PRIVATE_KEY'); // Replace with your Hedera testnet private key
        this.client.setOperator(hederaAccountId, privateKey);

        const transaction = new TokenCreateTransaction()
          .setTokenName(this.tokenName)
          .setTokenSymbol(this.tokenSymbol)
          .setDecimals(2)
          .setInitialSupply(this.initialSupply)
          .setTreasuryAccountId(hederaAccountId)
          .setMaxTransactionFee(new Hbar(30));

        const txResponse = await transaction.execute(this.client);
        const receipt = await txResponse.getReceipt(this.client);
        this.tokenId = receipt.tokenId.toString();
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.message.includes('INSUFFICIENT_PAYER_BALANCE')
          ? 'Insufficient HBAR for fees.'
          : 'Failed to create token. Check console.';
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