<template>
    <div class="leaderboard">

        <h3>Leaderboard</h3>
        <div v-if="scoresList.length !== 0">
            <div class="element" v-for="elt of scoresList" :key="elt.score">
                {{ elt.username }} : <i>{{ elt.score }}</i>
            </div>
        </div>
        <div v-else>
            <p>No attempt for this quiz yet!</p>
        </div>
        
    </div>
</template>

<script>
import axios from "axios";
import {globalColors} from "@/utils/GlobalVariable";

export default {
    props : ["quizzId"],
    setup () {

    },
    data() {
        return {
            scoresList: [],
            globalColors: globalColors
        };
    },
    methods : {
        async getScores(quizzId) {
            await axios.get(`http://localhost:3000/scores/${quizzId}`).then((res, err) => {
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
        this.getScores(this.quizzId)
    },
    quizzId() {

    }
}


</script>

<style scoped>
    .leaderboard {
        background-color: #f7e3cd;
        width: fit-content;
        min-height: 400px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px 40px;
        margin: 20px;
        border-radius: 20px;
        border: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
        flex-direction: column;
        position: relative;
    }

</style>