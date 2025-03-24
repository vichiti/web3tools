import { ref } from 'vue'
import { ethers } from 'ethers'

export function useMetaMask() {
  const account = ref('')
  const isConnected = ref(false)
  let provider = null
  let signer = null

  // Connect to MetaMask
  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask!')
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      const accounts = await signer.getAddress()
      account.value = accounts
      isConnected.value = true
      return signer
    } catch (error) {
      console.error('Connection error:', error)
      throw new Error('Failed to connect to MetaMask')
    }
  }

  // Check existing connection
  const checkConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      await connect()
    }
  }

  // Create contract instance
  const getContract = (contractAddress, contractABI) => {
    if (!signer) {
      throw new Error('Please connect MetaMask first!')
    }
    return new ethers.Contract(contractAddress, contractABI, signer)
  }

  return {
    account,
    isConnected,
    connect,
    checkConnection,
    getContract
  }
}