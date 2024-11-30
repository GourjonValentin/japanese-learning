<template>
    <div>
        <button @click="$router.push({path:'/quizz'})" class="styledButton">Go back</button>
        <div class="styledDiv init-div" v-if="!init">
            <h2>Create a quizz</h2>
            <form class="init-form" @submit.prevent="initQuizz">
                <div>
                    <label for="quizzName">Quizz name :</label>
                    <input class="styledInput" type="text" id="quizzName" name="quizzName" v-model="quizzName" required>
                </div>
                <div>
                    <label for="quizzDifficulty">Difficulty :</label>
                    <div class="styledSelectInput">
                        <select name="quizzDifficulty" id="quizzDifficulty" v-model="quizzDifficulty" required>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </div>

                </div>
                <div>
                    <label for="quizzType">Quizz type</label>
                    <div class="styledSelectInput">
                        <select id="quizzType" name="quizzType" v-model="quizzType">
                            <option value="simple" selected>Normal Quizz</option>
                            <option value="anime">Anime Quizz</option>
                        </select>
                    </div>

                </div>
                <button class="styledButton" style="
                         padding: 8px 20px; font-size: 13px;" type="submit">Create quizz</button>
            </form>
        </div>
        <div class="questions" v-else>
            <form @submit.prevent="submitQuestions">
                <h2>{{quizzName}}</h2>
                <div class="question styledDiv" v-for="question in quizzQuestions" :key="question.id">
                    <div class="questionHeader">
                        <p>Question {{ quizzQuestions.findIndex(elt => elt.id == question.id) + 1 }}</p>
                        <button class="deleteQuestion" type="button" @click.prevent="deleteQuestion(question.id)" v-if="quizzQuestions.length > 1">
                            <img src="@/assets/katana_cross.png" alt="Delete question button" width="30" height="30">
                        </button>
                    </div>
                    <div class="questionContent">
                        <label for="title">Title : </label>
                        <input class="styledInput" :name="'title-' + question.id" type="text" required>
                        <label for="picture" v-if="quizzType === 'anime'">Picture link : </label>
                        <input class="styledInput" :name="'picture-' + question.id" v-if="quizzType === 'anime'" type="text" required>
                        <p>Answers :</p>
                        <div class="answers" v-for="answer in question.answers || []" :key="answer.id">
                            <input :name="'checkbox-' + question.id + '-' + answer.id" type="checkbox">
                            <input class="styledInput" :name="'answer-' + question.id + '-' + answer.id + '-value'" type="text" required>
                            <button @click.prevent="deleteAnswer(question.id, answer.id)" type="button"
                                    v-if="question.answers.length > 2">
                                <img src="@/assets/katana.png" alt="delete Answer" width="20px" height="20px">
                            </button>
                        </div>
                        <button @click.prevent="addAnswer(question.id)" class="styledButton" type="button"
                                v-if="question.answers.length <= 3">Add answer choice</button>
                    </div>

                </div>
                <button class="styledButton" @click.prevent="addQuestion" type="button">Add Question</button>
                <button class="styledButton" type="submit">Valider Formulaire</button>
            </form>
        </div>
    </div>
</template>

<script>
import { inject } from "vue";
import axios from "axios";
import {globalColors} from "@/utils/GlobalVariable";



