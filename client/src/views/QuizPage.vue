<template>
    <div v-if="this.$route.query.quizId === undefined" class="main">
        <div class="search">
            <form class="search-form" @submit.prevent="handleSearchSubmit()">
                <img src="@/assets/icons/search-logo.png" alt="search-logo.png"/>
                <input class="search-input" type="text" name="searchName" v-model="searchName" placeholder="Search by name..."/>
                <button  class="search-button"
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
                <div class="filter" v-if="this.userId"
                    @click="() => {this.searchFilterFavourites = !(this.searchFilterFavourites)}"
                    :class="{active: this.searchFilterFavourites}"
                >
                    Favourites
                </div>
                <div>
                    <select class="styledSelectInput" v-model="searchFilterDifficulty">
                        <option >Difficulty</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div>
            </div>
        </div>
        <button class="styledButton" @click="$router.push('/quiz/create')" v-if="sessionToken">Create Quiz</button>
        <div class="quizzes">
            <div class="quiz" v-for="quiz in quizzes" :key="quiz.id">
                <div class="quiz-header" v-if="this.userId !== '' || this.sessionToken !== ''">
                    <div class="favorites" @click="changeFavourites(quiz.id) ">
                        <img class="logo" src="@/assets/icons/heart-unfilled.png" v-if="(favorites.indexOf(quiz.id) === -1)"/>
                        <img class="logo" src="@/assets/icons/heart-filled.png" v-else/>
                    </div>
                    <div  class="tools" v-if="isQuizOwner(quiz) == 1">
                        <div @click="editQuiz(quiz)" class="edit">
                            <img class="logo" src="@/assets/icons/pencil-icon-colored.png" />
                        </div>
                        <div @click="deleteQuiz(quiz)" class="delete">
                            <img class="logo" src="@/assets/icons/delete-red.webp" />
                        </div>
                    </div>
                </div>

                <h3>{{ quiz.name }}</h3>
                <button class="styledButton" @click="startQuiz(quiz)">Start Quiz</button>
                <div class="quiz-caption">
                    <p>Difficulty : </p>
                    <div v-for="i in quiz.difficultylevel" :key="i">
                        <img src="@/assets/icons/torii.png"/>
                    </div>
                </div>
                <p>Owner : {{ quiz.ownername }}</p>
            </div>
            <p id="quizzesMessage">{{ quizzesMessage }}</p>
        </div>
        <div v-if="isAttemptingQuiz" class="dialog-overlay">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>Halt!</h2>
                    <div @click="toggleAttemptQuiz" class="close-icon">
                        <img src="@/assets/icons/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                    <p>You need to be logged in to attempt a quiz!</p>
                    <button class="styledButton-red" @click="goToLogIn">Got It</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="renderingQuiz">
        <QuizRender/>
    </div>
</template>

