<template>
    <div v-if="loading">
        Loading
        <div class="loading">
            <img
                src="@/assets/chop-spedup.gif"
                alt="Loading ..."
                width="200"
                height="150"
            />
        </div>
    </div>
    <div class="render" v-else>
        <div class="side-bar">
            <router-link to="/quiz">
                <img
                    class="back-arrow"
                    src="@/assets/icons/back-arrow.png"
                    alt="Go Back"
                />
            </router-link>
            <LeaderboardComp :quizId="quiz.id" />
        </div>
        <div class="render-content">
            <div class="dialog-overlay" id="alertDialog" v-if="isAlert">
                <div class="dialog">
                    <div class="dialog-header">
                        <h2>{{ alert.title }}</h2>
                    </div>
                    <div class="dialog-body">
                        <p v-html="alert.body"></p>
                        <form
                            @submit.prevent="
                                () => {
                                    isAlert = false;
                                }
                            "
                        >
                            <button class="styledButton-red" type="submit">
                                Ok
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div
                class="dialog-overlay"
                id="confirmationDialog"
                v-if="isConfirmation"
            >
                <div class="dialog">
                    <div class="dialog-header">
                        <h2>{{ confirmation.title }}</h2>
                    </div>
                    <div class="dialog-body">
                        <p>{{ confirmation.body }}</p>
                        <div class="confirmation-div-button">
                            <button
                                class="styledButton-brown-minor"
                                @click="
                                    () => {
                                        confirmation.result = false;
                                        isConfirmation = false;
                                    }
                                "
                            >
                                Cancel
                            </button>
                            <button
                                class="styledButton-red"
                                @click="
                                    () => {
                                        confirmation.result = true;
                                        isConfirmation = false;
                                    }
                                "
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <h2>{{ quiz.name }}</h2>
            <div
                id="results"
                v-if="this.questionNumber === quiz.content.length"
            >
                <p>Here is your score :</p>
                <div class="score">
                    {{ score }} / {{ this.quiz.content.length }}
                </div>
                <p class="serverMessage">{{ this.serverMessage }}</p>
                <details>
                    <summary>Details</summary>
                    <div
                        v-for="question in this.quiz.content"
                        :key="question.id"
                    >
                        <h4 class="title">{{ question.title }}</h4>
                        <div class="answer-result-div"></div>

                        <div
                            :class="{ 'answer-result-div': true }"
                            v-for="answer in question.answers"
                            :key="answer.id"
                        >
                            <div class="answer-correct-div">
                                <img
                                    v-if="
                                        question.correct_answers.includes(
                                            answer.id
                                        ) ||
                                        question.correct_answers.includes(
                                            answer.id.toString()
                                        )
                                    "
                                    src="@/assets/icons/checkmark-icon.png"
                                    alt="correct"
                                    class="checkmark-icon"
                                />
                            </div>
                            <div
                                :class="{
                                    answercontent: true,
                                    'user-choice':
                                        this.userAnswers[
                                            quiz.content.findIndex(
                                                (elt) => elt.id === question.id
                                            )
                                        ].includes(answer.id) ||
                                        this.userAnswers[
                                            quiz.content.findIndex(
                                                (elt) => elt.id === question.id
                                            )
                                        ].includes(answer.id.toString()),
                                    correct:
                                        question.correct_answers.includes(
                                            answer.id
                                        ) ||
                                        question.correct_answers.includes(
                                            answer.id.toString()
                                        ),
                                }"
                            >
                                <p>{{ answer.content }}</p>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
            <div v-else id="quiz">
                <div
                    class="styledDiv-pretty questionQuiz"
                    v-if="quiz.content.length > 0"
                >
                    <h3>{{ this.quiz.content[questionNumber].title }}</h3>
                    <div id="img"></div>

                    <div class="answers">
                        <div
                            :class="{
                                answer: true,
                                active: userAnswers[questionNumber].includes(
                                    answer.id
                                ),
                            }"
                            @click="changeUserAnswers(answer.id)"
                            v-for="answer in quiz.content[questionNumber]
                                .answers"
                            :key="answer.id"
                        >
                            <p>{{ answer.content }}</p>
                        </div>
                    </div>

                    {{ questionNumber + 1 }}/{{ quiz.content.length }}
                </div>
                <nav class="nav-render">
                    <div>
                        <button
                            class="styledButton-red-minor"
                            @click="this.questionNumber -= 1"
                            v-if="this.questionNumber !== 0"
                        >
                            Previous
                        </button>
                    </div>
                    <div>
                        <button
                            class="styledButton-red"
                            @click="this.questionNumber += 1"
                            v-if="this.questionNumber < quiz.content.length - 1"
                        >
                            Next
                        </button>
                        <button
                            class="styledButton-red"
                            @click="finishQuiz()"
                            v-else-if="
                                this.questionNumber === quiz.content.length - 1
                            "
                        >
                            Finish
                        </button>
                    </div>
                </nav>
            </div>
            <p>{{ quizzesMessage }}</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";
