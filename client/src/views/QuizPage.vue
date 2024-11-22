<template>
    <div v-if="this.$route.query.quizId === undefined" class="main">
        <div class="search styledDiv">
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
                <div class="filter" v-if="this.userId"
                    @click="() => {this.searchFilterFavourites = !(this.searchFilterFavourites)}"
                    :class="{active: this.searchFilterFavourites}"
                >
                    Favourites
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
        <button class="styledButton" @click="$router.push('/create')" v-if="sessionToken">Create Quiz</button>
    <div class="quizzes">
            <div class="styledDiv" v-for="quiz in quizzes" :key="quiz.id">
                <div class="quiz-header" v-if="this.userId !== '' || this.sessionToken !== ''">
                    <div class="favourites" @click="changeFavourites(quiz.id)">
                        <img class="logo" src="@/assets/heart-unfilled.png" v-if="(favourites.indexOf(quiz.id) === -1)"/>
                        <img class="logo" src="@/assets/heart-filled.png" v-else/>
                    </div>
                    <div class="edit" @click="editQuiz(quiz.id)" v-if="isQuizOwner(quiz) == 1">
                        <img class="logo" src="@/assets/edit.png" />
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
            <p id="quizzesMessage">{{ quizzesMessage }}</p>
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
            const favourites = inject('favourites');
            const sessionToken = inject('sessionToken');
            const userId = inject('userId');
            const setFavourites = inject('setFavourites');
            return { favourites, sessionToken, userId, setFavourites };
        },
        data() {
            return {
                title: globalTitle,
                globalColors : globalColors,
                quizzes : [],
                quizzesMessage: "",
                searchFilterType: "",
                searchFilterFavourites: 0,
                searchFilterDifficulty: "all"
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
            async startQuiz(quiz){
                    router.push({path:'/quiz', query: { quizId: quiz.id}});
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
            isQuizOwner(quiz){
                if (quiz.ownerid == this.userId){
                    return 1;
                }
                return 0;
            },
            editQuiz(quizId){
                this.$router.push({path:'/edit', query : {quizId: quizId}});
            }
        },
        mounted() {
            const getAllquizzes = async () => { // arrows functions helping connecting with this.
                try {
                    const res = await axios.get('http://localhost:3000/quizzes');
                    if (res.status === 200 || res.status === 304){
                        this.quizzes = res.data; // ???
                    }
                } catch (err) {
                    console.log(err)
                    if (err.response.status === 404){
                        this.quizzesMessage = "Oops... The quizzes could not be reached... ";
                    } else if ( err.response.status === 500){
                        this.quizzesMessage = "Oops... The server is currently unavalable...";
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
    /* SEARCH STYLES */

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

    /* QUIZZES STYLES */
    .quizzes {
        display: flex;
        flex-wrap: wrap;
    }
    .quiz-header {
        display: flex;
        justify-content: space-between;
    }

    .favourites.edit {
        display: flex;
        margin-left: 10px;
        margin-top: 10px;
    }
    .favourites:hover {
        cursor: pointer;
        transform: scale(1.05);
    }
    .edit:hover {
        cursor: pointer;
        transform: scale(1.05);
    }

    .logo {
        height: 40px;
        width: 40px;
    }

    .quizz-caption {
        display: flex;
        align-items: center;
        margin-left: 20px;
        margin-right: 20px;

    }

    .quizz-caption img {
        width: 20px;
        height: 20px;
        margin: 5px;
    }

</style>
  