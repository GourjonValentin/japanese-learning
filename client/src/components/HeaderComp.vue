<template>
    <div id="header">
        <nav>
            <div class="logo-page-links">
                <div class="navbar-logo">
                    <router-link to="/"><img src="@/assets/logo-website-red-cropped.png" alt="logo"></router-link>
                </div>
                <div :class="['pages-links', {active: isMenuOpen}]">
                    <router-link to="/">Home</router-link>
                    <router-link to="/quiz">Quiz</router-link>
                    <router-link to="/jisho">Jisho</router-link>
                    <router-link to="/alphabet">Alphabet</router-link>
                    <router-link :to="{ path: '/auth', query: { form: 'login/signup' } }" v-if="!sessionToken">Log in</router-link>
                    <router-link to="/profile" v-if="sessionToken && isMenuOpen">My Profile</router-link>
                    <router-link to="/profile#password-settings" v-if="sessionToken && isMenuOpen">Settings</router-link>
                    <router-link to="/admin-settings" v-if="isAdmin && sessionToken && isMenuOpen">Admin settings</router-link>
                    <router-link :to="{path :'/auth', query : { form : 'signout'}}" v-if="sessionToken && isMenuOpen">Sign Out</router-link>
                </div>
            </div>
            <div v-if="sessionToken" id="avatar-dropdown">
                <img 
                    :src="avatarPath"
                    alt="avatar"
                    class="user-avatar"
                    @click="toggleDropdown"
                />
                
                <div v-if="showDropdown" class="dropdown-menu">
                    <router-link to="/settings/profile" class="dropdown-item">My Profile</router-link>
                    <router-link to="/settings/profile#password-settings" class="dropdown-item">Settings</router-link>
                    <router-link to="/settings/admin" class="dropdown-item" v-if="isAdmin">Admin settings</router-link>
                    <router-link :to="{path :'/auth', query : { form : 'signout'}}" class="dropdown-item">Sign Out</router-link>
                </div>
            </div>
            <div v-else class="auth-links">
                <router-link :to="{ path: '/auth', query: { form: 'login/signup' } }">Log in</router-link>
            </div>

            <div :class="['hamburger', {active: isMenuOpen}]" @click="toggleMenu">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </div>
        </nav>
    </div>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';
    import { inject } from 'vue';

    export default {
        setup(){
            const sessionToken = inject('sessionToken');
            const avatarPath = inject('avatarPath');
            const isAdmin = inject('isAdmin');

            return {
                sessionToken,
                avatarPath,
                isAdmin
            }
        },
        data(){
            return {
                globalColors : globalColors,
                showDropdown: false,
                isMenuOpen: false,
            };
        },
        watch: {
            $route() {
                this.isMenuOpen = false;
            }
        },
        methods: {
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            toggleMenu() {
                this.isMenuOpen = !this.isMenuOpen;
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
    padding: 10px 20px;
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
        font-size: 16px;
        text-decoration: none;
        color: v-bind('globalColors.darkColor');
    }

    .logo-page-links {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
    }

    .navbar-logo {
        display: flex;
        width: 60px;
        height: 60px;
    }

    .navbar-logo img {
        width: 60px;
        height: 60px;
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

    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 25px;
        height: 20px;
        cursor: pointer;
        z-index: 1000;
    }

    .hamburger .line {
        display: block;
        height: 3px;
        background-color: v-bind('globalColors.darkColor');
        border-radius: 2px;
        /* -webkit-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out; */
        transition: all 0.3s ease-in-out;
    }

    .hamburger.active .line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active .line:nth-child(2){
        opacity: 0;
    }

    .hamburger.active .line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px)
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
        #header {
            position: sticky;
            top: 0;
            z-index: 999;
        }

        .pages-links {
            display: none;
            flex-direction: column;
            align-items: center;
            background-color: v-bind('globalColors.redColor');
            position: fixed;
            z-index: 1000;
            top: 80px;
            left: 0;
            width: 100vw;
            height: 100vh;
            gap: 75px;
            padding: 10px 20px;
        }

        .pages-links a {
            font-size: 2rem;
            font-weight: bold;
        }

        .pages-links.active {
            display: flex;
        }

        #avatar-dropdown {
            display: none;
        }

        .auth-links {
            display: none;
        }

        .hamburger {
            display: flex;
        }
    }
    
</style>