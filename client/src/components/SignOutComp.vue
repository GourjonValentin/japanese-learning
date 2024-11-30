<template>
    <div id="sign-out">
        <h2>Want to leave us ?</h2>
        <form @submit.prevent="signout">
            <button class="styledButton-red" type="submit">Sign Out</button>
        </form>
    </div>
</template>

<script>
    import { inject } from 'vue'; // to change user variable and send it to the provider

    export default {
        setup(){
            const resetUser = inject('resetUser');

            return {
                resetUser
            };
        },
        data(){
            return {
                formMessage:""
            };
        },
        methods : {
            async signout(){
                this.resetUser();
                this.$router.push({path :'/'});
            }
        }
    }

</script>