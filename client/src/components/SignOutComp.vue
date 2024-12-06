<template>
    <div id="sign-out">
        <h1>Want to leave us ?</h1>
        <form @submit.prevent="signout">
            <button class="styledButton-red" type="submit">Sign Out</button>
        </form>
    </div>
</template>

<script>
import { inject } from "vue";

export default {
    setup() {
        const resetUser = inject("resetUser");

        return {
            resetUser,
        };
    },
    data() {
        return {
            formMessage: "",
        };
    },
    methods: {
        async signout() {
            this.resetUser();
            this.$router.push({ path: "/" });
        },
    },
};
</script>

<style>
#sign-out {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
    #sign-out h1 {
        font-size: 1.4rem;
    }
}
</style>