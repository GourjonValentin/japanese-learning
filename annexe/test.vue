SAUVEGARDE DE L'ANCIEN LOGIN COMPOSANTS

<template>
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
</template>

<script>
  import { inject } from 'vue'; // to change user variable and send it to the provider
  import axios from 'axios';

  export default {
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
                          this.setUsername("hehe"); // = this.username
                          //this.$emit("current-user", this.user); // trhow user to parent components with the current-user param

                          alert(`You are now connected.\nYou will be redirected in Home Page\nUsername :`);
                          //this.$router.push({path :'/'});
                      } else {
                          throw new Error("Status server error");
                      }
                  }).catch(error => {
                      if (error.status === 403){
                          this.formMessage = "Invalid username or password";
                      }
                      else {
                          this.formMessage = "A server error occured...\nPlease try later";
                      }
                      console.error('There was an error!', error);
                  });
          }
      },
      setup(){

          
          const setUser = inject('setUsername'); // access provider
          const setSessionToken = inject('setSessionToken');
          /* necesseray ?????
          const setCurrentUser = (currentUser) => {
              setUser(currentUser);
          };*/

          return {
              setUser,
              setSessionToken
          };
      }
  }

</script>