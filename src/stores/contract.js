import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers'

export const useContractStore = defineStore('contract', () => {
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

  const value = ref('')
  let contract = null

  const initializeContract = (signer) => {
    if (signer && !contract) {
      contract = new ethers.Contract(contractAddress, contractABI, signer)
    }
  }

  const updateValue = async () => {
    if (!contract) return
    try {
      const currentValue = await contract.getValue()
      value.value = currentValue.toString()
    } catch (error) {
      console.error('Error fetching value:', error)
    }
  }

  const setValue = async (newValue) => {
    if (!contract) {
      alert('Please connect MetaMask first!')
      return false
    }
    
    if (!newValue) {
      alert('Enter a value!')
      return false
    }

    try {
      const tx = await contract.setValue(newValue)
      console.log('Transaction sent:', tx.hash)
      await tx.wait()
      console.log('Transaction confirmed')
      await updateValue()
      return true
    } catch (error) {
      console.error('Transaction error:', error)
      alert('Failed to set value')
      return false
    }
  }

  return {
    value,
    initializeContract,
    updateValue,
    setValue
  }
})