<template>
    <div class="search">
        <h2>Search Div</h2>
    </div>
    <div class="quiz-category">
        <div>
            Simple Quiz
        </div>
        <div>
            Anime Quiz
        </div>
    </div>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';
    import { globalTitle } from '../utils/GlobalVariable';

    export default {
        data() {
            return {
                title: globalTitle,
                globalColors : globalColors
            };
        }
    };
</script>
  
<style>
    * { /* why necessary ?????? */
        color: v-bind(globalColors.darkColor);
    }
    .search {
        margin: 20px;
        padding : 10px;
        border: 2px solid ;
        border-radius: 20px;
        border-color: v-bind(globalColors.darkColor);
    }

    .quiz-category {
        display: flex;
        justify-content: center;
        gap : 50px;
        align-items: center;
        margin: 50px;
        padding : 40px;
        border: 2px solid ;
        border-radius: 20px;
        border-color: v-bind(globalColors.darkColor);
    }
</style>
  