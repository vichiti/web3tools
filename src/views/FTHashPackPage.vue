<template>
  <v-container class="text-center">
    <h1 class="display-5 font-weight-bold mb-3">Create Fungible Token on Hedera</h1>
    
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-form @submit.prevent="createToken">
          <v-text-field
            v-model="tokenName"
            label="Token Name"
            required
            class="mb-3"
          ></v-text-field>
          
          <v-text-field
            v-model="tokenSymbol"
            label="Token Symbol"
            required
            class="mb-3"
          ></v-text-field>
          
          <v-text-field
            v-model="initialSupply"
            type="number"
            label="Initial Supply"
            required
            class="mb-3"
          ></v-text-field>
          
          <v-text-field
            v-model="accountId"
            label="Hedera Account ID (e.g., 0.0.xxxx)"
            required
            class="mb-3"
          ></v-text-field>
          
          <v-text-field
            v-model="privateKey"
            label="Private Key"
            type="password"
            required
            class="mb-3"
          ></v-text-field>

          <v-btn
            color="primary"
            type="submit"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Create Token
          </v-btn>
        </v-form>

        <v-alert
          v-if="tokenId"
          type="success"
          class="mt-5"
        >
          Token Created Successfully! Token ID: {{ tokenId }}
          <v-btn
            color="white"
            class="mt-2"
            @click="checkToken"
            :loading="isChecking"
            :disabled="isChecking"
          >
            Check Token Details
          </v-btn>
        </v-alert>

        <v-alert
          v-if="tokenDetails"
          type="info"
          class="mt-5"
        >
          <div>Token Name: {{ tokenDetails.name }}</div>
          <div>Symbol: {{ tokenDetails.symbol }}</div>
          <div>Total Supply: {{ tokenDetails.totalSupply / 100 }}</div>
        </v-alert>

        <v-alert
          v-if="error"
          type="error"
          class="mt-5"
        >
          Error: {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery
} from '@hashgraph/sdk'

// Reactive variables
const tokenName = ref('')
const tokenSymbol = ref('')
const initialSupply = ref('')
const accountId = ref('')
const privateKey = ref('')
const tokenId = ref('')
const tokenDetails = ref(null)
const error = ref('')
const isLoading = ref(false)
const isChecking = ref(false)

const createToken = async () => {
  isLoading.value = true
  error.value = ''
  tokenId.value = ''
  tokenDetails.value = null

  try {
    if (!tokenName.value || !tokenSymbol.value || !initialSupply.value || !accountId.value || !privateKey.value) {
      throw new Error('All fields are required')
    }

    const client = Client.forTestnet()
    const myPrivateKey = PrivateKey.fromString(privateKey.value)
    client.setOperator(accountId.value, myPrivateKey)

    const transaction = new TokenCreateTransaction()
      .setTokenName(tokenName.value)
      .setTokenSymbol(tokenSymbol.value)
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(2)
      .setInitialSupply(Number(initialSupply.value) * 100)
      .setTreasuryAccountId(accountId.value)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(myPrivateKey)
      .setAdminKey(myPrivateKey)
      .freezeWith(client)

    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)
    
    tokenId.value = receipt.tokenId.toString()
    console.log('Token created with ID:', tokenId.value)

    tokenName.value = ''
    tokenSymbol.value = ''
    initialSupply.value = ''
  } catch (err) {
    console.error('Token creation failed:', err)
    error.value = err.message || 'Failed to create token'
  } finally {
    isLoading.value = false
  }
}

const checkToken = async () => {
  isChecking.value = true
  error.value = ''
  tokenDetails.value = null

  try {
    if (!tokenId.value || !accountId.value || !privateKey.value) {
      throw new Error('Token ID and account credentials are required')
    }

    const client = Client.forTestnet()
    const myPrivateKey = PrivateKey.fromString(privateKey.value)
    client.setOperator(accountId.value, myPrivateKey)

    const query = new TokenInfoQuery()
      .setTokenId(tokenId.value)
    
    const tokenInfo = await query.execute(client)
    
    tokenDetails.value = {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      totalSupply: tokenInfo.totalSupply.toInt()
    }
    console.log('Token details:', tokenDetails.value)
  } catch (err) {
    console.error('Token query failed:', err)
    error.value = err.message || 'Failed to fetch token details'
  } finally {
    isChecking.value = false
  }
}
</script>

<style scoped>
.display-5 {
  font-size: 2.5rem;
}
.font-weight-bold {
  font-weight: 700;
}
.mb-3 {
  margin-bottom: 1rem;
}
.mt-5 {
  margin-top: 3rem;
}
</style>