
<template>
    <div id="header">
        <nav>
            <div class="pages-links">
                <router-link to="/">Home</router-link>
                <router-link to="/quiz">Quiz</router-link>
                <router-link to="/jisho">Jisho</router-link>
                <router-link to="/alphabet">Alphabet</router-link>
            </div>
            <div v-if="sessionToken" id="avatar-dropdown">
                <img :src="avatarPath"
                alt="avatar"
                class="user-avatar"
                @click="toggleDropdown"/>
                
                <div v-if="showDropdown" class="dropdown-menu">
                    <router-link to="/profile" class="dropdown-item">My Profile</router-link>
                    <router-link to="/profile#confidentialty-settings" class="dropdown-item">Settings</router-link>
                    <router-link :to="{path :'/auth', query : { form : 'signout'}}" class="dropdown-item">Sign Out</router-link>
                </div>
            </div>
            <div v-else class="auth-links">
                <router-link :to="{ path: '/auth', query: { form: 'login/signup' } }">Log in</router-link>
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
            const avatarPath = inject('avatarPath');
            return {
                sessionToken,
                avatarPath,
            }
        },
        data(){
            return {
                globalColors : globalColors,
                showDropdown: false,
            }
        },
        methods: {
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            handleOutsideClick(event) {
                if (!this.$el.contains(event.target)) {
                this.showDropdown = false;
                }
            },
        },
        mounted() {
            document.addEventListener('click', this.handleOutsideClick);
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleOutsideClick);
        }
    }
</script>

<style scoped>
    #header {
    background-color: v-bind('globalColors.redColor');
    padding: 20px 0;
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
        text-decoration: none;
        color: v-bind('globalColors.darkColor');
    }

    .pages-links {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 50px;
        gap: 40px;
    }

    .pages-links a:hover, .auth-links a:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    #avatar-dropdown {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 50px;
    }

    .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
    }

    .dropdown-menu {
        position: absolute;
        right: -15px;
        background-color: #ffffff;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        z-index: 1000;
    }

    .dropdown-item {
        padding: 10px 15px;
        font-size: 14px;
        color: #333;
        text-decoration: none;
        display: block;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background-color: #f5f5f5;
    }
</style>