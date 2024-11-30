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
            return {
                globalColors,
                refresh: 0
            };
        },
        setup() {
            // Creation of a reactive variables => (allows child to change it)
            const userId = ref('');
            const username = ref('');
            const sessionToken = ref('');
            const favourites = ref([]);
            const isAdmin = ref(''); // 0?
            const avatarPath = ref('');


            // Creation of the providers
            provide('userId', userId);
            provide('username', username);
            provide('sessionToken', sessionToken);
            provide('favourites', favourites);
            provide('isAdmin', isAdmin);
            provide('avatarPath', avatarPath);

            const setUserId = (newUserId) => {
                userId.value = newUserId;
            };

            const setUsername = (newUsername) => {
                username.value = newUsername;
            };

            const setSessionToken = (newSessionToken) => {
                sessionToken.value = newSessionToken;
            };

            const setFavourites = (newFavourites) => {
                favourites.value = newFavourites;
            };

            const setIsAdmin = (newIsAdmin) => {
                isAdmin.value = newIsAdmin;
            };

            const setAvatarPath = (newAvatarPath) => {
                avatarPath.value = newAvatarPath;
            };

            const loginUser = async (username, password) => {
                return await axios.post('http://localhost:3000/login', {
                    username,
                    password
                })
                    .then(response => {
                        if (response.status === 203){
                            return { success: false, message: "No such user"}
                        }
                        else if (response.status === 200){
                            setUsername(username);
                            setSessionToken(response.data.sessionToken);
                            localStorage.setItem('sessionToken', response.data.sessionToken);
                            setUserId(response.data.userId);
                            setFavourites(response.data.favourites);
                            setIsAdmin(response.data.isAdmin);
                            setAvatarPath(response.data.avatarPath);
                            console.log(response.data.avatarPath);
                            
                            // alert(`You are now connected.\nYou will be redirected in Home Page\n`);
                            return { success: true, message: ""}
                        } else {
                            throw new Error("Status server error");
                        }
                    }).catch(error => {
                        if (error.status === 401){
                            return { success: false, message: "Invalid username or password"}
                        }
                        else {
                            return { success: false, message: "A server error occured...\nPlease try later"}
                        }
                    });
            }

            provide('setUserId', setUserId);
            provide('setUsername', setUsername);
            provide('setSessionToken', setSessionToken);
            provide('setFavourites', setFavourites);
            provide('setIsAdmin', setIsAdmin);
            provide('loginUser', loginUser);
            provide('setAvatarPath', setAvatarPath);

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
                        console.log('checking user token')
                        console.log(response)
                        if (response && response.data && response.status === 200) {
                            // The session token is still valid
                            this.setSessionToken(sessionToken);
                            this.setUsername(response.data.username);
                            this.setAvatarPath(response.data.avatarPath);
                            console.log('checking user token')

                        }
                    } catch (error) {
                        console.error('There was an error!', error);

                    }
                }
            }
        },
        mounted() {
            console.log("mounted")
            this.checkUser()
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

#app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: v-bind('globalColors.darkColor');
    background-color: v-bind('globalColors.backgroundColor');
    text-align: center;
}

html, body {
    background-color: #f4d4b4;
    padding: 0;
    margin: 0;
}

h1 {
    font-family: 'JapaneseStyleFont', sans-serif;
    font-size: 50px;
}
</style>
