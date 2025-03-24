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
import { useMetaMask } from '../composables/useMetaMask'
import { ethers } from 'ethers'

// Contract details
const contractAddress = "0x401d7bDe9FC1e4E58ce37D3702027fa468a213B4" // Verify this address!
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
const metaMask = useMetaMask()
const contract = ref(null)
const value = ref('')
const inputValue = ref('')

// Initialize contract with network check
const initializeContract = async () => {
  try {
    console.log('Initializing MetaMask connection...')
    await metaMask.connect()
    console.log('MetaMask connected, account:', metaMask.account)

    // Check network
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    console.log('Current network:', network)
    if (network.chainId !== 296) { // Hedera Testnet Chain ID
      throw new Error('Please switch MetaMask to Hedera Testnet (Chain ID: 296)')
    }

    contract.value = metaMask.getContract(contractAddress, contractABI)
    console.log('Contract initialized at:', contractAddress)
    await updateValue()
  } catch (error) {
    console.error('Initialization failed:', error.message)
    alert(`Failed to initialize: ${error.message}`)
  }
}

// Connect to MetaMask
const connectMetamask = async () => {
  await initializeContract()
}

// Update displayed value with detailed error handling
const updateValue = async () => {
  if (!contract.value) {
    console.log('Contract not initialized yet')
    value.value = 'Contract not initialized'
    return
  }

  try {
    console.log('Calling getValue() on contract at:', contractAddress)
    const currentValue = await contract.value.getValue()
    console.log('Raw value from contract:', currentValue.toString())
    value.value = currentValue.toString()
  } catch (error) {
    console.error('Error fetching value:', error)
    if (error.code === 'CALL_EXCEPTION') {
      value.value = 'Call reverted - check contract state or address'
      console.log('Call exception details:', {
        method: error.method,
        data: error.data,
        reason: error.reason
      })
    } else {
      value.value = `Error: ${error.message}`
    }
  }
}

// Set new value
const setValue = async () => {
  if (!contract.value) {
    alert('Please connect MetaMask first!')
    return
  }
  
  if (!inputValue.value) {
    alert('Enter a value!')
    return
  }

  try {
    console.log('Setting value:', inputValue.value)
    const tx = await contract.value.setValue(inputValue.value)
    console.log('Transaction sent:', tx.hash)
    await tx.wait()
    console.log('Transaction confirmed')
    await updateValue()
    inputValue.value = ''
  } catch (error) {
    console.error('Transaction error:', error.message)
    alert('Failed to set value: ' + error.message)
  }
}

// Check for existing connection on mount
onMounted(async () => {
  console.log('Component mounted, checking connection...')
  await metaMask.checkConnection()
  if (metaMask.isConnected) {
    console.log('Existing connection found, initializing contract...')
    await initializeContract()
  } else {
    console.log('No existing connection detected')
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