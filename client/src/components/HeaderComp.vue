
<template>
    <div id="header">
        <nav>
            <div class="pages-links">
                <router-link to="/">Home</router-link>
                <router-link to="/quiz">Quiz</router-link>
                <router-link to="/jisho">Jisho</router-link>
                <router-link to="/alphabet">Alphabet</router-link>
            </div>
            <div v-if="sessionToken" class="auth-links">
                <router-link :to="{path :'/auth', query : { form : 'signout'}}">Sign out</router-link>
            </div>
            <div v-else class="auth-links">
                <!-- <router-link :to="{path :'/auth', query : { form : 'login'}}">Login</router-link>
                <router-link :to="{ path: '/auth', query: { form: 'signup' } }">Sign up</router-link> -->
                <router-link :to="{ path: '/auth', query: { form: 'login/signup' } }">Log in/Sign up</router-link>
            </div>
        </nav>
    </div>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';
    import {inject} from 'vue';

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

<style scoped>
    #header {
    background-color: v-bind('globalColors.redColor');
    padding-top: 30px;
    padding-bottom: 30px;
    margin-top: 0px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border-bottom: solid 5px;
    border-bottom-color: v-bind('globalColors.darkColor')
    }

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }

    nav a {
        padding: 20px;
        text-decoration: none;
        color: v-bind('globalColors.darkColor');
    }

    nav a:hover {
        cursor: pointer;
    }

</style>