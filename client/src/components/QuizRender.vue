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
                    correct: question.correct_answers.includes(answer.id) || question.correct_answers.includes(answer.id.toString()),
                    userChoice: this.userAnswers[quiz.content.findIndex(elt => elt.id === question.id)].includes(answer.id) || this.userAnswers[quiz.content.findIndex(elt => elt.id === question.id)].includes(answer.id.toString()) }"
                     v-for="answer in question.answers" :key="answer.id"
                >
                    {{ answer.content }}
                </div>
            </div>
        </details>
    </div>
    <div v-else class="quiz???">
        <nav>
            <div>
                <button class="previous" @click="this.questionNumber -=1" v-if="this.questionNumber !== 0">Previous
                </button>
            </div>
            <div>
                <button class="next" @click="this.questionNumber +=1"
                        v-if="this.questionNumber < quiz.content.length - 1">Next
                </button>
                <button class="next" @click="finishQuiz()" v-else-if="this.questionNumber === quiz.content.length - 1">
                    Finish
                </button>
            </div>
        </nav>
        <div class="content" v-if="quiz.content.length > 0">
            <h4>{{ this.quiz.content[questionNumber].title }}</h4>
            <img v-if="quiz.content[questionNumber].picture !==''" :src="quiz.content[questionNumber].picture"
                 :alt="quiz.content[questionNumber].picture"/>
            <div
                :class="{active: (userAnswers[questionNumber].includes(answer.id))}"
                @click="changeUserAnswers(answer.id)"
                v-for="answer in quiz.content[questionNumber].answers"
                :key="answer.id"
            >
                <p>{{ answer.content }}</p>
            </div>

            {{ questionNumber + 1 }}/{{ quiz.content.length }}
        </div>
    </div>
    <p>{{ quizzesMessage }}</p>
</template>

<script>
import axios from 'axios';
import {inject} from 'vue';
import {globalColors} from '@/utils/GlobalVariable';

export default {
    setup() {
        const userId = inject('userId');
        return {userId};
    },
    data() {
        return {
            quiz: {
                name: '',
                content: []
            },
            quizzesMessage: '',
            questionNumber: 0,
            globalColors: globalColors,
            userAnswers: [],
            score: 0,
            serverMessage: ''
        }
    },
    methods: {
        initAnswers() {
            for (let i = 0; i < this.quiz.content.length; i++) {
                this.userAnswers.push([])
            }
        },
        changeUserAnswers(answerNumber) {
            if (this.userAnswers[this.questionNumber].includes(answerNumber)) {
                // delete
                this.userAnswers[this.questionNumber] = this.userAnswers[this.questionNumber].filter(elt => elt !== answerNumber);
            } else {
                let n_corr = this.quiz.content[this.questionNumber].correct_answers.length;
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
                    if (this.quiz.content[index].correct_answers.includes(ans_value) || this.quiz.content[index].correct_answers.includes(ans_value.toString())) {
                        n_correct++;
                    }

                });
                this.score += n_correct / this.quiz.content[index].correct_answers.length;
            });

        },
        async saveScore() {
            await axios.post('http://localhost:3000/save-score', {
                userId: this.userId,
                quizId: this.quiz.id,
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
        finishQuiz() {
            if (this.userAnswers.length < this.quiz.content.length) {
                if (confirm(`You left ${this.quiz.content.length - this.userAnswers.filter(elt => elt.length > 0).length} questions unanswers...\nAre you sure you want to end this quiz ?`)) {
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
        const getQuiz = async () => {
            try {
                let quizId = this.$route.query.quizId;
                let res = await axios.get(`http://localhost:3000/quizzes/${quizId}`);

                if (res.status === 200 || res.status === 304) {
                    this.quiz = res.data[0];
                    if (!(this.quiz.content instanceof Array)) {
                        this.quiz.content = JSON.parse(this.quiz.content);
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
        getQuiz();
    }
}
</script>

<style scoped>
.content {
    display: block;
    border: solid 2px v-bind('globalColors.brownColor');
    border-radius: 20px;
    margin: 10px;
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
    background-color: v-bind('globalColors.lightColor');
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