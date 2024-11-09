<template>
    <div id="app" class="s">
        <HeaderComp/>
        <router-view/>
    </div>
</template>

<script>
    import { ref , provide } from 'vue';
    import { globalColors } from './utils/GlobalVariable';

    import HeaderComp from './components/HeaderComp.vue';

    export default {
        name: 'App',
        components: {
            HeaderComp : HeaderComp
        },
        data(){
            return { globalColors };
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
@font-face {
    font-family: 'JapaneseStyleFont';
    src: url('@/assets/fonts/JapaneseFontStyle.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

html, body, #app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: v-bind(globalColors.darkColor);
    background-color: v-bind(globalColors.backgroundColor);
}

</style>
