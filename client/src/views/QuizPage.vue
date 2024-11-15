<template>
    <div v-if="this.$route.query.quizId === undefined" class="main">
        <div class="search">
            <form class="search-form" @submit.prevent="handleSearchSubmit()">
                <img src="../assets/search_logo.png" alt="search_logo.png"/>
                <input class="search-input" type="text" name="searchName" v-model="searchName" placeholder="search"/>
                <button  class="search-button" type="submit">Search</button>
            </form>
            <div class="filter">
                <div @click="toggleQuizFilterType('simple')"
                    :class="{active: this.searchFilterType === 'simple'}"
                >
                        Simple Quiz
                </div>
                <div @click="toggleQuizFilterType('anime')"
                    :class="{active: this.searchFilterType === 'anime'}"
                >
                    Anime Quiz
                </div>
                <div v-if="this.userId"
                    @click="() => {this.searchFilterFavourites = !(this.searchFilterFavourites)}"
                    :class="{active: this.searchFilterFavourites}"
                >
                    Favourites
                </div>
                <div>
                    <select v-model="searchFilterDifficulty">
                        <option >all</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="quizzes">
            <div v-for="quiz in quizzes" :key="quiz.id">
                <div v-if="this.userId !== '' || this.sessionToken !== ''">
                    <div class="favourites" @click="changeFavourites(quiz.id)">
                        <img src="@/assets/heart-unfilled.png" v-if="(favourites.indexOf(quiz.id) === -1)"/>
                        <img src="@/assets/heart-filled.png" v-else/>
                    </div>
                </div>
                
                <h3>{{ quiz.name }}</h3>
                <button class="start-quizz-button" @click="startQuiz(quiz)">Start Quiz</button>
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
    .search {
        margin: 20px;
        padding : 10px;
        border: 2px solid ;
        border-radius: 20px;
        border-color: v-bind('globalColors.darkColor');
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

    .search-input {
        flex: 1;
        padding: 8px 15px;
        border: 2px solid v-bind('globalColors.darkColor');
        border-radius: 25px;
        outline: none;
        transition: border-color 0.3s;
    }
    .search-input:focus {
        border-color: v-bind('globalColors.lightColor');
    }

    .search-button {
        padding: 8px 20px;
        color: #fff;
        background-color: v-bind('globalColors.darkColor');
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .search-button:hover {
        background-color: v-bind('globalColors.lightColor');
        transform: scale(1.05);
    }

    .search-button:active {
        transform: scale(0.95);
    }

    .filter > div{
        padding: 10px 20px;
        font-size: 14px;
        color: #fff;
        background-color: v-bind('globalColors.brownColor');
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .filter > div:hover {
        background-color: v-bind('globalColors.lightColor');
        transform: scale(1.05);
    }

    .filter > div.active {
        background-color: v-bind('globalColors.lightColor');
    }

    /* QUIZZES STYLES */
    .quizzes {
        display: flex;
        flex-wrap: wrap;
    }
    .quizzes > div {
        border : solid 2px;
        border-radius: 20px;
        border-color: v-bind('globalColors.darkColor');
        margin : 30px;
    }
    .favourites {
        display: flex;
        margin-left: 10px;
        margin-top: 10px;
    }
    .favourites:hover {
        cursor: pointer;
        transform: scale(1.05);
    }
    .favourites > img {
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

    .start-quizz-button {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: v-bind('globalColors.darkColor');
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .start-quizz-button:hover {
        background-color: v-bind('globalColors.lightColor');
        transform: scale(1.05);
    }

    .start-quizz-button:active {
        transform: scale(0.95);
    }

</style>
  