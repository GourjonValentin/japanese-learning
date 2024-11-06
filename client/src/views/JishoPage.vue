<template>
  <div>
    <p>English-Japanese Dictionnary</p>
    <div class="language-select">
      <!-- Switch between English and Japanese -->
      <button @click="toggleEngToJap()" :class="{ 'selected': englishToJapanese === true}">English to Japanese</button>
      <button @click="toggleJapToEng()" :class="{ 'selected': japaneseToEnglish === true}">Japanese to English</button>
    </div>
    <!-- Search bar -->
    <form @submit.prevent="searchWord">
      <input type="text" placeholder="Search for a word" v-model="word">
      <button>Search</button>
    </form>
    <!-- Display the word and its translation -->
    <div class="response" v-bind:hidden="!translation">
      <p>Word: {{ word }}</p>
      <p>Translation: {{ translation }}</p>
    </div>
    <div class="error" v-bind:hidden="!error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        word: "",
        translation: "",
        error:"",
        englishToJapanese: true,
        japaneseToEnglish: false,
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
      async searchWord() {
        // Search for the word in the dictionnary
        let searchWord = this.word;
        if (searchWord === "") {
          this.translation = "";
          return;
        } else if (searchWord.includes(" ")) {
          searchWord = searchWord.replace(" ", "%20");
        }
        if (this.englishToJapanese) {
          // Search for the word in English
          const response = await axios.get(`http://localhost:3000/api/jisho?keyword=${searchWord}`);
          if (response.data.data.length > 0) {
            // Display the word and its translation
            this.translation = response.data.data[0].slug;
          } else {
            // Display an error message
            this.error = "Word not found";
            this.word = "";
            this.translation = "";
          }
        }
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
    background-color: white;
    border: 1px solid blue;
    color: blue;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}

.language-select > button.selected {
  background-color: blue;
  color: white;
}

</style>
