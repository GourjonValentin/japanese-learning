<template>
    <div class="jisho-page">
        <h1 class="page-title">Japanese Dictionary</h1>
        <div class="searching-menu">
            <div class="language-select">
                <!-- Switch between English and Japanese -->
                <button
                    @click="toggleEngToJap()"
                    :class="{
                        'styledButton-brown': englishToJapanese === true,
                        'styledButton-brown-minor': englishToJapanese === false,
                    }"
                >
                    English to Japanese
                </button>
                <button
                    @click="toggleJapToEng()"
                    :class="{
                        'styledButton-brown': japaneseToEnglish === true,
                        'styledButton-brown-minor': japaneseToEnglish === false,
                    }"
                >
                    Japanese to English
                </button>
            </div>
            <!-- Search bar -->
            <form @submit.prevent="translate" class="search-form">
                <input
                    type="text"
                    placeholder="Search for a word"
                    v-model="searchWord"
                    class="search-input"
                />
                <button class="styledButton-red">Search</button>
            </form>
        </div>

        <!-- Display the word and its translation -->
        <div class="styledDiv-pretty" v-bind:hidden="translation == []">
            <div v-if="this.submitedSearchWord != ''">
                <p>Searching for Word: {{ submitedSearchWord }}</p>
                <div class="loading">
                    <img
                        v-bind:hidden="!loading"
                        src="@/assets/chop-spedup.gif"
                        alt="Loading ..."
                        width="200"
                        height="150"
                    />
                </div>
                <div v-if="translation.length > 0">
                    <div
                        v-for="tr in translation"
                        :key="tr.id"
                        class="styledDiv"
                    >
                        <p class="jp-title">Japanese writting</p>
                        <div
                            v-for="japanese in tr.japanese"
                            :key="japanese.id"
                            class="jp"
                        >
                            <p class="jp-word" v-bind:hidden="!japanese.word">
                                Word : {{ japanese.word }}
                            </p>
                            <p
                                class="jp-reading"
                                v-bind:hidden="!japanese.reading"
                            >
                                Reading : {{ japanese.reading }}
                            </p>
                        </div>
                        <div class="en">
                            <p class="en-title">English meaning</p>
                            <div
                                v-for="sense in tr.english"
                                :key="sense.id"
                                class="sense-elt"
                            >
                                <div
                                    v-for="mean in sense.english_definitions"
                                    :key="mean.id"
                                    class="mean-elt"
                                >
                                    <p>{{ mean.def }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>すみません! No Result !</p>
                </div>

                <div class="error" v-bind:hidden="!error">
                    <p>{{ error }}</p>
                </div>
            </div>

            <div v-else>
                <p>Your result will appear here !</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { parseTranslation } from "@/utils/utils";
import { globalColors } from "@/utils/GlobalVariable";

export default {
    data() {
        return {
            searchWord: "",
            submitedSearchWord: "",
            translation: [],
            error: "",
            englishToJapanese: true,
            japaneseToEnglish: false,
            globalColors: globalColors,
            loading: false,
        };
    },
    methods: {
        toggleEngToJap() {
            this.englishToJapanese = true;
            this.japaneseToEnglish = false;
        },
        toggleJapToEng() {
            this.englishToJapanese = false;
            this.japaneseToEnglish = true;
        },
        toggleLoading() {
            this.loading = !this.loading;
        },
        async translate() {
            this.submitedSearchWord = this.searchWord;
            this.toggleLoading();

            // Search for the word in the dictionnary
            let searchWord = this.searchWord;
            if (searchWord === "") {
                this.translation = "";
                this.toggleLoading();
                return;
            } else if (searchWord.includes(" ")) {
                searchWord = searchWord.replace(" ", "%20");
            }

            // Get the translation
            try {
                const response = await axios.get(
                    `http://localhost:3000/jisho?keyword=${searchWord}`
                );
                this.translation = parseTranslation(response.data);
            } catch (err) {
                console.error(err);
                this.translation = "";
            } finally {
                this.toggleLoading();
            }
        },
    },
    mounted() {
        this.englishToJapanese = true;
        this.japaneseToEnglish = false;
    },
};
</script>

<style scoped>
.searching-menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 30px 0;
    padding: 20px;
}

.language-select {
    display: flex;
    align-items: center;
    align-content: center;
    gap: 10px;
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 500px;
}

.search-button {
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 16px;
    color: #fff;
    background-color: v-bind("globalColors.darkColor");
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.search-button:hover {
    background-color: v-bind("globalColors.brownColor");
    transform: scale(1.05);
}

.search-button:active {
    transform: scale(0.95);
}

.jp-title,
.en-title {
    font-size: 20px;
    font-weight: bold;
}

.tr-elt {
    margin-top: 20px;
    border: 1px solid black;
    padding: 10px;
}

/* RESPONSIVE STYLES */
@media (max-width: 768px) {
    .jisho-page {
        padding: 15px;
    }

    .page-title {
        font-size: 2.5em;
        text-align: center;
    }

    .searching-menu {
        margin: 15px 0;
        flex-direction: column;
        gap: 15px;
    }

    .language-select {
        justify-content: center;
        gap: 10px;
    }

    .search-form {
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 10px;
    }

    .search-input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
    }

    .styledButton-red {
        padding: 10px 25px;
        font-size: 14px;
    }

    .styledDiv {
        font-size: 0.9em;
    }

    .jp-title, .en-title {
        font-size: 1.2em;
    }

    .jp, .en {
        margin-top: 10px;
    }

    .error {
        font-size: 0.9em;
        color: red;
        text-align: center;
    }
}
</style>
