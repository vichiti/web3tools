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
          @click="connectMetamask"
          :disabled="isConnected"
        >
          {{ isConnected ? 'Connected ✅' : 'Connect MetaMask' }}
        </v-btn>

        <p>
          <strong>Account:</strong>
          <span>{{ account || 'Not Connected' }}</span>
        </p>

        <p class="mt-5">
          <strong>Current Value:</strong>
          <span>{{ value || 'N/A' }}</span>
        </p>

        <v-text-field
          v-model="inputValue"
          type="number"
          label="Enter a number"
          class="mt-5"
          hide-details
        >
          <template v-slot:append>
            <v-btn color="success" @click="setValue">Set Value</v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ethers } from 'ethers'

// Contract details
const contractAddress = "0x401d7bDe9FC1e4E58ce37D3702027fa468a213B4"
const contractABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "setValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getValue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "storedValue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// Reactive variables
const account = ref('')
const value = ref('')
const inputValue = ref('')
const isConnected = ref(false)
let provider = null
let signer = null
let contract = null

// Connect to MetaMask
const connectMetamask = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask!')
    return
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    const accounts = await signer.getAddress()
    account.value = accounts
    isConnected.value = true

    // Connect to contract
    contract = new ethers.Contract(contractAddress, contractABI, signer)
    await updateValue()
  } catch (error) {
    console.error('Connection error:', error)
    alert('Failed to connect to MetaMask')
  }
}

// Update displayed value
const updateValue = async () => {
  if (contract) {
    try {
      const currentValue = await contract.getValue()
      value.value = currentValue.toString()
    } catch (error) {
      console.error('Error fetching value:', error)
    }
  }
}

// Set new value
const setValue = async () => {
  if (!contract) {
    alert('Please connect MetaMask first!')
    return
  }
  
  if (!inputValue.value) {
    alert('Enter a value!')
    return
  }

  try {
    const tx = await contract.setValue(inputValue.value)
    console.log('Transaction sent:', tx.hash)
    await tx.wait()
    console.log('Transaction confirmed')
    await updateValue()
    inputValue.value = ''
  } catch (error) {
    console.error('Transaction error:', error)
    alert('Failed to set value')
  }
}

// Check for existing connection on mount
onMounted(() => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    connectMetamask()
  }
})
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