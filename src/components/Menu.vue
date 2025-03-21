<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h6">Menu</v-card-title>
          <v-card-text>
            <v-btn to="/" color="primary" block class="mb-4">Home</v-btn>
            <v-btn to="/hashpack" color="primary" block class="mb-4">Hashpack</v-btn>
            <v-btn to="/create-token" color="primary" block>Create Token</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'MenuPage',
};
</script>