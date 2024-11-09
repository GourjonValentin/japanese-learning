<template>
    <div>
        <h1>Create a quiz</h1>
        <form>
            <label for="quizName">Quiz name</label>
            <input type="text" id="quizName" name="quizName" v-bind="quizName">
            <label for="quizDescription">Quiz description</label>
            <input type="text" id="quizDescription" name="quizDescription" v-bind="quizDescription">
            <label for="quizType">Quiz type</label>
            <select id="quizType" name="quizType" v-bind="quizType">
                <option value="simple" selected>Normal Quiz</option>
                <option value="anime">Anime Quiz</option>
            </select>
            <button type="submit">Create quiz</button>
        </form>
    </div>
</template>

<script>
    import {inject} from "vue";
    import axios from "axios";

    export default {
        data() {
            return {
                quizName: "",
                quizDescription: "",
                quizType: "simple",
                quizQuestions: []
            };
        },
        setup() {
            const sessionToken = inject('sessionToken');
            return {
                sessionToken
            }
        },
        methods: {
            async createQuiz() {
                await axios.post('http://localhost:3000/quiz', { quizName: this.quizName, quizDescription: this.quizDescription, quizQuestions: this.quizQuestions })
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
            axios.get('http://localhost:3000/auth/check', {
                sessionToken: this.sessionToken
            }).catch(error => {
                if (error.status === 401) {
                    console.log('Invalid token');
                }
            });
        }
    };

</script>


<style scoped>

</style>