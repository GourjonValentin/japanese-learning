<template>
    <div id="app" class="s">
        <div v-if="this.isLoaded">
            <HeaderComp/>
            <router-view/>
        </div>
        <div v-else>
            Loading
            <div class="loading">
                <img src="@/assets/chop-spedup.gif" alt="Loading ..." width="200" height="150">
            </div>
        </div>
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
                refresh: 0,
                isLoaded: false
            };
        },
        setup() {
            let userId = ref('');
            let username = ref('');
            let sessionToken = ref('');
            let favorites = ref([]);
            let isAdmin = ref('');
            let avatarPath = ref('');

            provide('userId', userId);
            provide('username', username);
            provide('sessionToken', sessionToken);
            provide('favorites', favorites);
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

            const setFavorites = (newFavorites) => {
                favorites.value = newFavorites;
            };

            const setIsAdmin = (newIsAdmin) => {
                isAdmin.value = newIsAdmin;
            };

            const setAvatarPath = (newAvatarPath) => {
                avatarPath.value = newAvatarPath;
            };

            const loginUser = async (username, password) => {
                return await axios.post('http://localhost:3000/auth/login', {
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
                            setFavorites(response.data.favorites);
                            setIsAdmin(response.data.isAdmin);
                            setAvatarPath(response.data.avatarPath);
                            return { success: true, message: ""};
                        } else {
                            throw new Error("Status server error");
                        }
                    }).catch(error => {
                        if (error.status === 401){
                            return { success: false, message: "Invalid username or password"};
                        }
                        else {
                            return { success: false, message: "A server error occured...\nPlease try later"};
                        }
                    });
            }
            provide('setUserId', setUserId);
            provide('setUsername', setUsername);
            provide('setSessionToken', setSessionToken);
            provide('setFavorites', setFavorites);
            provide('setIsAdmin', setIsAdmin);
            provide('setAvatarPath', setAvatarPath);
            provide('loginUser', loginUser);
            const resetUser = () => {
                userId.value = '';
                username.value = '';
                sessionToken.value = '';
                favorites.value = [];
                isAdmin.value = '';
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
            watch(favorites, (newFavorites) => {
                if (newFavorites) {
                    console.log("newFavorites changed to", newFavorites);
                }
            }, {deep: true});
            watch(avatarPath, (newAvatar) => {
                if (newAvatar) {
                    console.log("avatarPath changed to", newAvatar);
                }
            });
            return {
                setSessionToken,
                setUsername,
                setFavorites,
                setAvatarPath,
                setIsAdmin,
                setUserId,
                avatarPath
            };
        },
        methods: {
            async checkUser() {
                const sessionToken = localStorage.getItem('sessionToken');
                if (sessionToken) {
                    try {
                        const response = await axios.get('http://localhost:3000/auth/check', {
                            headers : {'Authorization' : `Bearer ${sessionToken}`}
                        }).catch(error => {
                            if (error.status === 401) {
                                console.error('Invalid token');
                            }
                        });
                        if (response && response.data && response.status === 200) {
                            this.setSessionToken(sessionToken);
                            this.setUsername(response.data.data.username);
                            this.setAvatarPath(response.data.data.avatarPath);
                            this.setUserId(response.data.data.id);
                            this.setFavorites(response.data.data.favorites);
                            this.setIsAdmin(response.data.data.isAdmin)
                        }
                    } catch (error) {
                        console.error('There was an error!', error);
                    }
                }
            }
        },
        async mounted() {
            await this.checkUser();
            this.isLoaded = true;
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
