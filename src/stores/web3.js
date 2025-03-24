import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers'

// Contract configuration
const CONTRACT_CONFIG = {
  address: "0x401d7bDe9FC1e4E58ce37D3702027fa468a213B4",
  abi: [
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
}

export const useWeb3Store = defineStore('web3', () => {
  // State
  const account = ref('')
  const isConnected = ref(false)
  const provider = ref(null)
  const signer = ref(null)
  const contract = ref(null)
  const currentValue = ref('')

  // Actions
  async function connectMetamask() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask!')
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      provider.value = new ethers.providers.Web3Provider(window.ethereum)
      signer.value = provider.value.getSigner()
      account.value = await signer.value.getAddress()
      isConnected.value = true

      // Initialize contract
      contract.value = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer.value
      )

      await updateValue()
    } catch (error) {
      console.error('Connection error:', error)
      throw error
    }
  }

  async function updateValue() {
    if (!contract.value) return
    try {
      const value = await contract.value.getValue()
      currentValue.value = value.toString()
    } catch (error) {
      console.error('Error fetching value:', error)
      throw error
    }
  }

  async function setValue(newValue) {
    if (!contract.value) {
      throw new Error('Please connect MetaMask first!')
    }
    if (!newValue) {
      throw new Error('Enter a value!')
    }

    try {
      const tx = await contract.value.setValue(newValue)
      console.log('Transaction sent:', tx.hash)
      await tx.wait()
      console.log('Transaction confirmed')
      await updateValue()
    } catch (error) {
      console.error('Transaction error:', error)
      throw error
    }
  }

  // Initialize on store creation
  async function initialize() {
    if (window.ethereum && window.ethereum.selectedAddress) {
      try {
        await connectMetamask()
      } catch (error) {
        console.error('Auto-connect failed:', error)
      }
    }
  }

  // Handle account changes
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        account.value = accounts[0]
        if (signer.value) {
          contract.value = new ethers.Contract(
            CONTRACT_CONFIG.address,
            CONTRACT_CONFIG.abi,
            signer.value
          )
          updateValue()
        }
      } else {
        reset()
      }
    })

    window.ethereum.on('chainChanged', () => {
      if (isConnected.value) {
        connectMetamask()
      }
    })
  }

  function reset() {
    account.value = ''
    isConnected.value = false
    provider.value = null
    signer.value = null
    contract.value = null
    currentValue.value = ''
  }

  return {
    account,
    isConnected,
    provider,
    signer,
    contract,
    currentValue,
    connectMetamask,
    updateValue,
    setValue,
    initialize,
    reset
  }
})