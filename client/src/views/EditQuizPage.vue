<template>
    <div v-if="this.permitted === false">
        <h2>You are unauthorized to acces this page</h2>
        <router-link class="styledButton-red" style="text-decoration: none;" to="/quiz">Go Back</router-link>
    </div>
    <div v-else class="edit-div">
        <div class="dialog-overlay" id="titleForm" v-if="isTitleForm">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>Change Title</h2>
                    <div @click="() => {isTitleForm = false}" class="close-icon">
                        <img src="@/assets/icons/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                        <form @submit.prevent="() => {quiz.name = editedTitle; isTitleForm = false;}">
                            <input class="styledInput" type="text" v-model="editedTitle" />
                            <button class="styledButton-red" type="submit">Save</button>
                        </form>
                    </div>
            </div>
        </div>

        <div class="dialog-overlay" id="mainAttributesForm" v-if="isMainAttributesForm">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>Editing Form</h2>
                    <div @click="() => {isMainAttributesForm = false}" class="close-icon">
                        <img src="@/assets/icons/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                        <form @submit.prevent="saveMainAttributes">
                            <div>
                                <label for="quizDifficulty">Difficulty :</label>
                                <div class="styledSelectInput">
                                    <select name="quizDifficulty" id="quizDifficulty" v-model="editedMainAttributes.difficultylevel" required>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label for="quizType">Quiz type</label>
                                <div class="styledSelectInput">
                                    <select id="quizType" name="quizType" v-model="editedMainAttributes.type">
                                        <option value="simple" selected>Normal Quiz</option>
                                        <option value="anime">Anime Quiz</option>
                                    </select>
                                </div>
                            </div>
                            <button class="styledButton-red" type="submit">Save</button>
                        </form>
                    </div>
            </div>
        </div>

        <div class="dialog-overlay" id="questionForm" v-if="isQuestionForm">
            <div class="dialog">
                <div class="dialog-header">
                    <!-- Sure que ce soit la bonne indexation ???-->
                    <h2>Editing Questions n°{{ editedQuestion.id +1 }}</h2>
                    <div @click="() => {isQuestionForm = false}" class="close-icon">
                        <img src="@/assets/icons/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                    <form @submit.prevent="saveQuestion">
                        <label for="title">Question Title : </label>
                        <input class="styledInput" type="text" v-model = editedQuestion.title>
                        <label for="picture" v-if="this.quiz.type === 'anime'">Picture link : </label>
                        <input class="styledInput" v-if="this.quiz.type === 'anime'" type="text" v-model="editedQuestion.picture" required>
                        <p>Answers :</p>
                        <div class="answers" v-for="answer in editedQuestion.answers || []" :key="answer.id">
                            <input type="checkbox" :checked="this.editedQuestion.correct_answers.includes(answer.id)" @change="checkboxChangeHandler($event, answer.id)">
                            <input class="styledInput" type="text" v-model=answer.content required>
                            <button class="delete" @click.prevent="deleteAnswer(answer.id)" type="button"
                                    v-if="editedQuestion.answers.length > 2">
                                <img class="delete-answer-button" src="@/assets/icons/katana.png" alt="delete Answer" width="20px" height="20px">
                            </button>
                        </div>
                        <button @click.prevent="addAnswer()" class="styledButton-brown-minor" type="button"
                            v-if="editedQuestion.answers.length <= 3">Add answer choice</button>
                        <p class="dialog-message">{{ dialodMessage }}</p>
                        <button class="styledButton-red" type="submit">Save</button>
                    </form>
                </div>
            </div>


        </div>

        <div class="dialog-overlay" id="addingQuestionForm" v-if="isAddingQuestionForm">
            <div class="dialog">
                <div class="dialog-header">
                    <!-- Sure que ce soit la bonne indexation ???-->
                    <h2>Adding Question</h2>
                    <div @click="() => {isAddingQuestionForm = false}" class="close-icon">
                        <img src="@/assets/icons/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                    <form @submit.prevent="saveAddedQuestion">
                        <label for="title">Question Title : </label>
                        <input class="styledInput" type="text" v-model = editedQuestion.title>
                        <label for="picture" v-if="this.quiz.type === 'anime'">Picture link : </label>
                        <input class="styledInput" v-if="this.quiz.type === 'anime'" type="text" v-model="editedQuestion.picture" required>
                        <p>Answers :</p>
                        <div class="answers" v-for="answer in editedQuestion.answers || []" :key="answer.id">
                            <input type="checkbox" :checked="this.editedQuestion.correct_answers.includes(answer.id)" @change="checkboxChangeHandler($event, answer.id)">
                            <input class="styledInput" type="text" v-model=answer.content required>
                            <button class="delete-answer" @click.prevent="deleteAnswer(answer.id)" type="button"
                                    v-if="editedQuestion.answers.length > 2">
                                <img class="delete-answer-button" src="@/assets/icons/katana.png" alt="delete Answer" width="20px" height="20px">
                            </button>
                        </div>
                        <button @click.prevent="addAnswer()" class="styledButton-brown-minor" type="button"
                            v-if="editedQuestion.answers.length <= 3">Add answer choice</button>
                        <p class="dialog-message">{{ dialodMessage }}</p>
                        <button class="styledButton-red" type="submit">Save</button>
                    </form>
                </div>
            </div>


        </div>

        <div class="dialog-overlay" id="alertDialog" v-if="isAlert">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ alert.title }}</h2>
                </div>
                <div class="dialog-body">
                        <p>{{ alert.body }}</p>
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

        <div class="field">
            <h1>{{ quiz.name }}</h1>
            <div class="edit" @click="()=>{editedTitle = quiz.name; isTitleForm = true;}" >
                <img src="@/assets/icons/pencil-icon.png" alt="edit_btn" class="editing-logo"/>
            </div>
        </div>
        <div class="main-attributes styledDiv">
            <div class="main-attributes-header">
                <h2>Main Attributes</h2>
                <div class="edit" @click="editMainAttributes" >
                    <img src="@/assets/icons/pencil-icon.png" alt="edit_btn" class="minor-editing-logo"/>
                </div>
            </div>
            <div class="main-attributes-body">
                <div>
                    <p>Difficulty level : </p>
                    <p>{{ quiz.difficultylevel }}</p>
                </div>
                <div>
                    <p>Type : </p>
                    <p>{{ quiz.type }}</p>
                </div>
            </div>
        </div>
        <h2>Questions</h2>
        <div class="quiz-content">
            <div class="styledDiv-pretty" v-for="question in quiz.content" :key="question.id">
                <div id="questions-editing-logo">
                    <div class="edit" @click="editQuestionQuiz(question)">
                        <img class="logo" src="@/assets/icons/pencil-icon-colored.png" alt="edit_btn"/>
                    </div>
                    <div class="delete" @click="deleteQuestionQuiz(question)">
                        <img class="logo" src="@/assets/icons/delete-red.webp" alt="delete_btn"/>
                    </div>
                </div>


                <div class="question-header">
                    <h2>{{ question.title }}</h2>
                    <p v-if="quiz.type === 'anime'">Picture link : {{ question.picture }}</p>
                </div>
                <div class="answer" v-for="answer in question.answers" :key="answer.id">
                    <div class="answer-correct-div">
                        <img v-if="question.correct_answers.includes(answer.id)"
                        src="@/assets/icons/checkmark-icon.png" alt="correct" class="checkmark-icon"/>
                    </div>
                    <div :class="{correct : question.correct_answers.includes(answer.id), answercontent: true}">
                        <p>{{ answer.content }}</p>
                    </div>
                </div>
            </div>
            <div class="styledDiv-pretty">
                <h2>Add question</h2>
                <div class="edit" @click="addQuestion">
                    <img class="add-button" src="@/assets/icons/plus-button.png" alt="add-button"/>
                </div>
            </div>
        </div>
        <div>
            <p class="error-message">{{ this.quizzesMessage }}</p>
        </div>
        <div id="button-div-edit-page">
            <router-link class="styledButton-brown-minor" style="text-decoration: none;" to="/quiz">Go Back</router-link>
            <button class="styledButton-red" @click="saveQuiz">Save</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { globalColors } from '@/utils/GlobalVariable';
    import { inject } from 'vue';
    import {checkAuth} from "@/utils/utils";

    export default {
        setup(){
            const sessionToken = inject('sessionToken');
            const isAdmin = inject('isAdmin');
            return {
                sessionToken,
                isAdmin
            };
        },
        data() {

            return {
                quiz: {
                    name: '',
                    content: []
                },
                quizzesMessage :"",
                dialodMessage : '',
                isEditingTitle: false,
                permitted : 0,
                newQuizName : '',
                globalColors : globalColors,
                isTitleForm : false,
                isMainAttributesForm : false,
                isQuestionForm : false,
                isAddingQuestionForm : false,
                editedQuestion : null,
                editedMainAttributes : null,
                editedTitle : '',
                isAlert : false,
                alert: {
                    title: '',
                    body: ''
                },
                isConfirmation : false,
                confirmation: {
                    title: '',
                    body: '',
                    result: null
                }
            }
        },
        methods : {
            async isOwner(quizId){
                try {
                    let res = await axios.get('http://localhost:3000/quizzes/is-owner', {
                        params: {'quizId': quizId},
                        headers: {'Authorization': `Bearer ${this.sessionToken}`} 
                    });
                    if (res.status === 200 || res.status === 204){
                        return true;
                    } else {
                        console.error("Error accessing editing quiz mode for "+this.quiz.id+"\nStatus code: "+res.status)
                        return false;
                    }
                } catch (err){
                    console.error("Error accessing editing quiz mode for "+this.quiz.id+"\nError code: "+err)
                    return false;
                }
            },
            saveQuizTitle(){
                this.quiz.name = this.newQuizName;
            },
            editMainAttributes() {
                this.editedMainAttributes = {type: this.quiz.type, difficultylevel: this.quiz.difficultylevel};
                this.isMainAttributesForm = true;
            },
            saveMainAttributes(){
                this.quiz.type = this.editedMainAttributes.type;
                this.quiz.difficultylevel = this.editedMainAttributes.difficultylevel;
                this.isMainAttributesForm = false;
            },
            editQuestionQuiz(question){
                this.editedQuestion = {
                    "id": question.id,
                    "title": question.title,
                    "answers": question.answers, // pbm de pointeurs...
                    "picture": question.picture,
                    "correct_answers": question.correct_answers
                };
                this.isQuestionForm = true;
            },
            deleteQuestionQuiz(question){
                this.isConfirmation = true;
                this.confirmation.result = null;
                this.confirmation.title = 'Cautious !';
                this.confirmation.body = 'You are about to delete this question. Are you sure you want to continue ?';
                const unwatchConfirmation = this.$watch(
                    () => this.confirmation.result,
                    (newVal) => {
                        if (newVal === true){
                            this.quiz.content = this.quiz.content.filter(elt => elt.id != question.id);
                            this.quiz.content = this.quiz.content.filter(elt => elt.id != question.id);
                        }
                        unwatchConfirmation();
                    }
                );

            },
            deleteAnswer(answerId){
                this.editedQuestion.answers = this.editedQuestion.answers.filter(elt => elt.id !== answerId);
                this.editedQuestion.correct_answers = this.editedQuestion.correct_answers.filter(elt => elt != answerId);
            },
            addAnswer(){
                if (this.editedQuestion.answers.length <= 3) {
                    this.editedQuestion.answers.push({
                        id: this.editedQuestion.answers[this.editedQuestion.answers.length -1].id + 1,
                        content: ""
                    })
                }
            },
            checkboxChangeHandler(event, answerId){
                if (event.target.checked){
                    this.editedQuestion.correct_answers.push(answerId);
                } else {
                    this.editedQuestion.correct_answers = this.editedQuestion.correct_answers.filter(elt => elt !== answerId);
                }
            },
            addQuestion(){
                if (this.quiz.content.length > 0){
                    this.editedQuestion = {
                        "id": this.quiz.content[this.quiz.content.length - 1].id + 1,
                        "title": "",
                        "answers": [
                            {
                                "id": 0,
                                "content": ""
                            },
                            {
                                "id": 1,
                                "content": ""
                            }
                        ],
                        "picture": "",
                        "correct_answers": []
                    };
                } else {
                    this.editedQuestion = {
                        "id": 0,
                        "title": "",
                        "answers": [
                            {
                                "id": 0,
                                "content": ""
                            },
                            {
                                "id": 1,
                                "content": ""
                            }
                        ],
                        "picture": "",
                        "correct_answers": []
                    };
                }

                this.isAddingQuestionForm = true;
            },
            saveQuestion(){
                if (this.editedQuestion.correct_answers.length === 0){
                    this.dialodMessage = 'Please select at least one correct answer !';
                } else if (this.editedQuestion.title.length === 0){
                    this.dialodMessage = 'Please fill the title of the question !';
                } else {
                    let index = this.quiz.content.findIndex(elt => elt.id === this.editedQuestion.id);
                    this.quiz.content[index] = this.editedQuestion;
                    this.dialodMessage = "";
                    this.isQuestionForm = false;
                }
            },
            saveAddedQuestion(){
                if (this.editedQuestion.correct_answers.length === 0){
                    this.dialodMessage = 'Please select at least one correct answer !';
                } else if (this.editedQuestion.title.length === 0){
                    this.dialodMessage = 'Please fill the title of the question !';
                } else {
                    this.dialodMessage = '';
                    this.quiz.content.push(this.editedQuestion);
                    this.isAddingQuestionForm = false;
                }

            },
            async saveQuiz(){
                if (this.quiz.type === 'anime'){
                    for (let i in this.quiz.content){
                        if (this.quiz.content[i].picture === ''){
                            this.alert.title = 'Please complete all required field before submission';
                            this.alert.body = `You have not provided a picture link for the question : ${this.quiz.content[i].title}`;
                            this.isAlert = true;
                            return;
                        }
                    }
                }
                if (this.quiz.content.length === 0){
                    this.alert.title = 'Empty quiz cannot be submitted';
                    this.alert.body = 'This quiz contains no questions. Please create at least one question for this quiz.';
                    this.isAlert = true;
                    return;
                }
                try {
                    let res = await axios.post(
                        `http://localhost:3000/quizzes/edit/${this.quiz.id}`,
                        {'editedQuiz': this.quiz},
                        {
                            headers: {
                                Authorization: `Bearer ${this.sessionToken}`,
                            },
                        });
                    if (res.status === 200){
                        this.alert.title = 'Success';
                        this.alert.body = 'Your changes has been saved successfully !';
                        this.isAlert = true;
                        const unwatchAlert = this.$watch(
                            () => this.isAlert,
                            (newVal) => {
                                if (!newVal) {
                                    this.$router.push('/quiz');
                                    unwatchAlert();
                                }
                            }
                        );
                    }
                } catch (err) {
                    console.error(err);
                    this.alert.title = 'Error';
                    if (err.response.status === 404) {
                        this.alert.body = "Oops... The quiz you try to edit does not exist... ";
                    } else if (err.response.status === 500) {
                        this.alert.body = "Oops... The server is currently unavalable...";
                    } else if (err.response.status === 400) {
                        this.alert.body = "Oops... Invalid request to the server has been made...";
                    } else {
                        this.alert.body = "Oops... The quizzes could not be loaded... ";
                    }
                    this.isAlert = true;
                }

            }
        },
        mounted() {
            const getQuiz = async () => {
                try {
                    let quizId = this.$route.query.quizId;
                    let res = await axios.get(`http://localhost:3000/quizzes/${quizId}`, {
                        headers: {'Authorization': `Bearer ${this.sessionToken}`}
                    });

                    if (res.status === 200 || res.status === 304) {
                        this.quiz = res.data[0];
                        if (!(this.quiz.content instanceof Array)) {
                            this.quiz.content = JSON.parse(this.quiz.content);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    if (err.response.status === 401) {
                        this.quizzesMessage = "Oops... Unauthorized to fetch quiz"
                    } else if (err.response.status === 404) {
                        this.quizzesMessage = "Oops... The quiz could not be found... ";
                    } else if (err.response.status === 500) {
                        this.quizzesMessage = "Oops... The server is currently unavalable...";
                    } else if (err.response.status === 400) {
                        this.quizzesMessage = "Oops... Invalid request to the server has been made...";
                    } else {
                        this.quizzesMessage = "Oops... The quizzes could not be loaded... ";
                    }
                }
            };
            getQuiz().then(async () => {
                if (this.isAdmin) {
                    this.permitted = true
                    return
                }
                this.permitted = await this.isOwner(this.quiz.id);
            }
            ).catch((err) => {
                    this.quizzesMessage = "Oops... The quizzes could not be loaded";
                    console.error(err);
                }
            )

            checkAuth(this.sessionToken).then(res => {
                if (!res.data.data.ownerId == this.quiz.id) {
                    this.$router.push({path: '/auth', query: {form: 'login/signup', redirect: '/quiz'}});
                }
            }).catch(() => {
                this.$router.push({path: '/auth', query: {form: 'login/signup', redirect: '/quiz'}});
            })
        }
    }
</script>

<style scoped>

.dialog{
    background: v-bind('globalColors.lightColor');
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
.edit-div {
    color : v-bind('globalColors.darkColor');
    margin-top: 10px;
    margin-bottom: 20px;
}
.field {
    display: flex;
    align-items: center;
    justify-content: center;
    color: v-bind('globalColors.darkColor');
}

.main-attributes {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.main-attributes-body{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-attributes-body > div{
    display: flex;
    justify-content: space-around;
    max-width: 30%;
}

.main-attributes-header {
    justify-content: center;
    display: flex;
    align-items: center;
}
.main-attributes-header > * {
    margin: 7px;
}
.editing-logo {
    width: 50px;
    height: 50px;
}

.minor-editing-logo {
    width: 30px;
    height: 30px;
}
.quiz-content {
    display: flex;
    flex-wrap: wrap;
}
.edit-logo-question-div {
    display: flex;
    flex-direction: row-reverse;
    justify-items: right;
    margin-bottom: 0px;
    padding-top: 0px;
}
.edit-logo-question-div:hover {
    cursor: pointer;
}
.question-header {
    display: flex;
    align-items: center;
}

.question-header > h2 {
    font-size: 22px;
    padding: 0px 10px;
    margin: 0px 10px;
}
.answer {
    display: flex;
    align-items: center;
    justify-content: center;
}

.answer-correct-div {
    width: 30px;
    height: 30px;
}

.checkmark-icon {
    width: 30px;
    height: 30px;
}

.answercontent {
    margin: 10px;
    border: 2px solid v-bind('globalColors.lightColor');
    padding: 0px 10px;
    border-radius: 20px;
}

.answercontent.correct {
    border-color: #83cf8f;
}
.answercontent > p {
    margin: 10px;
    padding: 0px;
}

#button-div-edit-page > * {
    margin: 5px;
}

#questions-editing-logo {
    display: flex;
    justify-content: flex-end;
}

.confirmation-div-button {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-items: center;
}

.confirmation-div-button > button {
    margin: 5px;
}

.delete-answer-button {
    width :20px;
    height : 20px;
    transform: rotate(45deg);
}

.delete-answer:hover {
    cursor: pointer;
    transform: scale(1.3);
}
.delete-answer:active {
    transform: scale(0.95);
}
.delete-answer {
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    background-color: rgba(0, 0, 0, 0);
    filter: brightness(0) saturate(100%) invert(6%) sepia(9%) saturate(5442%) hue-rotate(321deg) brightness(115%) contrast(86%);
}
</style>