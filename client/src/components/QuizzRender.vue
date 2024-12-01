<template>
    <div class="render">
        <div class="side-bar">
            <router-link to="/quizz">
                <img class="back-arrow" src="@/assets/back-arrow.png" alt="Go Back"/>
            </router-link>
            <LeaderboardComp :quizzId="quizz.id"/>
        </div>
        <div class="render-content">
            <h2>{{ quizz.name }}</h2>
            <div id="results" v-if="this.questionNumber === quizz.content.length">
                <p>Here is your score :</p>
                <div class="score">{{ score }} / {{ this.quizz.content.length }}</div>
                <p class="serverMessage">{{ this.serverMessage }}</p>
                <details>
                    <summary>Details</summary>
                    <div v-for="question in this.quizz.content" :key="question.id">
                        <h4 class="title">{{ question.title }}</h4>
                        <div class="answer-result-div">
                            
                        </div>
                        
                        <div :class="{ 'answer-result-div': true}" v-for="answer in question.answers" :key="answer.id"
                        >
                            <div class="answer-correct-div">
                                <img v-if="question.correct_answers.includes(answer.id) || question.correct_answers.includes(answer.id.toString())"
                                src="@/assets/checkmark-icon.png" alt="correct" class="checkmark-icon"/>
                            </div>
                            <div :class="{'answercontent':true,
                                    'user-choice': this.userAnswers[quizz.content.findIndex(elt => elt.id === question.id)].includes(answer.id) || this.userAnswers[quizz.content.findIndex(elt => elt.id === question.id)].includes(answer.id.toString()), 
                                    'correct': question.correct_answers.includes(answer.id) || question.correct_answers.includes(answer.id.toString())}"
                                >
                                <p>{{ answer.content }}</p>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
            <div v-else id="quizz">
                <nav class="nav-render">
                    <div>
                        <button class="styledButton-red-minor" @click="this.questionNumber -=1" v-if="this.questionNumber !== 0">Previous
                        </button>
                    </div>
                    <div>
                        <button class="styledButton-red" @click="this.questionNumber +=1"
                                v-if="this.questionNumber < quizz.content.length - 1">Next
                        </button>
                        <button class="styledButton-red" @click="finishQuizz()" v-else-if="this.questionNumber === quizz.content.length - 1">
                            Finish
                        </button>
                    </div>
                </nav>
                <div class="styledDiv-pretty questionQuizz" v-if="quizz.content.length > 0">
                    <h3>{{ this.quizz.content[questionNumber].title }}</h3>
                    <img v-if="quizz.content[questionNumber].picture !==''" :src="quizz.content[questionNumber].picture"
                        :alt="quizz.content[questionNumber].picture"/>
                    
                    <div class="answers">
                        <div
                            :class="{answer: true, active: (userAnswers[questionNumber].includes(answer.id))}"
                            @click="changeUserAnswers(answer.id)"
                            v-for="answer in quizz.content[questionNumber].answers"
                            :key="answer.id"
                        >
                            <p>{{ answer.content }}</p>
                        </div>
                    </div>
                    

                    {{ questionNumber + 1 }}/{{ quizz.content.length }}
                </div>
            </div>
            <p>{{ quizzesMessage }}</p>
        </div>
    </div>
    
</template>

<script>
import axios from 'axios';
import {inject} from 'vue';
import {globalColors} from '@/utils/GlobalVariable';
import LeaderboardComp from "@/components/LeaderboardComp.vue";

