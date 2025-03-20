<template>
  <div class="hashpack-page">
    <h1>Hashpack Authentication Page</h1>
    <button @click="connectHashpack" :disabled="isConnected">
      {{ isConnected ? 'Connected to Hashpack' : 'Login with Hashpack' }}
    </button>
    <p v-if="accountId">Connected Account: {{ accountId }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="button-group">
      <button @click="simpleAlert">Simple Alert</button>
      <button @click="loggedInAlert">Logged-In Alert</button>
    </div>
  </div>
</template>

<script>
import { HashConnect } from 'hashconnect';

export default {
  name: 'HashpackPage',
  data() {
    return {
      hashconnect: null,
      isConnected: false,
      accountId: null,
      errorMessage: null,
      appMetadata: {
        name: 'My Vue App',
        description: 'A Vue 3 app with Hashpack integration',
        icon: 'https://example.com/icon.png', // Replace with your app icon URL
      },
    };
  },
  methods: {
    async connectHashpack() {
      try {
        // Initialize Hashconnect if not already done
        if (!this.hashconnect) {
          this.hashconnect = new HashConnect(true); // Debug mode on
          const initData = await this.hashconnect.init(this.appMetadata, 'testnet');
          this.hashconnectTopic = initData.topic;

          // Pairing event listener
          this.hashconnect.pairingEvent.once((pairingData) => {
            this.accountId = pairingData.accountIds[0];
            this.isConnected = true;
            this.errorMessage = null;
            console.log('Connected to Hashpack with account:', this.accountId);
          });

          // Connection status listener
          this.hashconnect.connectionStatusChangeEvent.on((status) => {
            this.isConnected = status === 'Connected';
            if (!this.isConnected) {
              this.accountId = null;
              this.errorMessage = 'Disconnected from Hashpack.';
            }
          });
        }

        // Open pairing modal or connect
        await this.hashconnect.connect();
        const pairingString = this.hashconnect.generatePairingString({
          topic: this.hashconnectTopic,
          network: 'testnet',
        });
        console.log('Pairing String (for manual pairing):', pairingString);
        this.hashconnect.findLocalWallets(); // Trigger Hashpack detection
      } catch (error) {
        // Handle common errors
        if (error.message.includes('No wallet found')) {
          this.errorMessage = 'Hashpack is not installed. Please install it.';
        } else if (error.message.includes('User rejected')) {
          this.errorMessage = 'User rejected the pairing request.';
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
        alert('You are logged in with Hashpack! This is a special alert.');
      } else {
        alert('Please login with Hashpack first.');
      }
    },
  },
  mounted() {
    // Check if already paired on page load
    if (this.hashconnect && this.hashconnect.hcData.accountIds?.length > 0) {
      this.isConnected = true;
      this.accountId = this.hashconnect.hcData.accountIds[0];
    }
  },
  beforeUnmount() {
    // Cleanup event listeners
    if (this.hashconnect) {
      this.hashconnect.pairingEvent.off();
      this.hashconnect.connectionStatusChangeEvent.off();
    }
  },
};
</script>

<style scoped>
.hashpack-page {
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