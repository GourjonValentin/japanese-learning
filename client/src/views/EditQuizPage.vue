<template>
    <div v-if="this.permitted === false">
        <h3>You are unauthorized to acces this page</h3>
    </div>
    <div v-else>
        <div class="flex">
            <h2>{{ quiz.name }}d</h2>
            <div @click="toggle-edit">
                <img src="../assets/pencil-icon.png" alt="edit_btn"/>
            </div>
        </div>
        <div>
            <p class="error-message">{{ this.quizzesMessage }}</p>
        </div>
    </div>
    <router-link class="styledButton" style="text-decoration: none;" to="/quiz">Go Back</router-link>
</template>

<script>
    import axios from 'axios';
    import { inject } from 'vue';

    export default {
        setup(){
            const sessionToken = inject('sessionToken');
            return {
                sessionToken
            };
        },
        data() {
            return {
                quiz: {
                    name: '',
                    content: []
                },
                quizzesMessage :"",
                permitted : 0
            }
        },
        methods : {
            async isOwner(quizId){
                try {
                    let res = await axios.get('http://localhost:3000/is-quiz-owner', {
                        params: {'quizId': quizId},
                        headers: {'Authorization': `Bearer ${this.sessionToken}`} 
                    });
                    if (res.status === 200 || res.status === 204){
                        return true;
                    } else {
                        console.error("Error accessing editing quizz mode for "+this.quiz.id+"\nStatus code: "+res.status)
                        return false;
                    }
                } catch (err){
                    console.error("Error accessing editing quizz mode for "+this.quiz.id+"\nError code: "+err)
                    return false;
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
            getQuiz().then(async () => {
                this.permitted = await this.isOwner(this.quiz.id);
            }
            ).catch((err) => {
                    this.quizzesMessage = "Oops... The quizzes could not be loaded";
                    console.error(err);
                }
            )
        }

    }
</script>