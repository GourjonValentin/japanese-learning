<template>
    <div class="admin">
        <div class="nav-bar">
            <ul>
                <li><a href="#user-admin">User administration</a></li>
                <li><a href="#quiz-admin">Quiz administration</a></li>
            </ul>
        </div>
        <div class="dialog-overlay" id="alertDialog" v-if="isAlert">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ alert.title }}</h2>
                </div>
                <div class="dialog-body">
                    <p v-html="alert.body"></p>
                    <form @submit.prevent="() => {isAlert = false}">
                        <button class="styledButton-red" type="submit">Ok</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="dialog-overlay" id="confirmationDialog" v-if="isConfirmation">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ confirmation.title }}</h2>
                </div>
                <div class="dialog-body">
                    <p>{{ confirmation.body }}</p>
                    <div class="confirmation-div-button">
                        <button class="styledButton-brown-minor" @click="() => {confirmation.result = false; isConfirmation = false;}">Cancel</button>
                        <button class="styledButton-red" @click="() => {confirmation.result = true; isConfirmation = false;}">Ok</button>
                    </div>

                </div>
            </div>
        </div>
        <div class="admin-content">
            <div id="user-admin">
                <div class="admin-title">
                    <h2>Users Administration</h2>
                </div>
                <div class="users">
                    <div class="styledDiv-pretty" v-for="user in users" :key="user.id">
                        <div class="quiz-header">
                            <div @click="deleteUser(user)" class="delete">
                                <img class="logo" src="@/assets/delete.webp" />
                            </div>
                        </div>
                        <h3> {{ user.username }} </h3>
                        <button class="styledButton" v-if="user.isAdmin" @click="toggleAdmin(user)">Remove Admin</button>
                        <button class="styledButton" v-else @click="toggleAdmin(user)">Make Admin</button>


                    </div>

                </div>
            </div>
            <div id="quiz-admin">
                <div class="admin-title">
                    <h2>Quizzes Administration</h2>
                </div>
                <div class="search styledDiv-pretty">
                    <form class="search-form" @submit.prevent="handleSearchSubmit()">
                        <img src="../assets/search_logo.png" alt="search_logo.png"/>
                        <input class="styledInput" type="text" name="searchName" v-model="searchName" placeholder="search"/>
                        <button  class="styledButton" style="
                         padding: 8px 20px; font-size: 13px;"
                                 type="submit">Search</button>
                    </form>
                    <div>
                        <div class="filter" @click="toggleQuizFilterType('simple')"
                             :class="{active: this.searchFilterType === 'simple'}"
                        >
                            Simple Quiz
                        </div>
                        <div class="filter" @click="toggleQuizFilterType('anime')"
                             :class="{active: this.searchFilterType === 'anime'}"
                        >
                            Anime Quiz
                        </div>
                        <div>
                            <select class="styledSelectInput" v-model="searchFilterDifficulty">
                                <option >all</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="quizzes">
                    <div class="styledDiv-pretty" v-for="quiz in quizzes" :key="quiz.id">
                        <div class="quiz-header" v-if="this.userId !== '' || this.sessionToken !== ''">
                            <div class="favourites" >
                                <img class="logo" src="@/assets/heart-unfilled.png"/>
                            </div>
                            <div class="edit" @click="editQuiz(quiz.id)">
                                <img class="logo" src="@/assets/pencil-icon-colored.png" />
                            </div>
                            <div @click="deleteQuiz(quiz)" class="delete">
                                <img class="logo" src="@/assets/delete.webp" />
                            </div>
                        </div>

                        <h3>{{ quiz.name }}</h3>
                        <button class="styledButton" @click="startQuiz(quiz)">Start Quiz</button>
                        <div class="quizz-caption">
                            <p>Difficulty : </p>
                            <div v-for="i in quiz.difficultylevel" :key="i">
                                <img src="@/assets/torii.png"/>
                            </div>
                        </div>
                        <p>Owner : {{ quiz.ownername }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router';
import {inject} from 'vue'; // to access user variable
import {globalColors} from '../utils/GlobalVariable';
import axios from 'axios';

export default {
    setup() {
        const username = inject('username');
        const avatarPath = inject('avatarPath');
        const userId = inject('userId');
        const favourites = inject('favourites');
        const sessionToken = inject('sessionToken');
        const setFavourites = inject('setFavourites');
        const isAdmin = inject('isAdmin');
        const setIsAdmin = inject('setIsAdmin');
        return {
            username,
            avatarPath,
            userId,
            favourites,
            sessionToken,
            setFavourites,
            isAdmin,
            setIsAdmin
        };
    },
    data() {
        return {
            globalColors: globalColors,
            currentPassword: '',
            password: '',
            confirmPassword: '',
            updatePasswordMessage: '',
            quizzes: [],
            newUsername: '',
            updateUsernameMessage: '',
            isEditingUsername: false,
            searchFilterType: '',
            searchFilterDifficulty: "all",
            users: [],
            isAlert: false,
            alert : {
                title: '',
                body: ''
            },
            isConfirmation: false,
            confirmation: {
                body: '',
                title: '',
                result: null
            },
        }
    },
    mounted() {
        this.getAllquizzes();
        this.getAllUsers()
    },
    methods: {
        async getAllUsers() {
            const res = await axios.get("http://localhost:3000/users", {
                headers: {'Authorization': `Bearer ${this.sessionToken}`}
            });
            if (res.status === 200) {
                this.users = res.data;
            }

        },
        async updatePassword() {
            if (this.password !== this.confirmPassword) {
                this.updatePasswordMessage = "Passwords do not match.";
                return;
            }

            try {
                const response = await axios.post('http://localhost:3000/change-password', {
                    userId: this.userId,
                    currentPassword: this.currentPassword,
                    newPassword: this.password,
                });

                if (response.status === 200) {
                    this.updatePasswordMessage = response.data.message;
                }
            } catch (error) {
                if (error.response) {
                    if (Array.isArray(error.response.data.message)) {
                        this.updatePasswordMessage = error.response.data.message.join('\n');
                    } else {
                        this.updatePasswordMessage = error.response.data.message;
                    }
                } else {
                    this.updatePasswordMessage = 'An error occurred during signup.';
                }
            }
        },
        async getAllquizzes() {
            try {
                const res = await axios.get('http://localhost:3000/quizzes');
                if (res.status === 200 || res.status === 304){
                    this.quizzes = res.data; // ???
                }
            } catch (err) {
                console.log("erre", err)
                if (err.response === undefined){
                    if(err.code === "ERR_NETWORK"){
                        this.quizzesMessage = "Oops... The server is currently unavailable...";
                    } else {
                        this.quizzesMessage = "Oops... An error occured...";
                    }
                }
                else if (err.response.status === 404){
                    this.quizzesMessage = "Oops... The quizzes could not be reached... ";
                } else if ( err.response.status === 500){
                    this.quizzesMessage = "Oops... The server couldn't respond to the request...";
                } else {
                    this.quizzesMessage = "Oops... The quizzes could not be loaded... ";
                }
            }

        },
        async startQuiz(quiz) {
            router.push({path: '/quiz', query: {quizId: quiz.id}});
        },
        editQuiz(quizId) {
            this.$router.push({path: '/edit', query: {quizId: quizId}});
        },
        toggleUsernameEdit() {
            this.isEditingUsername = !this.isEditingUsername;
            if (this.isEditingUsername) {
                this.newUsername = this.username;
            }
        },
        async handleSearchSubmit(){
            await axios.get('http://localhost:3000/quizzes',
                { params : {
                        difficulty : this.searchFilterDifficulty,
                        type: (this.searchFilterType === '' ? null : this.searchFilterType),
                        favourites : JSON.stringify(this.searchFilterFavourites) ? this.favourites : [],
                        name: this.searchName
                    }}
            )
                .then( res => {
                    if (res.status === 200){
                        this.quizzes = res.data;
                        this.quizzesMessage = "";
                    }
                })
                .catch((err) => {
                    if(err.status === 404){
                        this.quizzesMessage = "No quizzes found...";
                        this.quizzes = [];
                    }
                    console.log("err",err);
                })
        },
        toggleQuizFilterType(type){
            if (this.searchFilterType === ""){
                this.searchFilterType = type;
            } else if (this.searchFilterType == type){
                this.searchFilterType = "";
            } else {
                this.searchFilterType = type;
            }
        },
        async deleteQuiz(quiz){
            if (confirm(`You are about to delete the quiz *${quiz.name}*...\nAre you sure you want to continue ?`)){
                try {
                    let res = await axios.delete('http://localhost:3000/delete-quiz',{
                        params : {'quizId' : quiz.id},
                        headers: {'Authorization': `Bearer ${this.sessionToken}`}
                    });
                    if (res.status === 200){
                        this.quizzes = res.data;
                    } else {
                        alert(`Sorry the quiz ${quiz.name} couldn't be removed`);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                return;
            }
        },
        async toggleAdmin(user) {
            try {
                if (user.id === this.userId) {
                    let adminCount = this.users.reduce((total, x) => (total + x.isAdmin));
                    if (adminCount === 1) {
                        this.confirmation.title = "Last Admin";
                        this.confirmation.body = "You are the last admin, there will be no admin left after this. Do you still want to proceed ?";
                        this.isConfirmation = 1;
                    }
                }
                await axios.post('http://localhost:3000/toggle-admin', {
                    user: user,
                }, {
                    headers: {'Authorization': `Bearer ${this.sessionToken}`}
                });
                this.setIsAdmin(this.isAdmin ? 0 : 1);
                this.getAllUsers()
            } catch (err) {
                if (err.status === 400) {
                    console.error('Invalid user format');
                } else if (err.status === 401) {
                    console.error('Invalid Token');
                } else if (err.status === 403) {
                    console.error('Access Forbidden, must be admin to access');
                    this.$router.push({path: '/auth', query: {form: 'login/signup'}});
                } else if (err.status === 404) {
                    console.log('No result found for given user');
                }
            }
        },
        async deleteUser(user) {
            try {
                await axios.delete('http://localhost:3000/users/delete', {
                    headers: {'Authorization': `Bearer ${this.sessionToken}`},
                    params: {'user': user}
                });
                this.getAllUsers();
            } catch (err) {
                if (err.status === 400) {
                    console.error("Invalid User Format");
                } else if (err.status === 401) {
                    console.error("Invalid or no Token");
                } else if (err.status === 403) {
                    console.error("Access Forbidden, not permitted to delete this user");
                } else if (err.status === 404) {
                    console.error("User not found");
                } else if (err.status === 500) {
                    console.error("Internal Server Error : " + err);
                }
            }


        }
    },
};
</script>

<style scoped>
.admin {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    padding-top: 30px;
    gap: 45px;
}

.nav-bar {
    border-right: 5px solid black;
    height: 100vh;
    width: 165px;
    display: flex;
    flex-direction: column;
}

.nav-bar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-bar li {
    margin: 10px;
}

.nav-bar a {
    text-decoration: none;
    color: v-bind('globalColors.darkColor');
    font-size: 16px;
    padding: 10px;
    display: block;
    text-align: left;
    transition: color 0.3s ease;
}

.nav-bar a:hover {
    font-weight: bold;
}

.admin-content {
    display: flex;
    flex-direction: column;
}

.admin-content h2 {
    font-size: 40px;
    margin: 20px 0;
    color: v-bind('globalColors.darkColor')
}

.avatar-username {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.avatar {
    width: 60px;
    height: 60px;
}

.avatar img {
    width: 60px;
    height: 60px;
}

.username h1 {
    margin: 0;
    font-size: 75px;
    font-weight: 900;
    color: v-bind('globalColors.darkColor');
    line-height: 60px;
}

.edit-icon {
    cursor: pointer;
    width: 45px;
    height: 45px;
}

.edit-icon img {
    width: 45px;
    height: 45px;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog {
    background: v-bind('globalColors.lightColor');
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-icon {
    display: flex;
    cursor: pointer;
}

.close-icon img {
    width: 20px;
    height: 20px;
    transition: color 0.3s ease;
}

.close-icon img:hover {
    transform: scale(1.3);
    background-color: #613b151d;
    border-radius: 8px;
}

.dialog-body {
    background-color: v-bind('globalColors.lightColor');
    display: flex;
    flex-direction: column;
}

.dialog-body form {
    display: flex;
    flex-direction: column;
}

.dialog-body input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: v-bind('globalColors.backgroundColor');
}

#password-settings {
    display: flex;
}

#password-settings form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

#password-settings button, .dialog-body button {
    background-color: v-bind('globalColors.redColor');
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 20px;
    cursor: pointer;
    align-self: center;
}

#password-settings input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    outline: none;
}

.quizzes, .users {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

#confidentialty-settings, #quizzes-history {
    display: flex;
    flex-direction: column;
}

.title-settings {
    display: flex;
}

.search > * {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 500px;
    margin-top: 5px;
    margin-bottom: 5px;
}

.filter {
    padding: 10px 20px;
    font-size: 14px;
    color: #fff;
    background-color: v-bind('globalColors.brownColor');
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.filter:hover {
    background-color: v-bind('globalColors.lightColor');
    transform: scale(1.05);
}

.filter.active {
    background-color: v-bind('globalColors.lightColor');
}

.light-color {
   filter: brightness(0) saturate(100%) invert(76%) sepia(32%) saturate(462%) hue-rotate(346deg) brightness(95%) contrast(88%);;
}

.delete:hover {
    cursor: pointer;
    transform: scale(1.05);
}

</style>