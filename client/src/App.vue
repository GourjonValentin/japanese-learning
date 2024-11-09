<template>
    <div id="app" class="s">
        <HeaderComp/>
        <router-view/>
    </div>
</template>

<script>
import {ref, provide, watch} from 'vue';
    import { globalColors } from './utils/GlobalVariable';

    import HeaderComp from './components/HeaderComp.vue';
    import axios from "axios";

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
            const userId = ref('');
            const username = ref('');
            const sessionToken = ref('');
            const favourites = ref([]);
            const isAdmin = ref(''); // 0?


            // Creation of the providers
            provide('userId', userId);
            provide('username', username);
            provide('sessionToken', sessionToken);
            provide('favourites', favourites);
            provide('isAdmin', isAdmin);

            const setUsername = (newUsername) => {
                username.value = newUsername;
            };
            const setUserId = (newUserId) => {
                userId.value = newUserId;
            };

            const setSessionToken = (newSessionToken) => {
                sessionToken.value = newSessionToken;
            };

            provide('setUserId', setUserId);
            provide('setUsername', setUsername);
            provide('setSessionToken', setSessionToken);
            provide('setFavourites', (newFavourites) => {
                favourites.value = newFavourites;
            });
            provide('setIsAdmin', (newIsAdmin) => {
                isAdmin.value = newIsAdmin;
            });
            const resetUser = () => {
                userId.value = '';
                username.value = '';
                sessionToken.value = '';
                favourites.value = [];
                isAdmin.value = ''; // 0 ?
            };
            provide('resetUser', resetUser);


            watch(sessionToken, (newSessionToken) => {
                if (newSessionToken) {
                    localStorage.setItem('sessionToken', newSessionToken);
                    console.log("newSessionToken changed to", newSessionToken);

                } else {
                    localStorage.removeItem('sessionToken');
                }
            });

            watch(favourites, (newFavourites) => {
                if (newFavourites) {
                    console.log("newFavourites changed to", newFavourites);
                }
            }, {deep: true});


            // return necessary ????
            return {
                setSessionToken,
                setUsername
            }
        },
        methods: {
            async checkUser() {
                const sessionToken = localStorage.getItem('sessionToken');
                if (sessionToken) {
                    // Check if the session token is still valid
                    try {
                        const response = await axios.post('http://localhost:3000/auth/check', {
                            sessionToken: sessionToken
                        }).catch(error => {
                            if (error.status === 401) {
                                console.log('Invalid token');
                            }
                        });
                        if (response && response.data && response.data.message === 'Valid token') {
                            // The session token is still valid
                            this.setSessionToken(sessionToken);
                            this.setUsername(response.data.username);
                        }
                    } catch (error) {
                        console.error('There was an error!', error);

                    }
                }
            }
        },
        mounted() {
            this.checkUser()
        }
    }
</script>

<style>
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
