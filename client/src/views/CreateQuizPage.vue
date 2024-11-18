<template>
    <div>
        <div class="init-quiz" v-if="!init">
            <h1>Create a quiz</h1>
            <form @submit.prevent="initQuiz">
                <label for="quizName">Quiz name</label>
                <input type="text" id="quizName" name="quizName" v-model="quizName" required>
                <label for="quizDifficulty">quizDifficulty</label>
                <select name="quizDifficulty" id="quizDifficulty" v-model="quizDifficulty" required>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
                <label for="quizType">Quiz type</label>
                <select id="quizType" name="quizType" v-model="quizType">
                    <option value="simple" selected>Normal Quiz</option>
                    <option value="anime">Anime Quiz</option>
                </select>
                <button type="submit">Create quiz</button>
            </form>
            <p> {{ quizDifficulty }}</p>
        </div>
        <div class="questions" v-else :key="regenateKey">
            <form @submit.prevent="submitQuestions">
                <div class="question" v-for="question in quizQuestions" :key="question.id">
                    <p>Question {{ question.id }}</p>

                    <label for="title">Title : </label>
                    <input :name="'title-' + question.id" type="text" required>
                    <label for="picture" v-if="quizType === 'anime'">Picture link : </label>
                    <input :name="'picture-' + question.id" v-if="quizType === 'anime'" type="text" required>
                    <p>Answers :</p>x
                    <div v-for="answer in question.answers || []" :key="answer.id">
                        <input :name="'checkbox-' + question.id + '-' + answer.id" type="checkbox" value="coucou">
                        <input :name="'answer-' + question.id + '-' + answer.id + '-value'" type="text" required>
                        <button @click="deleteAnswer(question.id, answer.id)" type="button"
                            v-if="question.answers.length > 2">Delete Answer</button>
                    </div>
                    <button @click.prevent="addAnswer(question.id)" type="button"
                        v-if="question.answers.length <= 3">Add anwser choice</button>

                    <button type="button" @click="deleteQuestion(question.id)" v-if="quizQuestions.length > 1">Delete
                        question {{ question.id }}</button>
                </div>
                <button @click="addQuestion" type="button">Add Question</button>
                <button type="submit">Valider Formulaire</button>
            </form>
        </div>
    </div>
</template>

<script>
import { inject } from "vue";
import axios from "axios";



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
            regenateKey: 0
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
            this.quizQuestions.push(newQuestion);
            this.addAnswer(newQuestion.id);
            this.addAnswer(newQuestion.id);
            this.regenateKey++;
            console.log("ad", this.quizQuestions);
        },
        deleteQuestion(id) {
            console.log("avant");
            console.log(this.quizQuestions);
            this.quizQuestions = this.quizQuestions.filter(elt => elt.id !== id);
            console.log("apres")
            console.log(this.quizQuestions);
            this.regenateKey++;
            console.log("Delete question ", this.quizQuestions);

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
            console.log(`Deleting answer ${questionId} -> ${answerId}`);
            let targetQuestion = this.quizQuestions.find(elt => elt.id === questionId);
            let index = this.quizQuestions.findIndex(elt => elt.id === questionId);
            if (targetQuestion !== undefined && targetQuestion.answers !== undefined) {
                console.log("filtering result" + targetQuestion.answers.filter(elt => elt.id !== answerId));
                this.quizQuestions[index].answers = targetQuestion.answers.filter(elt => elt.id !== answerId);
                console.log(this.quizQuestions)
            }
        },
        async submitQuestions(submitEvent) {
            let questions = [];
            for (let elt of submitEvent.target.elements) {
                if (elt.name && (elt.name.search('title') !== -1 || elt.name.search('checkbox') !== -1 || elt.name.search('answer') !== -1)) {
                    let splitted = elt.name.split('-');
                    let type = splitted[0];
                    switch (type) { // a rajouter pictures
                        case "title": {
                            questions.push({
                                "title": elt.value,
                                "picture": "",
                                "answers": [],
                                "correct_answers": []
                            });
                            break;
                        }
                        case "checkbox": { // a changer dans correct answers
                            if (elt.checked) {
                                questions[splitted[1]].correct_answers.push(splitted[2]);
                            }
                            break
                        }
                        case "answer": { // should be ok
                            questions[splitted[1]].answers.push({
                                "id": splitted[2],
                                "content": elt.value
                            });
                            break
                        } case "picture": {
                            questions[splitted[1]].picture = elt.value;
                            break;
                        } default: {
                            throw Error("Input type not expected");
                        }

                    }
                }

            }
            if (this.validateForm(questions)) {
                this.waiting = true;
                await this.createQuiz(questions);
                this.waiting = false;
            } else {
                alert("Quiz not correct");
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
        async createQuiz(questions) {
            await axios.post('http://localhost:3000/create', { quizName: this.quizName, quizDifficulty: this.quizDifficulty, quizType: this.quizType, quizQuestions: JSON.stringify(questions), ownerId: this.userId })
                .then(response => {
                    if (response.status === 201) {
                        alert('Quiz created');
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


<style scoped></style>