<script>
    import router from '@/router';
    import QuizRender from '@/components/QuizRender.vue';
    import { globalColors } from '../utils/GlobalVariable';
    import { globalTitle } from '../utils/GlobalVariable';
    import axios from 'axios';
    import { inject } from 'vue';

    export default {
        setup() {
            const favorites = inject('favorites');
            const sessionToken = inject('sessionToken');
            const userId = inject('userId');
            const setFavourites = inject('setFavourites');
            return { favorites, sessionToken, userId, setFavourites };
        },
        data() {
            return {
                title: globalTitle,
                globalColors : globalColors,
                quizzes : [],
                quizzesMessage: "",
                searchFilterType: "",
                searchFilterFavourites: false,
                searchFilterDifficulty: "Difficulty",
                isAttemptingQuiz: false,
            };
        },
        components: {
            QuizRender
        },
        methods : {
            toggleQuizFilterType(type){
                if (this.searchFilterType === ""){
                    this.searchFilterType = type;
                } else if (this.searchFilterType == type){
                    this.searchFilterType = "";
                } else {
                    this.searchFilterType = type;
                }
            },
            toggleAttemptQuiz() {
                this.isAttemptingQuiz = !this.isAttemptingQuiz;
            },
            async handleSearchSubmit(){
                await axios.get('http://localhost:3000/quizzes',
                    { params : {
                        difficulty : this.searchFilterDifficulty,
                        type: (this.searchFilterType === '' ? null : this.searchFilterType),
                        favorites : JSON.stringify(this.searchFilterFavourites ? this.favorites : null),
                        name: this.searchName
                    }}
                )
                .then( res => {
                    if (res.status === 200 || res.status === 206){
                        this.quizzes = res.data;
                        this.quizzesMessage = "";
                    }
                })
                .catch((err) => {
                    if(err.status === 404){
                        this.quizzesMessage = "No quizzes found...";
                        this.quizzes = [];
                    }
                    console.error("err",err);
                })
            },
            goToLogIn(){
                router.push({path:'/auth', query: {form : 'login/signup', redirect: '/quiz'}});
            },
            async startQuiz(quiz){
                if (this.sessionToken)
                    router.push({path:'/quiz', query: { quizId: quiz.id}});
                else {
                    this.isAttemptingQuiz = true;
                }
            },
            async changeFavourites(quizId){
                let mode = 'add';
                if (this.favorites.includes(quizId)){
                    mode = 'delete';
                }

                try {
                    const res = await axios.post('http://localhost:3000/users/edit-favorite',
                        {
                            mode : mode, 
                            quizId : quizId,
                            userId : this.userId,
                            sessionToken : this.sessionToken
                        }, {
                            'headers': {'Authorization': `Bearer ${this.sessionToken}`}
                        }).catch(err => {
                            if (err.response.status === 409) {
                                alert("You have already added this quiz to your favorites");
                            }
                            console.error("err", err);
                        });


                    this.setFavourites(res.data.favorites);
                } catch (err){
                    console.error("err", err);
                }
            },
            isQuizOwner(quiz){
                if (quiz.ownerid == this.userId){
                    return 1;
                }
                return 0;
            },
            editQuiz(quiz){
                this.$router.push({path:'/quiz/edit', query : {'quizId': quiz.id}});
            },
            async deleteQuiz(quiz){
                if (confirm(`You are about to delete the quiz *${quiz.name}*...\nAre you sure you want to continue ?`)){
                    try {
                        let res = await axios.delete('http://localhost:3000/quizzes/delete',{
                            params : {'quizId' : quiz.id},
                            headers: {'Authorization': `Bearer ${this.sessionToken}`}
                        });
                        if (res.status === 200){
                            this.quizzes = res.data;
                        } else {
                            this.alert.header = "Oops...";
                            this.alert.body = `the quiz ${quiz.name} couldn't be removed`;
                            this.isAlert = true;
                        }
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    return;
                }
            }
        },
        mounted() {
            const getAllquizzes = async () => {
                try {
                    const res = await axios.get('http://localhost:3000/quizzes', {
                        headers: {'Authorization': `Bearer ${this.sessionToken}`}
                    });
                    if (res.status === 200 || res.status === 206 || res.status === 304){
                        this.quizzes = res.data;
                    }
                } catch (err) {
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
            }
            getAllquizzes();
        }
    };
</script>

<style>
    /* SEARCH STYLES SECTION */

    .search {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
        margin-bottom: 40px;
    }

    .search-form > img {
        margin-top: 20px;
        width: 50px;
        height: 50px;
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

    .search-button {
        padding: 10px 15px;
        font-size: 16px;
        margin-top : 20px;
        color: #fff;
        background-color: v-bind('globalColors.redColor');
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .search-button:hover {
        background-color: v-bind('globalColors.lightColor');
        transform: scale(1.05);
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

    /* QUIZZES STYLES SECTION */
    .quizzes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .dialog-body{
        background-color: v-bind('globalColors.lightColor');
        display: flex;
        flex-direction: column;
    }
</style>
  