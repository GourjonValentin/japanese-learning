<template>
    <form @submit.prevent="login">
        <h1>Welcome Back!</h1>
        <input
            type="text"
            name="username"
            v-model="username"
            placeholder="Username"
            required
        />
        <input
            type="password"
            name="password"
            v-model="password"
            placeholder="Password"
            required
        />
        <p v-if="formMessage" id="formMessage">{{ formMessage }}</p>
        <button type="submit">Log In</button>
    </form>
</template>

<script>
import { inject } from "vue";

export default {
    setup() {
        const setUsername = inject("setUsername");
        const setSessionToken = inject("setSessionToken");
        const setUserId = inject("setUserId");
        const setFavorites = inject("setFavorites");
        const setIsAdmin = inject("setIsAdmin");
        const loginUser = inject("loginUser");

        return {
            setUsername,
            setSessionToken,
            setUserId,
            setFavorites,
            setIsAdmin,
            loginUser,
        };
    },
    data() {
        return {
            formMessage: "",
        };
    },
    methods: {
        async login() {
            const result = await this.loginUser(this.username, this.password);
            if (result.success) {
                if (this.$route.query.redirect) {
                    this.$router.push({ path: this.$route.query.redirect });
                } else {
                    this.$router.push({ path: "/" });
                }
            } else {
                this.formMessage = result.message;
            }
        },
    },
};
</script>
