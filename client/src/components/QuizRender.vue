<template>
    <router-link to="/quiz">Go back</router-link>
    <h3>{{ quiz.name }}</h3>
    <!--Je ne sais pas comment appele la classe...-->
    <div class="results" v-if="this.questionNumber === quiz.content.length">
        <p>Here is your score :</p>
        <div class="score">{{ score }} / {{ this.quiz.content.length }}</div>
        <p class="serverMessage">{{ this.serverMessage }}</p>
        <details>
            <summary>Details</summary>
            <div v-for="question in this.quiz.content" :key="question.id">
                <p class="title">{{ question.title }}</p>
                <div :class="{ answer : true,
                    correct: question.correct_answers[0] === 0,
                    userChoice: this.userAnswers[question.id] === 0}">
                        {{ question.answers[0].content }}
                </div>
                <div :class="{ answer : true,
                    correct: question.correct_answers[0] === 1,
                    userChoice: this.userAnswers[question.id] === 1}">
                        {{ question.answers[1].content }}
                </div>
                <div :class="{ answer : true,
                    correct: question.correct_answers[0] === 2, 
                    userChoice: this.userAnswers[question.id] === 2}">
                        {{ question.answers[2].content }}
                </div>
                <div :class="{ answer : true,
                    correct: question.correct_answers[0] === 3, 
                    userChoice: this.userAnswers[question.id] === 3}">
                        {{ question.answers[3].content }}
                </div>
            </div>
        </details>
    </div>
    <div v-else class="quiz???">
        <nav>
            <div>
                <button class="previous" @click="this.questionNumber -=1" v-if="this.questionNumber !== 0" >Previous</button>
            </div>
            <div>
                <button class="next" @click="this.questionNumber +=1" v-if="this.questionNumber < quiz.content.length - 1">Next</button>
                <button class="next" @click="finishQuiz()" v-else-if="this.questionNumber === quiz.content.length - 1">Finish</button>
            </div>
        </nav>
        <div class="content" v-if="quiz.content.length > 0">
            <h4>{{ this.quiz.content[questionNumber].title }}</h4>
            <img v-if="quiz.content[questionNumber].picture !==''" :src="quiz.content[questionNumber].picture" :alt="quiz.content[questionNumber].picture"/>
            <div :class="{active: (userAnswers[questionNumber].includes(0))}" @click="changeUserAnswers(0)">
                <p>{{ quiz.content[questionNumber].answers[0].content }}</p>
            </div>
            <div  :class="{active: (userAnswers[questionNumber].includes(1))}" @click="changeUserAnswers(1)">
                <p>{{ quiz.content[questionNumber].answers[1].content }}</p>
            </div>
            <div  :class="{active: (userAnswers[questionNumber].includes(2))}" @click="changeUserAnswers(2)" v-if="quiz.content[questionNumber].answers.length > 2">
                <p>{{ quiz.content[questionNumber].answers[2].content }}</p>
            </div>
            <div :class="{active: (userAnswers[questionNumber].includes(3))}" @click="changeUserAnswers(3)" v-if="quiz.content[questionNumber].answers.length === 4">
                <p>{{ quiz.content[questionNumber].answers[3].content }}</p>
            </div>
            {{ questionNumber +1 }}/{{ quiz.content.length }}
        </div>
    </div>
    <p>{{ quizzesMessage }}</p>
</template>

