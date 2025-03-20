<template>
  <div class="home">
    <h1>Welcome to My Vue App</h1>
    <button @click="connectMetaMask" :disabled="isConnected">
      {{ isConnected ? 'Connected to MetaMask' : 'Login with MetaMask' }}
    </button>
    <p v-if="account">Connected Account: {{ account }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="button-group">
      <button @click="simpleAlert">Simple Alert</button>
      <button @click="loggedInAlert">Logged-In Alert</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      isConnected: false,
      account: null,
      errorMessage: null,
    };
  },
  methods: {
    async connectMetaMask() {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        this.errorMessage = 'MetaMask is not installed. Please install it to proceed.';
        return;
      }

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.isConnected = true;
        this.errorMessage = null;
        console.log('Connected to MetaMask with account:', this.account);
      } catch (error) {
        // Handle common errors
        if (error.code === 4001) {
          this.errorMessage = 'User rejected the connection request.';
        } else if (error.code === -32002) {
          this.errorMessage = 'MetaMask request already pending. Check your MetaMask extension.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          console.error(error);
        }
      }
    },
    simpleAlert() {
      alert('This is a simple alert!');
    },
    loggedInAlert() {
      if (this.isConnected) {
        alert('You are logged in! This is a special alert.');
      } else {
        alert('Please login with MetaMask first.');
      }
    },
  },
  mounted() {
    // Check if already connected on page load
    if (window.ethereum && window.ethereum.selectedAddress) {
      this.isConnected = true;
      this.account = window.ethereum.selectedAddress;
    }
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}
.button-group {
  margin-top: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>