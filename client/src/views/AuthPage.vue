<template>
    <section id="main">
        <SignUpFormComp v-if="this.$route.query.form === 'signup'"/>
        <LogInFormComp v-else-if="this.$route.query.form === 'login'"/>
        <SignOutComp v-else-if="this.$route.query.form === 'signout'"/>
        <RoutingError v-else/>
    </section>
</template>

<script>
    import SignUpFormComp from '../components/SignUpFormComp';
    import LogInFormComp from '../components/LogInFormComp';
    import SignOutComp from '../components/SignOutComp';
    import RoutingError from './RoutingError.vue';


    export default {
        data() {
            return {
                formMessage: ""
            };
        },
        components: {
            SignUpFormComp,
            LogInFormComp,
            SignOutComp,
            RoutingError
        }
    };
</script>

<style>
    #formMessage {
        color: red;
        font-size: small;
    }
</style>