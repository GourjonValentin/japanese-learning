<template>
    <div class="go-back-div" @click="goBack">
        <img class="back-arrow" src="@/assets/icons/back-arrow.png" alt="Go Back"/>
    </div>
    <div class="create-quiz">
        <div class="dialog-overlay" id="alertDialog" v-if="isAlert">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ alert.title }}</h2>
                </div>
                <div class="dialog-body">
                    <p v-html="alert.body"></p>
                    <form @submit.prevent="() => {isAlert = false}">
                        <button class="styledButton-red" type="submit">Ok</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="dialog-overlay" id="confirmationDialog" v-if="isConfirmation">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ confirmation.title }}</h2>
                </div>
                <div class="dialog-body">
                        <p>{{ confirmation.body }}</p>
                        <div class="confirmation-div-button">
                            <button class="styledButton-brown-minor" @click="() => {confirmation.result = false; isConfirmation = false;}">Cancel</button>
                            <button class="styledButton-red" @click="() => {confirmation.result = true; isConfirmation = false;}">Ok</button>
                        </div>
                        
                    </div>
            </div>
        </div>
        <div class="styledDiv-pretty init-div" v-if="!init">
            <h2>Create a quiz</h2>
            <form class="init-form" @submit.prevent="initQuiz">
                <div class="field">
                    <label for="quizName">Quiz name :</label>
                    <input class="styledInput" type="text" id="quizName" name="quizName" v-model="quizName" placeholder="Enter a name" required>
                </div>
                <div class="field">
                    <img class="info-icon" @click="openDifficultyInfo" src="@/assets/icons/info-icon.png" alt="info-icon"/>
                    <label for="quizDifficulty">Difficulty :</label>
                    <div class="styledSelectInput">
                        <select name="quizDifficulty" id="quizDifficulty" v-model="quizDifficulty" required>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <img class="info-icon" @click="openQuizTypeInfo" src="@/assets/icons/info-icon.png" alt="info-icon"/>
                    <label for="quizType">Quiz type</label>
                    <div class="styledSelectInput">
                        <select id="quizType" name="quizType" v-model="quizType">
                            <option value="simple" selected>Normal Quiz</option>
                            <option value="anime">Anime Quiz</option>
                        </select>
                    </div>

                </div>
                <button class="styledButton-brown" style="
                        padding: 8px 20px; font-size: 13px;" type="submit">Create quiz</button>
            </form>
        </div>
        <div class="questions" v-else>
            <form @submit.prevent="submitQuestions">
                <h2>{{quizName}}</h2>
                <div :class="{question: true, 'styledDiv-pretty': true, error: hasError(question.id)}" v-for="question in quizQuestions" :key="question.id">
                    <div class="questionHeader">
                        <h4>Question {{ quizQuestions.findIndex(elt => elt.id == question.id) + 1 }}</h4>
                        <button class="close-icon" type="button" @click.prevent="deleteQuestion(question.id)" v-if="quizQuestions.length > 1">
                            <img src="@/assets/icons/katana_cross.png" alt="Delete question button">
                        </button>
                    </div>
                    <div class="questionContent">
                        <label for="title"><h4>Title :</h4></label>
                        <input class="styledInput" :name="'title-' + question.id" type="text" required>
                        <label for="picture" v-if="quizType === 'anime'">Picture link : </label>
                        <input class="styledInput" :name="'picture-' + question.id" v-if="quizType === 'anime'" type="text" required>
                        <h4>Answers :</h4>
                        <div class="answers" v-for="answer in question.answers || []" :key="answer.id">
                            <input :name="'checkbox-' + question.id + '-' + answer.id" type="checkbox">
                            <input class="styledInput" :name="'answer-' + question.id + '-' + answer.id + '-value'" type="text" required>
                            <button class="delete" @click.prevent="deleteAnswer(question.id, answer.id)" type="button"
                                    v-if="question.answers.length > 2">
                                <img class="delete-answer-button" src="@/assets/icons/katana.png" alt="delete Answer">
                            </button>
                        </div>
                        <button @click.prevent="addAnswer(question.id)" class="styledButton-brown-minor" type="button"
                                v-if="question.answers.length <= 3">Add answer choice</button>
                    </div>

                </div>
                <button class="styledButton-red-minor" @click.prevent="addQuestion" type="button">Add Question</button>
                <button class="styledButton-red" type="submit">Send Quiz</button>
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
            quizName: "",
            quizDifficulty: 1,
            quizType: "simple",
            init: false,
            quizQuestions: [],
            globalColors: globalColors,
            isAlert: false,
            alert: {
                body: '',
                title: ''
            },
            isConfirmation: false,
            confirmation: {
                body: '',
                title: '',
                result: null
            },
            hasValidateForm: false,
            questions: []
        };
    },
    methods: {
        openDifficultyInfo(){
            this.alert.title = 'Difficulty Level'; 
            this.alert.body = 'The difficulty level is an indicator for other users to try your quiz.<br>There are 3 difficulty level :\n1st one being the easiest one,\n3rd being for the more experienced user';
            this.isAlert = true;
        },
        openQuizTypeInfo(){
            this.alert.title = 'Quiz Type'; 
            this.alert.body = 'There are 2 types of quizzes:<br>&nbsp;&nbsp;&nbsp;&nbsp;Simple: simple CMQ<br>&nbsp;&nbsp;&nbsp;&nbsp;Anime: each question is related to a picture';
            this.isAlert = true;
        },
        goBack() {
            if (!(this.quizName == '')) {
                this.confirmation.title = 'Caution !';
                this.confirmation.body = 'Unsaved changes have been made on this page. If exiting this edition page, all current changes will be lost.';
                this.isConfirmation = true;
                const unwatchConfirmation = this.$watch(
                    () => this.confirmation.result,
                    (newVal) => {
                        if (newVal === true){
                            this.$router.push('/quiz');
                        }
                        unwatchConfirmation();
                    }
                );
            } else {
                this.$router.push('/quiz');
            }
        },
        hasError(questionId){
            if (this.hasValidateForm){
                let q = this.questions.filter(el => el.id === questionId);
                if (q.length > 0){
                    if(q[0].correct_answers.length === 0){
                        return true; 
                    } else {
                        return false;
                    }
                } else {
                    console.error('questionId not found');
                }
            } else {
                return false;
            }
        },
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
            this.quizQuestions.push(newQuestion);
            this.addAnswer(newQuestion.id);
            this.addAnswer(newQuestion.id);
        },
        deleteQuestion(id) {
            this.quizQuestions = this.quizQuestions.filter(elt => elt.id !== id);
        },
        initQuiz() {
            this.init = true;
            this.addQuestion()
        },
        addAnswer(id) {
            let index = this.quizQuestions.findIndex(elt => elt.id === id);
            if (this.quizQuestions[index].answers.length <= 3) {
                this.quizQuestions[index].answers.push({
                    id: this.answerIdGen++,
                    content: ""

                })
            }
        },
        deleteAnswer(questionId, answerId) {
            let targetQuestion = this.quizQuestions.find(elt => elt.id === questionId);
            let index = this.quizQuestions.findIndex(elt => elt.id === questionId);
            if (targetQuestion !== undefined && targetQuestion.answers !== undefined) {
                this.quizQuestions[index].answers = targetQuestion.answers.filter(elt => elt.id !== answerId);
            }
        },
        async submitQuestions(submitEvent) {
            this.questions = [];
            let idGen = 0;
            for (let elt of submitEvent.target.elements) {
                if (elt.name && (elt.name.search('title') !== -1 || elt.name.search('checkbox') !== -1 || elt.name.search('answer') !== -1)) {
                    let splitted = elt.name.split('-');
                    let type = splitted[0];
                    let questionId = splitted[1];
                    let answerId = splitted[2];
                    switch (type) {
                        case "title": {
                            this.questions.push({
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
                                this.questions[this.quizQuestions.findIndex(quizQuestion => quizQuestion.id == questionId)].correct_answers.push(answerId);
                            }
                            break
                        }
                        case "answer": {
                            this.questions[this.quizQuestions.findIndex(elt => elt.id == questionId)].answers.push({
                                "id": answerId,
                                "content": elt.value
                            });
                            break
                        } case "picture": {
                            this.questions[this.quizQuestions.findIndex(elt => elt.id == questionId)].picture = elt.value;
                            break;
                        } default: {
                            throw Error("Input type not expected");
                        }
                    }
                }
            }
            if (this.validateForm(this.questions)) {
                this.waiting = true;
                await this.createQuiz(this.questions);
                this.waiting = false;
            }
        },
        validateForm(parsedForm) {
            this.hasValidateForm = true;
            if (parsedForm.length === 0) return false;
            for (let question of parsedForm) {
                if (!question.title || !question.answers.length){
                    return false;
                } else if (!question.correct_answers.length) {
                    this.alert.title = 'Quiz not correct!';
                    this.alert.body = 'Make sure every questions have at least one correct answer.';
                    this.isAlert = true;
                    return false;
                }
                for (let answer of question.answers) {
                    if (!answer.content) {
                        return false;
                    }
                }
            }
            return true
        },
        async createQuiz(questions) {
            await axios.post('http://localhost:3000/create', { quizName: this.quizName, quizDifficulty: this.quizDifficulty, quizType: this.quizType, quizQuestions: JSON.stringify(questions), ownerId: this.userId })
                .then(response => {
                    if (response.status === 201) {
                        this.alert.title = "Success!"
                        this.alert.body ="Your quiz has been submitted successfully. You will be redirected"
                        this.isAlert = true;
                        this.$router.push({path:'/quiz'});

                    } else {
                        throw new Error('Status server error');
                    }
                }).catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }
};

