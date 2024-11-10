<template>
    <form @submit.prevent="signup">
        <h1>Create Account</h1>
        <input type="text" v-model="signupName" placeholder="Name" required />
        <input type="email" v-model="signupEmail" placeholder="Email" required />
        <input type="password" v-model="signupPassword" placeholder="Password" required />
        <button type="submit">Sign Up</button>
    </form>
</template>

<script>
    // import { inject } from 'vue'; // to change user variable and send it to the provider
    // import axios from 'axios';

    export default {
        data() {
            return {
                signupName: '',
                signupEmail: '',
                signupPassword: '',
            }
        },
        methods: {
            signup() {
                // Handle sign-up logic here, e.g., API call
                console.log('Sign-up data:', this.signupName, this.signupEmail, this.signupPassword);
            }
        }
    }
</script>