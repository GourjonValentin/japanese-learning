<template>
    <div class="profile">
        <div class="nav-bar">
            <ul>
                <li><a href="#password-settings">Security</a></li>
                <!-- <li><a href="#confidentialty-settings">Confidentiality</a></li> -->
                <li><a href="#quizzes-history">Quizzes history</a></li>
                <li><a href="#favorite-quizzes">Favorite quizzes</a></li>
                <li><router-link :to="{path :'/auth', query : { form : 'signout'}}">Sign Out</router-link></li>
            </ul>
        </div>
        <div class="profile-content">
            <div class="avatar-username">
                <div class="avatar"><img :src="avatarPath" alt="avatar" class="user-avatar"/></div>
                <div class="username"><h1>{{ username }}</h1></div>
                <div @click="toggleUsernameEdit" class="edit-icon">
                    <img v-if="!isEditingUsername" src="@/assets/pencil-icon.png" alt="Edit" />
                </div>
                <div v-if="isEditingUsername" class="dialog-overlay">
                    <div class="dialog">
                        <div class="dialog-header">
                            <h2>Change Username</h2>
                            <div @click="toggleUsernameEdit" class="close-icon">
                                <img src="@/assets/katana_cross.png" alt="Close">
                            </div>
                        </div>
                        <div class="dialog-body">
                            <form @submit.prevent="saveUsername">
                                <input type="text" v-model="newUsername" placeholder="Enter new username" maxlength="20" />
                                <p v-if="updateUsernameMessage" style="white-space: pre-wrap;">{{ updateUsernameMessage }}</p>
                                <button type="submit">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="password-settings">
                <form @submit.prevent="updatePassword">
                    <h2>Change your password</h2>
                    <input type="password" v-model="currentPassword" placeholder="Current password" required />
                    <input type="password" v-model="password" placeholder="New password" required />
                    <input type="password" v-model="confirmPassword" placeholder="Confirm new password" required />
                    <p v-if="updatePasswordMessage" style="white-space: pre-wrap;">{{ updatePasswordMessage }}</p>
                    <button type="submit">Save</button>
                </form>
            </div>
            <!-- <div id="confidentialty-settings">
                <div class="title-settings">
                    <h2>Confidentialty settings</h2>
                </div>
            </div> -->
            <div id="quizzes-history">
                <div class="title-settings">
                    <h2>Quizzes history</h2>
                </div>
                <div class="quizzes">
                    <div class="styledDiv" v-for="quiz in userQuizzes" :key="quiz.id">
                        <div class="quiz-header" v-if="this.userId !== '' || this.sessionToken !== ''">
                            <div class="favourites" @click="changeFavourites(quiz.id)">
                                <img class="logo" src="@/assets/heart-unfilled.png" v-if="(favourites.indexOf(quiz.id) === -1)"/>
                                <img class="logo" src="@/assets/heart-filled.png" v-else/>
                            </div>
                            <div class="edit" @click="editQuiz(quiz.id)" v-if="isQuizOwner(quiz) == 1">
                                <img class="logo" src="@/assets/pencil-icon-colored.png" />
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
                        <p>Best score : {{ quiz.score }} / {{ quiz.content.length }}</p>
                    </div>
                    <p id="userQuizzesMessage">{{ userQuizzesMessage }}</p>
                </div>
            </div>
            <div id="favorite-quizzes">
                <div class="title-settings">
                    <h2>Favorite quizzes</h2>
                </div>
                <div class="quizzes">
                    <div class="styledDiv" v-for="quiz in userFavQuizzes" :key="quiz.id">
                        <div class="quiz-header" v-if="this.userId !== '' || this.sessionToken !== ''">
                            <div class="favourites" @click="changeFavourites(quiz.id)">
                                <img class="logo" src="@/assets/heart-unfilled.png" v-if="(favourites.indexOf(quiz.id) === -1)"/>
                                <img class="logo" src="@/assets/heart-filled.png" v-else/>
                            </div>
                            <div class="edit" @click="editQuiz(quiz.id)" v-if="isQuizOwner(quiz) == 1">
                                <img class="logo" src="@/assets/pencil-icon-colored.png" />
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
                    </div>
                    <p id="userFavQuizzesMessage">{{ userFavQuizzesMessage }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import router from '@/router';
    import { inject } from 'vue'; // to access user variable
    import { globalColors } from '../utils/GlobalVariable';
    import axios from 'axios';

    export default {
        setup() {
            const username = inject('username');
            const avatarPath = inject('avatarPath');
            const userId = inject('userId');
            const favourites = inject('favourites');
            const sessionToken = inject('sessionToken');
            const setFavourites = inject('setFavourites');
            return {
                username,
                avatarPath,
                userId,
                favourites,
                sessionToken,
                setFavourites,
            };
        },
        data() {
            return {
                globalColors: globalColors,
                currentPassword: '',
                password: '',
                confirmPassword: '',
                updatePasswordMessage: '',
                userQuizzesMessage: '',
                userQuizzes: [],
                userFavQuizzesMessage: '',
                userFavQuizzes: [],
                newUsername: '',
                updateUsernameMessage: '',
                isEditingUsername: false,
            }
        },
        mounted() {
            const getUserQuizzes = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/user-quizzes', {
                        params: {
                            userId: this.userId,
                        },
                    });
                    if (res.status === 200){
                        this.userQuizzes = res.data;
                    }
                } catch (err) {
                    console.log(err)
                    if (err.response) {
                        console.log(err.response.data)
                        if (err.response.status === 404){
                            this.userQuizzesMessage = err.response.data.message;
                        } else if (err.response.status === 500){
                            this.userQuizzesMessage = err.response.data.error;
                        } else {
                            this.userQuizzesMessage = "Oops... Something went wrong while fetching quizzes.";
                        }
                    } else {
                        this.userQuizzesMessage = "Oops... Something went wrong while fetching quizzes.";
                    }
                }
            };
            const getUserFavQuizzes = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/quizzes', {
                        params: {
                            userId: this.userId,
                            favourites: this.favourites,
                        },
                    });
                    if (res.status === 200){
                        this.userFavQuizzes = res.data;
                    }
                } catch (err) {
                    console.log(err)
                    if (err.reponse) {
                        if (err.response.status === 404){
                            this.userFavQuizzesMessage = err.response.data.message;
                        } else if (err.response.status === 500){
                            this.userFavQuizzesMessage = err.response.data.error;
                        }
                    } else {
                        this.userFavQuizzesMessage = "Oops... Something went wrong while fetching quizzes.";
                    }
                }
            }

            getUserQuizzes();
            getUserFavQuizzes();
        },
        methods: {
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
                    }
                    else {
                        this.updatePasswordMessage = 'An error occurred during signup.';
                    }
                }
            },
            async startQuiz(quiz){
                router.push({path:'/quiz', query: { quizId: quiz.id}});
            },
            isQuizOwner(quiz){
                if (quiz.ownerid == this.userId){
                    return 1;
                }
                return 0;
            },
            editQuiz(quizId){
                this.$router.push({path:'/edit', query : {quizId: quizId}});
            },
            async changeFavourites(quizId){
                let mode = 'add';
                console.log("quizId", quizId);
                console.log("this.favourites", this.favourites);
                if (this.favourites.includes(quizId)){
                    mode = 'delete';
                }

                try {
                    const res = await axios.post('http://localhost:3000/users/edit-favourite', 
                        {
                            mode : mode, 
                            quizId : quizId,
                            userId : this.userId,
                            sessionToken : this.sessionToken
                        }).catch(err => {
                            if (err.response.status === 409) {
                                alert("You have already added this quiz to your favourites");
                            }
                            console.log("err", err);
                        });


                    this.setFavourites(res.data.favourites);
                } catch (err){
                    console.log("err", err);
                }
            },
            toggleUsernameEdit() {
                this.isEditingUsername = !this.isEditingUsername;
                if (this.isEditingUsername) {
                    this.newUsername = this.username;
                }
            },
            async saveUsername() {
                if (!this.newUsername) {
                    this.updateUsernameMessage = 'Please enter a new username.';
                    return;
                }

                if (this.newUsername === this.username) {
                    this.updateUsernameMessage = 'Please enter a different username.';
                    return;
                }

                try {
                    const response = await axios.post('http://localhost:3000/change-username', {
                        userId: this.userId,
                        newUsername: this.newUsername,
                    });

                    if (response.status === 200) {
                        this.username = this.newUsername;
                        this.updateUsernameMessage = response.data.message;
                        this.toggleUsernameEdit();
                    }
                } catch (error) {
                    if (error.response) {
                        this.updateUsernameMessage = error.response.data.message;
                    }
                    else {
                        this.updateUsernameMessage = 'An error occurred during username change.';
                    }
                }
            },
        },
    };
