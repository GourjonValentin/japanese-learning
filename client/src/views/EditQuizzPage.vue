<template>
    <div v-if="this.permitted === false">
        <h2>You are unauthorized to acces this page</h2>
        <router-link class="styledButton-red" style="text-decoration: none;" to="/quizz">Go Back</router-link>
    </div>
    <div v-else class="edit-div">

        <div class="dialog-overlay" id="titleForm" v-if="isTitleForm">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>Change Title</h2>
                    <div @click="() => {isTitleForm = false}" class="close-icon">
                        <img src="@/assets/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                        <form @submit.prevent="() => {quizz.name = editedTitle; isTitleForm = false;}">
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
                        <img src="@/assets/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                        <form @submit.prevent="saveMainAttributes">
                            <div>
                                <label for="quizzDifficulty">Difficulty :</label>
                                <div class="styledSelectInput">
                                    <select name="quizzDifficulty" id="quizzDifficulty" v-model="editedMainAttributes.difficultylevel" required>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label for="quizzType">Quizz type</label>
                                <div class="styledSelectInput">
                                    <select id="quizzType" name="quizzType" v-model="editedMainAttributes.type">
                                        <option value="simple" selected>Normal Quizz</option>
                                        <option value="anime">Anime Quizz</option>
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
                        <img src="@/assets/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                    <form @submit.prevent="saveQuestion">
                        <label for="title">Question Title : </label>
                        <input class="styledInput" type="text" v-model = editedQuestion.title>
                        <label for="picture" v-if="this.quizz.type === 'anime'">Picture link : </label>
                        <input class="styledInput" v-if="this.quizz.type === 'anime'" type="text" v-model="editedQuestion.picture" required>
                        <p>Answers :</p>
                        <div class="answers" v-for="answer in editedQuestion.answers || []" :key="answer.id">
                            <input type="checkbox" :checked="this.editedQuestion.correct_answers.includes(answer.id)" @change="checkboxChangeHandler($event, answer.id)">
                            <input class="styledInput" type="text" v-model=answer.content required>
                            <button @click.prevent="deleteAnswer(answer.id)" type="button"
                                    v-if="editedQuestion.answers.length > 2">
                                <img src="@/assets/katana.png" alt="delete Answer" width="20px" height="20px">
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
                        <img src="@/assets/katana_cross.png" alt="Close">
                    </div>
                </div>
                <div class="dialog-body">
                    <form @submit.prevent="saveAddedQuestion">
                        <label for="title">Question Title : </label>
                        <input class="styledInput" type="text" v-model = editedQuestion.title>
                        <label for="picture" v-if="this.quizz.type === 'anime'">Picture link : </label>
                        <input class="styledInput" v-if="this.quizz.type === 'anime'" type="text" v-model="editedQuestion.picture" required>
                        <p>Answers :</p>
                        <div class="answers" v-for="answer in editedQuestion.answers || []" :key="answer.id">
                            <input type="checkbox" :checked="this.editedQuestion.correct_answers.includes(answer.id)" @change="checkboxChangeHandler($event, answer.id)">
                            <input class="styledInput" type="text" v-model=answer.content required>
                            <button @click.prevent="deleteAnswer(answer.id)" type="button"
                                    v-if="editedQuestion.answers.length > 2">
                                <img src="@/assets/katana.png" alt="delete Answer" width="20px" height="20px">
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
            <h1>{{ quizz.name }}</h1>
            <div @click="()=>{editedTitle = quizz.name; isTitleForm = true;}" >
                <img src="../assets/pencil-icon.png" alt="edit_btn" class="editing-logo"/>
            </div>
        </div>
        <div class="main-attributes styledDiv">
            <div class="main-attributes-header">
                <h2>Main Attributes</h2>
                <div @click="editMainAttributes" >
                    <img src="../assets/pencil-icon.png" alt="edit_btn" class="minor-editing-logo"/>
                </div>
            </div>
            <div class="main-attributes-body">
                <div>
                    <p>Difficulty level :</p>
                    <p>{{ quizz.difficultylevel }}</p>
                </div>
                <div>
                    <p>Type :</p>
                    <p>{{ quizz.type }}</p>
                </div>
            </div>
        </div>
        <h2>Questions</h2>
        <div class="quizz-content">
            <div class="styledDiv-pretty" v-for="question in quizz.content" :key="question.id">
                <div id="questions-editing-logo">
                    <div class="edit-logo-question-div" @click="deleteQuestionQuizz(question)">
                        <img class="minor-editing-logo" src="@/assets/delete.webp" alt="delete_btn"/>
                    </div>
                    <div class="edit-logo-question-div" @click="editQuestionQuizz(question)">
                        <img class="minor-editing-logo" src="../assets/pencil-icon.png" alt="edit_btn"/>
                    </div>
                </div>
                
                
                <div class="question-header">
                    <h2>{{ question.title }}</h2>
                    <p v-if="quizz.type === 'anime'">Picture link : {{ question.picture }}</p>
                </div>
                <div class="answer" v-for="answer in question.answers" :key="answer.id">
                    <div class="answer-correct-div">
                        <img v-if="question.correct_answers.includes(answer.id)"
                        src="@/assets/checkmark-icon.png" alt="correct" class="checkmark-icon"/>
                    </div>
                    <div :class="{correct : question.correct_answers.includes(answer.id), answercontent: true}">
                        <p>{{ answer.content }}</p>
                    </div>
                </div>
            </div>
            <div class="styledDiv-pretty">
                <h2>Add question</h2>
                <div @click="addQuestion">
                    <img class="add-button" src="@/assets/plus-button.png" alt="add-button"/>
                </div>
            </div>
        </div>
        <div>
            <p class="error-message">{{ this.quizzesMessage }}</p>
        </div>
        <div id="button-div-edit-page">
            <router-link class="styledButton-brown-minor" style="text-decoration: none;" to="/quizz">Go Back</router-link>
            <button class="styledButton-red" @click="saveQuizz">Save</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { globalColors } from '@/utils/GlobalVariable';
    import { inject } from 'vue';

    export default {
        setup(){
            const sessionToken = inject('sessionToken');
            return {
                sessionToken,
            };
        },
        data() {

            return {
                quizz: {
                    name: '',
                    content: []
                },
                quizzesMessage :"",
                dialodMessage : '',
                isEditingTitle: false,
                permitted : 0,
                newQuizzName : '',
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
            async isOwner(quizzId){
                try {
                    let res = await axios.get('http://localhost:3000/is-quizz-owner', {
                        params: {'quizzId': quizzId},
                        headers: {'Authorization': `Bearer ${this.sessionToken}`} 
                    });
                    if (res.status === 200 || res.status === 204){
                        return true;
                    } else {
                        console.error("Error accessing editing quizz mode for "+this.quizz.id+"\nStatus code: "+res.status)
                        return false;
                    }
                } catch (err){
                    console.error("Error accessing editing quizz mode for "+this.quizz.id+"\nError code: "+err)
                    return false;
                }
            },
            saveQuizzTitle(){
                this.quizz.name = this.newQuizzName;
            },
            editMainAttributes() {
                this.editedMainAttributes = {type: this.quizz.type, difficultylevel: this.quizz.difficultylevel};
                this.isMainAttributesForm = true;
            },
            saveMainAttributes(){
                this.quizz.type = this.editedMainAttributes.type;
                this.quizz.difficultylevel = this.editedMainAttributes.difficultylevel;
                this.isMainAttributesForm = false;
            },
            editQuestionQuizz(question){
                this.editedQuestion = {
                    "id": question.id,
                    "title": question.title,
                    "answers": question.answers, // pbm de pointeurs...
                    "picture": question.picture,
                    "correct_answers": question.correct_answers
                };
                this.isQuestionForm = true;
            },
            deleteQuestionQuizz(question){
                // faire un confirm stylisé ??
                this.isConfirmation = true;
                this.confirmation.result = null;
                this.confirmation.title = 'Cautious !';
                this.confirmation.body = 'You are about to delete this question. Are you sure you want to continue ?';
                const unwatchConfirmation = this.$watch(
                    () => this.confirmation.result,
                    (newVal) => {
                        if (newVal === true){
                            this.quizz.content = this.quizz.content.filter(elt => elt.id != question.id);
                            this.quizz.content = this.quizz.content.filter(elt => elt.id != question.id);
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
                if (this.quizz.content.length > 0){
                    this.editedQuestion = {
                        "id": this.quizz.content[this.quizz.content.length - 1].id + 1,
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
                    let index = this.quizz.content.findIndex(elt => elt.id === this.editedQuestion.id);
                    this.quizz.content[index] = this.editedQuestion;
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
                    this.quizz.content.push(this.editedQuestion);
                    this.isAddingQuestionForm = false;
                }
                
            },
            async saveQuizz(){
                if (this.quizz.type === 'anime'){
                    for (let i in this.quizz.content){
                        if (this.quizz.content[i].picture === ''){
                            this.alert.title = 'Please complete all required field before submission';
                            this.alert.body = `You have not provided a picture link for the question : ${this.quizz.content[i].title}`;
                            this.isAlert = true;
                            return;
                        }
                    }
                }
                if (this.quizz.content.length === 0){
                    this.alert.title = 'Empty quizz cannot be submitted';
                    this.alert.body = 'This quizz contains no questions. Please create at least one question for this quizz.';
                    this.isAlert = true;
                    return;
                }
                try {
                    let res = await axios.post(
                        `http://localhost:3000/edit-quizz/${this.quizz.id}`,
                        {'editedQuizz': this.quizz},
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
                                    this.$router.push('/quizz');
                                    unwatchAlert();
                                }
                            }
                        );
                    }
                } catch (err) {
                    console.log(err)
                    this.alert.title = 'Error';
                    if (err.response.status === 404) {
                        this.alert.body = "Oops... The quizz you try to edit does not exist... ";
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
            getQuizz().then(async () => {
                this.permitted = await this.isOwner(this.quizz.id);
            }
            ).catch((err) => {
                    this.quizzesMessage = "Oops... The quizzes could not be loaded";
                    console.error(err);
                }
            )
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
    justify-content: center;
}
.main-attributes-body > div{
    display: flex;
    justify-content: space-around;
    max-width: 60%
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
.quizz-content {
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
    align-items: center;
    justify-items: center;
}

.confirmation-div-button > button {
    margin: 5px;
}
</style>