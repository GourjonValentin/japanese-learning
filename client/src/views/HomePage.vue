<template>
    <h1>{{ title }}</h1>
    <h2>Welcome {{ username }}</h2>
    <p> home page</p>
</template>

<script>
    import { inject } from 'vue'; // to access user variable
    import { globalTitle } from '../utils/GlobalVariable';

    export default {
        data() {
            return {
                title: globalTitle
            };
        },
        setup() {
            const username = inject('username');
            return { username };
        }
    };
</script>

<style>
    h1 {
        font-family: 'JapaneseStyleFont', sans-serif;
        font-size: 50px;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
  