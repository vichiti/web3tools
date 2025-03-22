<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <h1>Welcome to the Home Page</h1>
        <v-btn color="primary" @click="normalAlert" class="ma-2">Normal Alert</v-btn>
        <v-btn color="primary" outlined @click="loginAlert" :disabled="!isConnected" class="ma-2">
          Login Alert
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  props: {
    isConnected: Boolean,
    account: String,
  },
  methods: {
    normalAlert() {
      alert('This is a normal alert!');
    },
    loginAlert() {
      if (this.isConnected) {
        alert(`You are logged in as ${this.account}!`);
      } else {
        alert('Please login first!');
      }
    },
  },
};
</script>