export default {
    setup() {
        const sessionToken = inject('sessionToken');
        const username = inject('username');
        const userId = inject('userId')
        return {
            sessionToken,
            username,
            userId
        }
    },
    data() {
        return {
            idGen: 0,
            answerIdGen: 0,
            quizzName: "",
            quizzDifficulty: 1,
            quizzType: "simple",
            init: false,
            quizzQuestions: [],
            globalColors: globalColors
        };
    },
    methods: {
        emptyQuestionTemplate() {
            return {
                id: this.idGen++,
                title: "",
                picture: "",
                answers: [],
                correct_answers: []
            }
        },
        addQuestion() {
            let newQuestion = this.emptyQuestionTemplate();
            this.quizzQuestions.push(newQuestion);
            this.addAnswer(newQuestion.id);
            this.addAnswer(newQuestion.id);
            console.log("ad", this.quizzQuestions);
        },
        deleteQuestion(id) {
            this.quizzQuestions = this.quizzQuestions.filter(elt => elt.id !== id);
            console.log("Delete question ", this.quizzQuestions);

        },
        initQuizz() {
            this.init = true;
            this.addQuestion()
        },
        addAnswer(id) {
            let index = this.quizzQuestions.findIndex(elt => elt.id === id);
            if (this.quizzQuestions[index].answers.length <= 3) {
                this.quizzQuestions[index].answers.push({
                    id: this.answerIdGen++,
                    content: ""

                })
            }
        },
        deleteAnswer(questionId, answerId) {
            console.log(`Deleting answer ${questionId} -> ${answerId}`);
            let targetQuestion = this.quizzQuestions.find(elt => elt.id === questionId);
            let index = this.quizzQuestions.findIndex(elt => elt.id === questionId);
            if (targetQuestion !== undefined && targetQuestion.answers !== undefined) {
                this.quizzQuestions[index].answers = targetQuestion.answers.filter(elt => elt.id !== answerId);
            }
        },
        async submitQuestions(submitEvent) {
            let questions = [];
            let idGen = 0;
            for (let elt of submitEvent.target.elements) {
                if (elt.name && (elt.name.search('title') !== -1 || elt.name.search('checkbox') !== -1 || elt.name.search('answer') !== -1)) {
                    let splitted = elt.name.split('-');
                    let type = splitted[0];
                    let questionId = splitted[1];
                    let answerId = splitted[2];
                    switch (type) { // a rajouter pictures
                        case "title": {
                            questions.push({
                                "id": idGen++,
                                "title": elt.value,
                                "picture": "",
                                "answers": [],
                                "correct_answers": []
                            });
                            break;
                        }
                        case "checkbox": {
                            if (elt.checked) {

                                questions[this.quizzQuestions.findIndex(quizzQuestion => quizzQuestion.id == questionId)].correct_answers.push(answerId);
                            }
                            break
                        }
                        case "answer": {
                            questions[this.quizzQuestions.findIndex(elt => elt.id == questionId)].answers.push({
                                "id": answerId,
                                "content": elt.value
                            });
                            break
                        } case "picture": {
                            questions[this.quizzQuestions.findIndex(elt => elt.id == questionId)].picture = elt.value;
                            break;
                        } default: {
                            throw Error("Input type not expected");
                        }

                    }
                }

            }
            if (this.validateForm(questions)) {
                this.waiting = true;
                await this.createQuizz(questions);
                this.waiting = false;

            } else {
                alert("Quizz not correct");
            }
        },
        validateForm(parsedForm) {
            if (parsedForm.length === 0) return false;
            for (let question of parsedForm) {

                if (!question.title || !question.answers.length || !question.correct_answers.length) {
                    return false
                }
                for (let answer of question.answers) {
                    if (!answer.content) {
                        return false
                    }
                }
            }
            return true
        },
        async createQuizz(questions) {
            await axios.post('http://localhost:3000/create', { quizzName: this.quizzName, quizzDifficulty: this.quizzDifficulty, quizzType: this.quizzType, quizzQuestions: JSON.stringify(questions), ownerId: this.userId })
                .then(response => {
                    if (response.status === 201) {
                        alert('Quizz created');
                        this.$router.push({path:'/quizz'});

                    } else {
                        throw new Error('Status server error');
                    }
                }).catch(error => {
                    console.error('There was an error!', error);
                });
        }
    },
    mounted() {
        /*axios.post('http://localhost:3000/auth/check', {
            sessionToken: this.sessionToken
        }).catch(error => {
            if (error.status === 401) {
                alert('Invalid token, you will be redirected to home page');
                this.$router.push({path :'/'});
            }
        });*/
    }
};

</script>


<style scoped>

.question {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 10px;
}

.questionHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: -webkit-fill-available;
    margin: 10px;
}

.questionHeader > button {
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    background-color: rgba(0, 0, 0, 0);
    filter: brightness(0) saturate(100%) invert(6%) sepia(9%) saturate(5442%) hue-rotate(321deg) brightness(115%) contrast(86%);
}

.questionHeader > button:hover {
    cursor: pointer;
    transform: scale(1.3);
    filter: brightness(0) saturate(100%) invert(76%) sepia(51%) saturate(336%) hue-rotate(339deg) brightness(92%) contrast(93%);

}

.questionHeader > button:active {
    transform: scale(0.95);
}


.questionContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: -webkit-fill-available;
}

.answers {
    margin: 5px;
}
.answers > * {
    margin: 2px;
}

.styledButton {
    margin-top: 20px;
}

.init-div {
    display: flex;
    flex-direction: column;
}

.init-div label {
    margin: 8px;
}

.init-form > div {
    margin: 10px;
}

.answers {
    border-radius: 25px;
    padding: 5px 15px;
    border: solid 2px v-bind('globalColors.darkColor');
    display: flex;
    flex-direction: row;
    align-items: center;
}
.answers img {
    transform: rotate(45deg);
}

.answers > button {
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    background-color: rgba(0, 0, 0, 0);
    filter: brightness(0) saturate(100%) invert(6%) sepia(9%) saturate(5442%) hue-rotate(321deg) brightness(115%) contrast(86%);
}

.answers > button:hover {
    cursor: pointer;
    transform: scale(1.3);
    filter: brightness(0) saturate(100%) invert(76%) sepia(51%) saturate(336%) hue-rotate(339deg) brightness(92%) contrast(93%);

}

.answers > button:active {
    transform: scale(0.95);
}


</style>