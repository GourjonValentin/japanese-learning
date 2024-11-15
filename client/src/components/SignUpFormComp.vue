<template>
    <form @submit.prevent="signup">
        <h1>Create Account</h1>
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <input type="password" v-model="confirmPassword" placeholder="Confirm password" required />
        <p v-if="signUpMessage" style="white-space: pre-wrap;">{{ signUpMessage }}</p>
        <button type="submit">Sign Up</button>
    </form>
</template>

<script>
    import { inject } from 'vue';
    import axios from 'axios';

    export default {
        setup() {
            const loginUser = inject('loginUser');
            return {
                loginUser
            }
        },
        data() {
            return {
                username: '',
                password: '',
                confirmPassword: '',
                signUpMessage: '',
            }
        },
        methods: {
            async signup() {
                if (this.password !== this.confirmPassword) {
                    this.signUpMessage = "Passwords do not match.";
                    return;
                }

                try {
                    const response = await axios.post('http://localhost:3000/signup', {
                        username: this.username,
                        password: this.password
                    });
                    this.signUpMessage = response.data.message;

                    // Login after succesful signup
                    const result = await this.loginUser(this.username, this.password);
                    if (result.success) {
                        this.$router.push({path :'/'});
                    } else {
                        this.signUpMessage = result.message;
                    }
                } catch (error) {
                    if (error.response) {
                        if (Array.isArray(error.response.data.message)) {
                            this.signUpMessage = error.response.data.message.join('\n');
                        } else {
                            this.signUpMessage = error.response.data.message;
                        }
                    }
                    else {
                        this.signUpMessage = 'An error occurred during signup.';
                    }
                }
            },
        },
    };
</script>