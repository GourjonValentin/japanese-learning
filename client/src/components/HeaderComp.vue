
<template>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/quiz">Quiz</router-link>
        <router-link to="/jisho">Jisho</router-link>
        <div v-if="this.sessionToken">
            <router-link :to="{path :'/auth', query : { form : 'signout'}}">Sign out</router-link>
        </div>
        <div v-else>
            <router-link :to="{path :'/auth', query : { form : 'login'}}">Login</router-link>
            <router-link :to="{ path: '/auth', query: { form: 'signup' } }">Sign up</router-link>
        </div>
    </nav>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';
    import { inject } from 'vue';

    export default {
        setup(){
            const sessionToken = inject('sessionToken');
            return {
                sessionToken
            }
        },
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