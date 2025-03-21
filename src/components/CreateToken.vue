<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Create Token</v-card-title>
          <v-card-text>
            <p v-if="account">Connected: {{ account }}</p>
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