</script>

<style scoped>
.profile{
    display: flex;
    align-content: center;
    justify-content: flex-start;
    padding-top: 30px;
    gap: 45px;
}

.nav-bar{
    border-right: 5px solid black;
    height: 100vh;
    width: 165px;
    display: flex;
    flex-direction: column;
}

    .nav-bar ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav-bar li{
        margin: 10px ;
    }

    .nav-bar a{
        text-decoration: none;
        color: v-bind('globalColors.darkColor');
        font-size: 16px;
        padding: 10px;
        display: block;
        text-align: left;
        transition: color 0.3s ease;
    }

    .nav-bar a:hover{
        font-weight: bold;
    }

.profile-content {
    display: flex;
    flex-direction: column;
}

.profile-content h2{
    font-size: 40px;
    margin: 20px 0;
    color: v-bind('globalColors.darkColor')
}

.avatar-username{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.avatar{
    width: 60px;
    height: 60px;
}

.avatar img{
    width: 60px;
    height: 60px;
}

.username h1{
    margin: 0;
    font-size: 75px;
    font-weight: 900;
    color: v-bind('globalColors.darkColor');
    line-height: 60px;
}

.edit-icon{
    cursor: pointer;
    width: 45px;
    height: 45px;
}

.edit-icon img{
    width: 45px;
    height: 45px;
}

.dialog-overlay{
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

.dialog{
    background: v-bind('globalColors.lightColor');
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.dialog-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-icon{
    display: flex;
    cursor: pointer;
}

.close-icon img{
    width: 20px;
    height: 20px;
    transition: color 0.3s ease;
}

.close-icon img:hover{
    transform: scale(1.3);
    background-color: #613b151d;
    border-radius: 8px;
}

.dialog-body{
    background-color: v-bind('globalColors.lightColor');
    display: flex;
    flex-direction: column;
}

.dialog-body form{
    display: flex;
    flex-direction: column;
}

.dialog-body input{
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: v-bind('globalColors.backgroundColor');
}

#password-settings{
    display: flex;
}

#password-settings form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

#password-settings button, .dialog-body button{
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

#password-settings input{
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    outline: none;
}

#confidentialty-settings, #quizzes-history, #favorite-quizzes{
    display: flex;
    flex-direction: column;
}

.title-settings{
    display: flex;
}

</style>