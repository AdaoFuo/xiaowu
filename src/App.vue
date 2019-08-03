<template>
  <div id="app">
    <!-- <img src="./assets/timg.jpg">-->
    <router-view />

  </div>
</template>

<script>

  export default {
    name: 'App',
    data(){
      return{

      }
    },
    methods:{

    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
    /*  margin-top: 60px;*/
  }
  html,body,#app{
    height: 100%;
    width: 100%;
  }
</style>
