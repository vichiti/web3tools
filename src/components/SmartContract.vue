<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="display-5 font-weight-bold mb-3">
          Interact with SimpleStorage on Hedera Testnet
        </h1>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-btn
          color="primary"
          class="mb-3"
          @click="connect"
          :disabled="metaMask.isConnected"
        >
          {{ metaMask.isConnected ? 'Connected ✅' : 'Connect MetaMask' }}
        </v-btn>

        <p>
          <strong>Account:</strong>
          <span>{{ metaMask.account || 'Not Connected' }}</span>
        </p>

        <p class="mt-5">
          <strong>Current Value:</strong>
          <span>{{ contractStore.value || 'N/A' }}</span>
        </p>

        <v-text-field
          v-model="inputValue"
          type="number"
          label="Enter a number"
          class="mt-5"
          hide-details
        >
          <template v-slot:append>
            <v-btn color="success" @click="setContractValue">Set Value</v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useMetaMask } from '../composables/useMetaMask'
import { useContractStore } from '../stores/contract'

const metaMask = useMetaMask()
const contractStore = useContractStore()
const inputValue = ref('')

const connect = async () => {
  const result = await metaMask.connectMetamask()
  if (result.success) {
    contractStore.initializeContract(metaMask.getSigner())
    await contractStore.updateValue()
  }
}

const setContractValue = async () => {
  const success = await contractStore.setValue(inputValue.value)
  if (success) {
    inputValue.value = ''
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