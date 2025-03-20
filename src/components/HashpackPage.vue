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
        icon: 'https://via.placeholder.com/150', // Use a placeholder icon
      },
    };
  },
  methods: {
    async connectHashpack() {
      try {
        // Check if Hashpack is available
        if (!window.hashconnect) {
          this.errorMessage = 'Hashpack extension not detected. Please install it.';
          return;
        }

        // Initialize Hashconnect if not already done
        if (!this.hashconnect) {
          this.hashconnect = new HashConnect(true); // Debug mode on
          console.log('Initializing Hashconnect...');
          const initData = await this.hashconnect.init(this.appMetadata, 'testnet');
          console.log('Hashconnect initialized with topic:', initData.topic);
          this.hashconnectTopic = initData.topic;

          // Pairing event listener
          this.hashconnect.pairingEvent.once((pairingData) => {
            if (pairingData?.accountIds?.length > 0) {
              this.accountId = pairingData.accountIds[0];
              this.isConnected = true;
              this.errorMessage = null;
              console.log('Paired with Hashpack, account:', this.accountId);
            } else {
              this.errorMessage = 'No accounts found in pairing data.';
            }
          });

          // Connection status listener
          this.hashconnect.connectionStatusChangeEvent.on((status) => {
            console.log('Connection status changed:', status);
            this.isConnected = status === 'Connected';
            if (!this.isConnected) {
              this.accountId = null;
              this.errorMessage = 'Disconnected from Hashpack.';
            }
          });
        }

        // Attempt to connect
        console.log('Attempting to connect to Hashpack...');
        await this.hashconnect.connect(this.hashconnectTopic);
        const pairingString = this.hashconnect.generatePairingString({
          topic: this.hashconnectTopic,
          network: 'testnet',
        });
        console.log('Pairing String:', pairingString);

        // Trigger wallet detection
        this.hashconnect.findLocalWallets();
      } catch (error) {
        console.error('Hashconnect error:', error);
        if (error.message?.includes('No wallet found')) {
          this.errorMessage = 'Hashpack is not installed or not responding.';
        } else if (error.message?.includes('User rejected')) {
          this.errorMessage = 'User rejected the pairing request.';
        } else if (error.message?.includes('undefined')) {
          this.errorMessage = 'Hashconnect failed to initialize properly. Check console for details.';
        } else {
          this.errorMessage = 'An unexpected error occurred: ' + error.message;
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
    // Check for existing connection
    if (this.hashconnect?.hcData?.accountIds?.length > 0) {
      this.isConnected = true;
      this.accountId = this.hashconnect.hcData.accountIds[0];
      console.log('Existing connection found:', this.accountId);
    }
  },
  beforeUnmount() {
    // Cleanup event listeners
    if (this.hashconnect) {
      this.hashconnect.pairingEvent.off();
      this.hashconnect.connectionStatusChangeEvent.off();
      console.log('Cleaned up Hashconnect listeners');
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