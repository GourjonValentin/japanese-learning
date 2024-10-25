<template>
    <section id="main">
        <FormComp/>
        <div id="login">
            <h2>Login</h2>
            <form @submit.prevent="login">
                <label>Username : </label>
                <input type="text" name="username" v-model="username" required="true"/><br/>
                <label>Password : </label>
                <input type="password" name="password" v-model="password" required="true"/><br/>
                <button type="submit">Submit</button>
            </form>
            <p id="formMessage">{{ formMessage }}</p>
        </div>
        <div id="signin">
            <h2>FARES A TOI DE JOUER</h2>
        </div>
    </section>
</template>

<script>

    import axios from 'axios';
    import SignInFormComp from '../components/SignInFormComp';
    import LogInFormComp from '../components/LogInFormComp';
    import RoutingError from './RoutingError.vue';

    const formType = 'sdsd';
    //const formType = this.$route.query.form;
    var formComp = "";

    if (formType === 'login'){
        formComp = LogInFormComp;
        // le form signin doit etre display:none
    }else if (formType === 'signin'){
        // le form login doit etre display:none
        formComp = SignInFormComp;
    } else {
        formComp = RoutingError;
    }

    export default {
        data() {
            return {
                formMessage: "",
                formComp: formComp
            };
        },
        components: {
            FormComp : formComp
        },
        methods : {
            async login() {
                await axios.post('http://localhost:3000/login', { username : this.username, password : this.password})
                    .then(response => {
                        this.sessionToken = response.data.sessionToken;
                        if (response.status === 403){
                            this.formMessage = "Invalid username or password";
                        }
                        else if (response.status === 203){
                            this.formMessage = "No such user";
                        }
                        else {
                            this.$router.push({path :'/content', query : { username : this.username}});
                        }
                    }).catch(error => {
                        console.error('There was an error!', error);
                    });
            }
        }
    };
</script>

<style>
    #formMessage {
        color: red;
        font-size: small;
    }
</style>