<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Hashpack Page</v-card-title>
          <v-card-text>
            <p v-if="account">Connected: {{ account }}</p>
            <v-btn color="primary" @click="simpleAlert" class="mr-4">Simple Alert</v-btn>
            <v-btn color="primary" outlined @click="loggedInAlert" :disabled="!isConnected">
              Logged-In Alert
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HashpackPage',
  props: {
    isConnected: Boolean,
    account: String,
  },
  methods: {
    simpleAlert() {
      alert('This works without login!');
    },
    loggedInAlert() {
      if (this.isConnected) {
        alert('You are logged in! Special alert.');
      } else {
        alert('Please login with MetaMask first.');
      }
    },
  },
};
</script>