<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      flat
    >
    <v-spacer />
      <div class="d-flex align-center">
        <img width="150px" src="./assets/logo.png" />
      </div>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <Home/>
    </v-main>
    <v-footer>
      <span class="caption grey--text text--darken-1" style="margin-left:auto;margin-right:auto">
          Made with ❤️ in Appocs Solutions</span>
    </v-footer>
  </v-app>
</template>

<script>
import Home from './components/Home';

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F9F9F9;
}
.v-footer{

  background: #F1F1F1 !important;
}
</style>