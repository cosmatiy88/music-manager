<template>
  <v-app dark>
    <v-app-bar fixed app dark color="primary">
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn small text to="/"> home </v-btn>
      <v-btn small text to="/player"> player </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
        <Snackbar />
      </v-container>
    </v-main>

    <v-footer app class="overline">
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <span class="pl-1">{{ title }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Music Manager',
    }
  },
}
</script>
