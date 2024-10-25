<template>
    <h1>Welcome to {{ title }}</h1>
    <p> home page</p>
</template>
  
<script>
    import { globalTitle } from '../utils/GlobalVariable';

    export default {
        data() {
            return {
                title: globalTitle
            };
        }
    };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
  