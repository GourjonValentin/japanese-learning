<template>
    <form @submit.prevent="login">
        <h1>Welcome Back!</h1>
        <input type="text" name="username" v-model="username" placeholder="Username" required />
        <input type="password" name="password" v-model="password" placeholder="Password" required />
        <p id="formMessage">{{ formMessage }}</p>
        <button type="submit">Submit</button>
    </form>
</template>

<script>
    import { inject } from 'vue'; // to change user variable and send it to the provider
    // import axios from 'axios';

    export default {
        setup(){
            const setUsername = inject('setUsername'); // access provider
            const setSessionToken = inject('setSessionToken');
            const setUserId = inject('setUserId');
            const setFavourites = inject('setFavourites');
            const setIsAdmin = inject('setIsAdmin');
            const loginUser = inject('loginUser');

            return {
                setUsername,
                setSessionToken,
                setUserId,
                setFavourites,
                setIsAdmin,
                loginUser
            };
        },
        data(){
            return {
                formMessage:""
            };
        },
        methods : {
            async login() {
                const result = await this.loginUser(this.username, this.password);
                if (result.success) {
                    this.$router.push({path :'/'});
                } else {
                    this.formMessage = result.message;
                }
            }
        }
    }

</script>