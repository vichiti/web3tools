<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <h1>Menu</h1>
        <v-list>
          <v-list-item :to="{ name: 'Home' }" link>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ name: 'CreateToken' }" link>
            <v-list-item-icon>
              <v-icon>mdi-plus-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Create Token</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'MenuPage',
};
</script>