<script>
    import axios from 'axios';
    import { inject } from 'vue';
    import { globalColors } from '@/utils/GlobalVariable';

    export default {
        setup(){
            const userId = inject('userId');
            return { userId };
        },
        data(){
            return {
                quiz: {
                    name: '',
                    content: []
                },
                quizzesMessage : '',
                questionNumber : 0,
                globalColors : globalColors,
                userAnswers : [],
                score : 0,
                serverMessage : ''
            }
        },
        methods: {
            initAnswers() {
                for (let i=0; i < this.quiz.content.length; i++) {
                    this.userAnswers.push([])
                }
            },
            changeUserAnswers(answerNumber){
                if (this.userAnswers[this.questionNumber].includes(answerNumber)) {
                    // delete
                    this.userAnswers[this.questionNumber] = this.userAnswers[this.questionNumber].filter(elt => elt !== answerNumber);
                } else {
                    if (this.userAnswers[this.questionNumber].length < this.quiz.content[this.questionNumber].correct_answers.length){
                        this.userAnswers[this.questionNumber].push(answerNumber);
                    } else {
                        alert("Too much options selected");
                    }
                }


                console.log("an : ", this.userAnswers);
            },
            calculateScore(){
                this.userAnswers.forEach((value, index)=>{
                    console.log("el", value, index);
                    let n_correct;
                    value.forEach((ans_value) => {
                        if (this.quiz.content[index].correct_answers.includes(ans_value)) {
                            n_correct++;
                        }

                    });
                   this.score += n_correct / this.quiz.content[index].correct_answers.length;
                });
                console.log(this.userAnswers);
                
            },
            async saveScore(){
                await axios.post('http://localhost:3000/save-score', {userId : this.userId, quizId : this.quiz.id, score: this.score})
                .then((res) => {
                    if (res.status === 200 || res.status === 304){
                        console.log('ok');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.quizzesMessage ="error";
                })
            },
            finishQuiz(){
                console.log("eze", this.userAnswers.length, this.quiz.content.length)
                if (this.userAnswers.length < this.quiz.content.length){
                    if (confirm(`You left ${ this.quiz.content.length - this.userAnswers.filter(elt => elt.length > 0).length } questions unanswers...\nAre you sure you want to end this quiz ?`)){
                        this.calculateScore();
                        this.saveScore();
                        this.questionNumber +=1;
                    }
                } else {
                    this.calculateScore();
                    this.saveScore();
                    this.questionNumber +=1;
                }
            }
        },
        mounted(){
            const getQuiz = async () => {
                try {
                    let quizId = this.$route.query.quizId;
                    let res = await axios.get(`http://localhost:3000/quizzes/${quizId}`);
                    
                    if (res.status === 200 || res.status === 304){
                        this.quiz = res.data[0];
                        if (!(this.quiz.content instanceof Array)) {
                            this.quiz.content = JSON.parse(this.quiz.content);
                        }
                    }
                    this.initAnswers()
                } catch (err){
                    console.log(err)
                    if (err.response.status === 404){
                        this.quizzesMessage = "Oops... The quizz could not be found... ";
                    } else if ( err.response.status === 500){
                        this.quizzesMessage = "Oops... The server is currently unavalable...";
                    } else if ( err.response.status === 400){
                        this.quizzesMessage = "Oops... Invalid request to the server has been made...";
                    }else {
                        this.quizzesMessage = "Oops... The quizzes could not be loaded... ";
                    }
                }
            };
            getQuiz();
        }
    }
</script>

<style scoped>
    .content{
        display: block;
        border: solid 2px v-bind('globalColors.brownColor');
        border-radius: 20px;
        margin : 10px;
        padding: 10px;
    }
    .content > img {
        max-width: 500px;
        max-height: 500px;
    }
    .content > div {
        border-radius: 20px;
        margin: 5px;
        background-color: v-bind('globalColors.darkColor');
    }
    .content > .active {
        background-color: v-bind('globalColors.lightColor');
        border: solid 2px v-bind('globalColors.brownColor');
    }
    .content > div > p {
        color: white;

    }
    .content > div:hover {
        cursor: pointer;
        background-color: v-bind('globalColors.lightColor');
        transform: scale(1.05);
    }
    .previous, .next {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: v-bind('globalColors.darkColor');
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }
    .nav {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
    }
    .previous:hover, .next:hover {
        background-color:  v-bind('globalColors.lightColor');
        transform: scale(1.05);
    }

    /* RESULTS COMPONENTS */
    .results .title {
        font-size: 17.5px;
    }
    .results .answer {
        border-radius: 20px;
        margin: 5px;
        padding: 4px;
        border: solid 2px v-bind('globalColors.brownColor');
    }
    .userChoice {
        background-color: lightcoral;
        border-color: red;
    }
    .correct.userChoice {
        background-color: greenyellow;
        border-color: green;
    }

</style>