export default {
    setup() {
        const userId = inject('userId');
        return {userId};
    },
    data() {
        return {
            quizz: {
                name: '',
                content: [],
                id: this.$route.query.quizzId
            },
            quizzesMessage: '',
            questionNumber: 0,
            globalColors: globalColors,
            userAnswers: [],
            score: 0,
            serverMessage: ''
        }
    },
    components: {
        LeaderboardComp
    },
    methods: {
        initAnswers() {
            for (let i = 0; i < this.quizz.content.length; i++) {
                this.userAnswers.push([])
            }
        },
        changeUserAnswers(answerNumber) {
            if (this.userAnswers[this.questionNumber].includes(answerNumber)) {
                // delete
                this.userAnswers[this.questionNumber] = this.userAnswers[this.questionNumber].filter(elt => elt !== answerNumber);
            } else {
                let n_corr = this.quizz.content[this.questionNumber].correct_answers.length;
                if (this.userAnswers[this.questionNumber].length < n_corr || n_corr === 1) {
                    if (n_corr === 1) {
                        this.userAnswers[this.questionNumber] = []
                    }
                    this.userAnswers[this.questionNumber].push(answerNumber);
                } else {
                    alert("Too much options selected");
                }
            }


        },
        calculateScore() {
            this.userAnswers.forEach((value, index) => {
                let n_correct = 0;
                value.forEach((ans_value) => {
                    if (this.quizz.content[index].correct_answers.includes(ans_value) || this.quizz.content[index].correct_answers.includes(ans_value.toString())) {
                        n_correct++;
                    }

                });
                this.score += n_correct / this.quizz.content[index].correct_answers.length;
            });

        },
        async saveScore() {
            await axios.post('http://localhost:3000/save-score', {
                userId: this.userId,
                quizzId: this.quizz.id,
                score: this.score
            })
                .then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        console.log('ok');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.quizzesMessage = "error";
                })
        },
        finishQuizz() {
            if (this.userAnswers.length < this.quizz.content.length) {
                if (confirm(`You left ${this.quizz.content.length - this.userAnswers.filter(elt => elt.length > 0).length} questions unanswers...\nAre you sure you want to end this quizz ?`)) {
                    this.calculateScore();
                    if (this.userId) {
                        this.saveScore();
                    }
                    this.questionNumber += 1;
                }
            } else {
                this.calculateScore();
                if (this.userId) {
                    this.saveScore();
                }
                this.questionNumber += 1;
            }
        }
    },
    mounted() {
        const getQuizz = async () => {
            try {
                let quizzId = this.$route.query.quizzId;
                let res = await axios.get(`http://localhost:3000/quizzes/${quizzId}`);

                if (res.status === 200 || res.status === 304) {
                    this.quizz = res.data[0];
                    if (!(this.quizz.content instanceof Array)) {
                        this.quizz.content = JSON.parse(this.quizz.content);
                    }

                }
                this.initAnswers()
            } catch (err) {
                console.log(err)
                if (err.response.status === 404) {
                    this.quizzesMessage = "Oops... The quizz could not be found... ";
                } else if (err.response.status === 500) {
                    this.quizzesMessage = "Oops... The server is currently unavalable...";
                } else if (err.response.status === 400) {
                    this.quizzesMessage = "Oops... Invalid request to the server has been made...";
                } else {
                    this.quizzesMessage = "Oops... The quizzes could not be loaded... ";
                }
            }
        };
        getQuizz();
    }
}
</script>

<style scoped>
.render {
    display: flex;
    margin: 0px;
    padding: 20px 0px;
}
.side-bar {
    border-right: 5px solid black;
    
}
.side-bar a {
    margin-left: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.side-bar a{
    text-decoration: none;
    color: v-bind('globalColors.darkColor');
}
.render-content {
    width: -webkit-fill-available;
}
.nav-render {
    display: flex;
    align-items: center;
    justify-content: center;
}
.nav-render > div {
    align-items: center;
    margin: 5px;
}
.nav-render button {
    margin: 0px;
}
.questionQuizz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.questionQuizz > img {
    max-width: 450px;
    max-height: 450px;
}
.answers {
    margin: 10px;
    display: grid;               /* Enable grid layout */
    grid-template-columns: 1fr 1fr; /* Define two equal columns */
    grid-template-rows: 1fr 1fr;    /* Define two equal rows */
    gap: 10px;
}
.answer {
    border-radius: 8px;
    padding: 1px 40px;
    background-color: v-bind('globalColors.darkColor');
}
.active {
    background-color: v-bind('globalColors.lightColor');
}
.answer > p {
    color: white;
}
.answer:hover {
    cursor: pointer;
    background-color: v-bind('globalColors.lightColor');
    transform: scale(1.05);
}

/* RESULTS COMPONENTS */

.answer-result-div {
    display: flex;
    align-items: center;
    justify-content: center;
}

.answercontent {
    margin: 10px;
    border: 2px solid v-bind('globalColors.lightColor');
    padding: 0px 10px;
    border-radius: 20px;
}
.user-choice {
    background-color: rgb(158, 51, 51, 0.3);
    border-color: v-bind('globalColors.redColor');
}
.correct.user-choice {
    background-color: rgb(130, 207, 142, 0.3);
    border-color: #83cf8f;
}
.answer-correct-div {
    width: 30px;
    height: 30px;
}
.checkmark-icon {
    width: 30px;
    height: 30px;
}

</style>