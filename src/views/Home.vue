<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="display-5 font-weight-bold mb-3">Welcome to Hedera DApp</h1>
        <p class="text-h6">Explore our smart contract features on the Hedera Testnet</p>
        <v-btn color="primary" to="/smart-contract">Go to Smart Contract</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
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
</style>