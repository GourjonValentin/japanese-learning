<template>
    <form @submit.prevent="login">
        <h1>Welcome Back!</h1>
        <label>Username : </label>
        <input type="text" name="username" v-model="username" required="true"/><br/>
        <label>Password : </label>
        <input type="password" name="password" v-model="password" required="true"/><br/>
        <button type="submit">Submit</button>
    </form>
    <p id="formMessage">{{ formMessage }}</p>
</template>

<script>
    import { inject } from 'vue'; // to change user variable and send it to the provider
    import axios from 'axios';

    export default {
        setup(){
            const setUsername = inject('setUsername'); // access provider
            const setSessionToken = inject('setSessionToken');
            const setUserId = inject('setUserId');
            const setFavourites = inject('setFavourites');

            return {
                setUsername,
                setSessionToken,
                setUserId,
                setFavourites
            };
        },
        data(){
            return {
                formMessage:""
            };
        },
        methods : {
            async login() {
                await axios.post('http://localhost:3000/login', { username : this.username, password : this.password})
                    .then(response => {
                        if (response.status === 203){
                            this.formMessage = "No such user";
                        }
                        else if (response.status === 200){
                            this.setSessionToken(response.data.sessionToken);
                            localStorage.setItem('sessionToken', response.data.sessionToken);
                            this.setUsername(this.username); // = this.username
                            this.setUserId(response.data.userId);
                            this.setFavourites(response.data.favourites);
                            alert(`You are now connected.\nYou will be redirected in Home Page\n`);
                            this.$router.push({path :'/'});
                        } else {
                            throw new Error("Status server error");
                        }
                    }).catch(error => {
                        if (error.status === 401){
                            this.formMessage = "Invalid username or password";
                        }
                        else {
                            this.formMessage = "A server error occured...\nPlease try later";
                        }
                        console.error('There was an error!', error);
                    });
            }
        }
    }

</script>