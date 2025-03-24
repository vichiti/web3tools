import { ref, onMounted } from 'vue'
import { ethers } from 'ethers'

export function useMetaMask() {
  const isConnected = ref(false)
  const account = ref('')
  let provider = null
  let signer = null

  const connectMetamask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!')
      return { success: false }
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
      const address = await signer.getAddress()
      account.value = address
      isConnected.value = true
      return { success: true, provider, signer, account: address }
    } catch (error) {
      console.error('Connection error:', error)
      alert('Failed to connect to MetaMask')
      return { success: false }
    }
  }

  // Check existing connection
  onMounted(async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      await connectMetamask()
    }
  })

  return {
    isConnected,
    account,
    connectMetamask,
    getProvider: () => provider,
    getSigner: () => signer
  }
}