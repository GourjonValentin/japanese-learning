<template>
    <div id="app" class="s">
        <HeaderComp/>
        <router-view/>
    </div>
</template>

<script>
    import { ref , provide } from 'vue';

    import HeaderComp from './components/HeaderComp.vue';

    export default {
        name: 'App',
        components: {
            HeaderComp : HeaderComp
        },
        setup() {
            // Creation of a reactive variables => (allows child to change it)
            const username = ref('');
            const sessionToken = ref('');

            // Creation of the providers
            provide('username', username);
            provide('sessionToken', sessionToken);

            provide('setUsername', (newUsername) => {
                username.value = newUsername;
            });
            provide('setSessionToken', (newSessionToken) => {
                sessionToken.value = newSessionToken;
            });

            const resetUser = () => {
                username.value = '';
                sessionToken.value = '';
            };
            
            provide('resetUser', resetUser);
            // return necessary ????
        }
    }
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
