
<template>
    <nav>
        <router-link to="/quiz">Quiz</router-link>
        <router-link to="/jisho">Jisho</router-link>
        <router-link to="/auth">Login</router-link>
        <router-link to="/auth">Sign-In</router-link>
    </nav>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';

    console.log(globalColors);
    export default {
        data(){
            return {globalColors : globalColors}
        }
    }
</script>

<style>
    nav {
       background-color: v-bind('globalColors.brown');
    }
    nav a {
        padding: 20px;
        color: blue;
        text-decoration: none;
    }
</style>