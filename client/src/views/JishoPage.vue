<template>
    <div>
        <h3>English-Japanese Dictionary</h3>

        <div class="searching-menu">
            <div class="language-select">
                <!-- Switch between English and Japanese -->
                <button @click="toggleEngToJap()" :class="{ 'selected': englishToJapanese === true}">English to Japanese
                </button>
                <button @click="toggleJapToEng()" :class="{ 'selected': japaneseToEnglish === true}">Japanese to English
                </button>
            </div>
            <!-- Search bar -->
            <form @submit.prevent="translate" class="search-form">
                <input type="text" placeholder="Search for a word" v-model="searchWord" class="search-input">
                <button class="search-button">Search</button>
            </form>
        </div>
        

        <!-- Display the word and its translation -->
        <div class="response" v-bind:hidden="translation === []">
            <p>Searching for Word: {{ searchWord }}</p>
            <div class="loading">
                <img v-bind:hidden="!loading" src="@/assets/chop-spedup.gif" alt="Loading ..." width="200" height="150">
            </div>
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
            globalColors: globalColors,
            loading: false
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
        toggleLoading() {
            // Toggle the loading state
            this.loading = !this.loading;
        },
        async translate() {
            this.toggleLoading()
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
            this.toggleLoading()
        },
    },
    mounted() {
        this.englishToJapanese = true;
        this.japaneseToEnglish = false;
    }
}
</script>

<style scoped>
    .searching-menu {
        display: flex;
        align-items: center;
        gap: 20px;
        margin: 30px 0;
        padding: 20px;
    }

    .language-select {
        display: flex;
        gap: 10px;
    }

    .language-select > button {
        background-color: v-bind('globalColors.lightColor');
        border: 2px solid v-bind('globalColors.darkColor');
        border-radius: 20px;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        margin: 4px 2px;
        cursor: pointer;
    }

    .language-select > button:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
        transition: background-color 0.3s, transform 0.2s;
    }

    .language-select > button.selected {
        background-color: v-bind('globalColors.darkColor');
        color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .search-form {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        max-width: 500px;
    }

    .search-input {
        flex: 1;
        padding: 10px 15px;
        font-size: 16px;
        border: 2px solid v-bind('globalColors.darkColor');
        border-radius: 25px;
        outline: none;
        transition: border-color 0.3s;
    }

    .search-input:focus {
        border-color: v-bind('globalColors.brownColor');
    }

    .search-button {
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: v-bind('globalColors.darkColor');
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .search-button:hover {
        background-color: v-bind('globalColors.brownColor');
        transform: scale(1.05);
    }

    .search-button:active {
        transform: scale(0.95);
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
