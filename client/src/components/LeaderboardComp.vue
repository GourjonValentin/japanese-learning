<template>
    <div v-if="scoresList.length !== 0">

        <h4>Leaderboard</h4>
        <div class="element" v-for="elt of scoresList" :key="elt.score">
            {{ elt.username }} : {{ elt.score }}
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {globalColors} from "@/utils/GlobalVariable";

export default {
    props : ["quizId"],
    setup () {

    },
    data() {
        return {
            scoresList: [],
            globalColors: globalColors
        };
    },
    methods : {
        async getScores(quizId) {
            await axios.get(`http://localhost:3000/scores/${quizId}`).then((res, err) => {
                if (res.status === 200) {
                    this.scoresList = res.data;
                } else if (res.status === 204) {
                    this.scoresList = [];
                } else if (res.status === 500) {
                    this.scoresList = [];
                    console.error(err);
                } else {
                    console.error("Error in response status : " + res.status)
                }
            })
        }
    },
    mounted() {
        this.getScores(this.quizId)
    },
    quizId() {

    }
}


</script>

<style scoped>
    div {
        background-color: v-bind("globalColors.brownColor");
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border-radius: 20px;
        border: 2px solid v-bind("globalColors.darkColor");

    }

</style>