</script>


<style scoped>
.create-quiz {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.create-quiz > div {
    width: -webkit-fill-available;
}

/* ALERT & CONFIRMATION BOXES */
.dialog-header{
    justify-items: center;
}
.dialog-body > p {
    text-align: justify;
}

.confirmation-div-button {
    display: flex;
    gap: 10px;
    justify-content: center;
}

/*  INIT FORM */
.info-icon {
    width: 25px;
    height: 25px;
}
.info-icon:hover {
    cursor: pointer;
}
.init-form {
    display: flex;
    flex-direction: column;
    margin: 10px;
}
.init-div {
    display: flex;
    flex-direction: column;
    max-width: 530px;
}
.field {
    display: flex;
    align-items: center;
}
.field > * {
    margin: 4px;
}

/* QUESTIONS SECTION */
.questions {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.questions > form {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: -webkit-fill-available;
}
.question {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 10px;
    max-width: 530px;
    width: -webkit-fill-available;

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
    background-color: rgba(0, 0, 0, 0);
}

.questionHeader > button > img {
    width: 30px;
    height: 30px;
}
.questionContent {
    display: flex;
    flex-direction: column;
    margin: 0px 30px 30px 30px;
    align-items: center;
    width: -webkit-fill-available;
}
.error {
    box-shadow: 0 12px 15px v-bind('globalColors.redColor');
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

.answers img {
    transform: rotate(45deg);
}

/* DELETE ANSWER BUTTON */

.delete-answer-button {
    width :20px;
    height : 20px;
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
}
.answers > button:active {
    transform: scale(0.95);
}
.go-back-div {
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
}
</style>