import { globalColors } from "@/utils/GlobalVariable";
import LeaderboardComp from "@/components/LeaderboardComp.vue";

export default {
    setup() {
        const userId = inject("userId");
        const sessionToken = inject("sessionToken");
        return {
            userId,
            sessionToken,
        };
    },
    data() {
        return {
            quiz: {
                name: "",
                content: [],
                id: this.$route.query.quizId,
            },
            quizzesMessage: "",
            questionNumber: -1,
            globalColors: globalColors,
            userAnswers: [],
            score: 0,
            serverMessage: "",
            isAlert: false,
            alert: {
                body: "",
                title: "",
            },
            isConfirmation: false,
            confirmation: {
                body: "",
                title: "",
            },
            loading: false,
        };
    },
    components: {
        LeaderboardComp,
    },
    methods: {
        initAnswers() {
            for (let i = 0; i < this.quiz.content.length; i++) {
                this.userAnswers.push([]);
            }
        },
        changeUserAnswers(answerNumber) {
            if (this.userAnswers[this.questionNumber].includes(answerNumber)) {
                this.userAnswers[this.questionNumber] = this.userAnswers[
                    this.questionNumber
                ].filter((elt) => elt !== answerNumber);
            } else {
                let n_corr =
                    this.quiz.content[this.questionNumber].correct_answers
                        .length;
                if (
                    this.userAnswers[this.questionNumber].length < n_corr ||
                    n_corr === 1
                ) {
                    if (n_corr === 1) {
                        this.userAnswers[this.questionNumber] = [];
                    }
                    this.userAnswers[this.questionNumber].push(answerNumber);
                } else {
                    this.alert.body = "You have selected too many options";
                    this.alert.title = "Halt !";
                    this.isAlert = true;
                }
            }
        },
        calculateScore() {
            this.userAnswers.forEach((value, index) => {
                let n_correct = 0;
                value.forEach((ans_value) => {
                    if (
                        this.quiz.content[index].correct_answers.includes(
                            ans_value
                        ) ||
                        this.quiz.content[index].correct_answers.includes(
                            ans_value.toString()
                        )
                    ) {
                        n_correct++;
                    }
                });
                this.score +=
                    n_correct / this.quiz.content[index].correct_answers.length;
            });
        },
        async saveScore() {
            await axios
                .post(
                    "http://localhost:3000/scores/save",
                    {
                        userId: this.userId,
                        quizId: this.quiz.id,
                        score: this.score,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.sessionToken}`,
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        return;
                    }
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        console.error("Not authentified, cannot save score");
                        this.quizzesMessage = "Not logged in";
                    } else {
                        console.error(err);
                        this.quizzesMessage = "error";
                    }
                });
        },
        finishQuiz() {
            const sumUserAnswer = this.userAnswers.reduce(
                (acc, el) => acc + el.length,
                0
            );
            if (sumUserAnswer < this.quiz.content.length) {
                this.confirmation.title = "Caution";
                this.confirmation.body = `You left ${
                    this.quiz.content.length -
                    this.userAnswers.filter((elt) => elt.length > 0).length
                } questions unanswers...Are you sure you want to end this quiz ?`;
                this.isConfirmation = true;
                const unwatchConfirmation = this.$watch(
                    () => this.confirmation.result,
                    (newVal) => {
                        if (newVal === true) {
                            this.calculateScore();
                            if (this.userId) {
                                this.saveScore();
                            }
                            this.questionNumber += 1;
                        }
                        unwatchConfirmation();
                    }
                );
            } else {
                this.calculateScore();
                if (this.userId) {
                    this.saveScore();
                }
                this.questionNumber += 1;
            }
        },
    },
    mounted() {
        const getQuiz = async () => {
            this.loading = true;
            try {
                let quizId = this.$route.query.quizId;
                let res = await axios.get(
                    `http://localhost:3000/quizzes/${quizId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.sessionToken}`,
                        },
                    }
                );
                if (res.status === 200 || res.status === 304) {
                    this.quiz = res.data[0];
                    if (!(this.quiz.content instanceof Array)) {
                        this.quiz.content = JSON.parse(this.quiz.content);
                    }
                }
                this.initAnswers();
            } catch (err) {
                console.error(err);
                if (err.response.status === 401) {
                    this.quizzesMessage = "Oops... Unauthorized to fetch quiz. You probably need to log in again";
                    setTimeout(() => {
                        this.$router.push({path: '/auth', query: {form: 'login/signup', redirect: '/quiz'}});
                    }, 5000);
                } else if (err.response.status === 404) {
                    this.quizzesMessage =
                        "Oops... The quiz could not be found... ";
                } else if (err.response.status === 500) {
                    this.quizzesMessage =
                        "Oops... The server is currently unavalable...";
                } else if (err.response.status === 400) {
                    this.quizzesMessage =
                        "Oops... Invalid request to the server has been made...";
                } else {
                    this.quizzesMessage =
                        "Oops... The quizzes could not be loaded... ";
                }
            }
            this.loading = false;
            this.questionNumber = 0;
        };
        getQuiz();

        this.$watch("questionNumber", (newVal) => {
            if (newVal !== this.quiz.content.length) {
                if (this.quiz.content[newVal].picture) {
                    this.loading = true;
                    const img = new Image();
                    img.src = this.quiz.content[newVal].picture;
                    img.alt = this.quiz.content[newVal].picture;
                    img.style = "max-width: 450px; max-height: 450px;";
                    img.decode()
                        .then(() => {
                            document.getElementById("img").replaceChildren(img);
                        })
                        .catch((encodingError) => console.error(encodingError));
                    this.loading = false;
                }
            }
        });
    },
};
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
    text-decoration: none;
    color: v-bind("globalColors.darkColor");
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
.questionQuiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.answers {
    margin: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 10px;
}
.answer {
    border-radius: 8px;
    padding: 1px 40px;
    background-color: v-bind("globalColors.darkColor");
}
.active {
    background-color: v-bind("globalColors.lightColor");
}
.answer > p {
    color: white;
}
.answer:hover {
    cursor: pointer;
    background-color: v-bind("globalColors.lightColor");
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
    border: 2px solid v-bind("globalColors.lightColor");
    padding: 0px 10px;
    border-radius: 20px;
}
.user-choice {
    background-color: rgb(158, 51, 51, 0.3);
    border-color: v-bind("globalColors.redColor");
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

@media (max-width: 768px) {
    .render {
        flex-direction: column;
    }

    .side-bar {
        border: none;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .side-bar a {
        align-items: center;
    }

    .back-arrow {
        width: 55px;
        height: 40%;
    }

    .leaderboard {
        min-height: auto;
    }
}
</style>
