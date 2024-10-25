
<template>
    <nav>
        <router-link to="/quiz">Quiz</router-link>
        <router-link to="/jisho">Jisho</router-link>
        <router-link :to="{path :'/auth', query : { form : 'login'}}">Login</router-link>
        <router-link :to="{ path: '/auth', query: { form: 'signin' } }">Sign-In</router-link>
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
        text-decoration: none;
    }
</style>