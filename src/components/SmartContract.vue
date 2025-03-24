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
          class="mb-3 mr-2"
          @click="connectMetamask"
          :disabled="isActuallyConnected"
        >
          {{ isActuallyConnected ? 'Connected ✅' : 'Connect MetaMask' }}
        </v-btn>

        <v-btn
          v-if="isActuallyConnected"
          color="error"
          class="mb-3"
          @click="logout"
        >
          Logout
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
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const contractABI = JSON.parse(import.meta.env.VITE_CONTRACT_ABI)


// Reactive variables
const metaMask = useMetaMask()
const contract = ref(null)
const value = ref('')
const inputValue = ref('')
const isActuallyConnected = ref(false)

// Check actual MetaMask connection status
const checkMetaMaskConnection = async () => {
  if (!window.ethereum) {
    console.log('MetaMask not detected')
    isActuallyConnected.value = false
    return false
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    console.log('Connected accounts:', accounts)
    isActuallyConnected.value = accounts.length > 0
    if (isActuallyConnected.value) {
      metaMask.account.value = accounts[0]
    }
    return isActuallyConnected.value
  } catch (error) {
    console.error('Error checking connection:', error.message)
    isActuallyConnected.value = false
    return false
  }
}

// Initialize contract
const initializeContract = async () => {
  try {
    console.log('Initializing MetaMask connection...')
    if (!await checkMetaMaskConnection()) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    }
    
    await metaMask.connect()
    console.log('MetaMask connected, account:', metaMask.account)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    console.log('Current network:', network)
    if (network.chainId !== 296) {
      throw new Error('Please switch MetaMask to Hedera Testnet (Chain ID: 296)')
    }

    contract.value = metaMask.getContract(contractAddress, contractABI)
    console.log('Contract initialized at:', contractAddress)
    await updateValue()
    isActuallyConnected.value = true
  } catch (error) {
    console.error('Initialization failed:', error.message)
    alert(`Failed to initialize: ${error.message}`)
    isActuallyConnected.value = false
  }
}

// Connect to MetaMask
const connectMetamask = async () => {
  await initializeContract()
}

// Update displayed value
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
    value.value = `Error: ${error.message}`
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

// Logout function
const logout = () => {
  console.log('Logging out...')
  // Reset all reactive variables
  contract.value = null
  value.value = ''
  inputValue.value = ''
  metaMask.account.value = ''
  metaMask.isConnected.value = false
  isActuallyConnected.value = false
  console.log('All variables reset')
}

// Check connection on mount
onMounted(async () => {
  console.log('Component mounted, checking connection...')
  const isConnected = await checkMetaMaskConnection()
  if (isConnected) {
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
.mr-2 {
  margin-right: 0.5rem; /* Space between Connect and Logout buttons */
}
</style>