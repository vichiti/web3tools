<template>
  <v-app>
    <app-header />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'

export default {
  components: { AppHeader }
}
</script>