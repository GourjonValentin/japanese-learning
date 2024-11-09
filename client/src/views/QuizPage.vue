<template>
    <div class="search">
        <h2>Search Div</h2>
    </div>
    <div class="quiz-category">
        <div>
            Simple Quiz
        </div>
        <div>
            Anime Quiz
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
            <button class="start-quizz-button" @click="startQuiz">Start Quiz</button>
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
</template>

<script>
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
                quizzesMessage: ""
            };
        },
        methods : {
            async startQuiz(){
                alert("a coder haha");
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
    * { /* why necessary ?????? */
        color: v-bind(globalColors.darkColor);
    }
    .search {
        margin: 20px;
        padding : 10px;
        border: 2px solid ;
        border-radius: 20px;
        border-color: v-bind(globalColors.darkColor);
    }

    .quiz-category {
        display: flex;
        justify-content: center;
        gap : 50px;
        align-items: center;
        margin: 50px;
        padding : 40px;
        border: 2px solid ;
        border-radius: 20px;
        border-color: v-bind(globalColors.darkColor);
    }
    
    .quizzes {
        display: flex;
        flex-wrap: wrap;
    }
    .quizzes > div {
        border : solid 2px;
        border-radius: 20px;
        border-color: v-bind(globalColors.darkColor);
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
  