<template>
    <div>
        <p>English-Japanese Dictionary</p>
        <div class="language-select">
            <!-- Switch between English and Japanese -->
            <button @click="toggleEngToJap()" :class="{ 'selected': englishToJapanese === true}">English to Japanese
            </button>
            <button @click="toggleJapToEng()" :class="{ 'selected': japaneseToEnglish === true}">Japanese to English
            </button>
        </div>
        <!-- Search bar -->
        <form @submit.prevent="translate">
            <input type="text" placeholder="Search for a word" v-model="searchWord">
            <button>Search</button>
        </form>
        <!-- Display the word and its translation -->
        <div class="response" v-bind:hidden="!translation">
            <p>Searching for Word: {{ searchWord }}</p>
            <div v-for="tr in translation" :key="tr.id" class="tr-elt">
                <p class="jp-title">Japanese writting</p>
                <div v-for="japanese in tr.japanese" :key="japanese.id" class="jp">
                    <p class="jp-word" v-bind:hidden="!japanese.word">Word : {{ japanese.word }}</p>
                    <p class="jp-reading" v-bind:hidden="!japanese.reading">Reading : {{ japanese.reading }}</p>
                </div>
                <div class="en">
                    <p class="en-title">English meaning</p>
                    <div v-for="sense in tr.english" :key="sense.id" class="sense-elt">
                        <div v-for="mean in sense.english_definitions" :key="mean.id" class="mean-elt">
                            <p>{{ mean.def }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="error" v-bind:hidden="!error">
                <p>{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {parseTranslation} from '@/utils/utils';
import {globalColors} from "@/utils/GlobalVariable";

export default {
    data() {
        return {
            searchWord: "",
            translation: [],
            error: "",
            englishToJapanese: true,
            japaneseToEnglish: false,
            globalColors: globalColors
        };
    },
    methods: {
        toggleEngToJap() {
            // Switch to English to Japanese
            this.englishToJapanese = true;
            this.japaneseToEnglish = false;

        },
        toggleJapToEng() {
            // Switch to Japanese to English
            this.englishToJapanese = false;
            this.japaneseToEnglish = true;
        },
        async translate() {
            // Search for the word in the dictionnary

            // Preprocess the word
            let searchWord = this.searchWord;
            if (searchWord === "") {
                this.translation = "";
                return;
            } else if (searchWord.includes(" ")) {
                searchWord = searchWord.replace(" ", "%20");
            }

            // Get the translation
            const response = await axios.get(`http://localhost:3000/api/jisho?keyword=${searchWord}`);
            this.translation = parseTranslation(response.data);

        },
    },
    mounted() {
        this.englishToJapanese = true;
        this.japaneseToEnglish = false;
    }
}
</script>

<style scoped>
.language-select > button {
    background-color: v-bind('globalColors.white');
    border: 1px solid v-bind('globalColors.brown');
    color: v-bind('globalColors.black');
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}

.language-select > button.selected {
    background-color: v-bind('globalColors.brown');
}

.jp-title, .en-title {
    font-size: 20px;
    font-weight: bold;
}

.tr-elt {
    margin-top: 20px;
    border: 1px solid black;
    padding: 10px;
}

</style>
