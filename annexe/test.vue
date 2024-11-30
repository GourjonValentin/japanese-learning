<template>
    <form @submit.prevent="submitForm">
      <div v-for="number in generatedNumbers" :key="number">
        <!-- Liaison bidirectionnelle avec v-model -->
        <label>
          <input 
            type="checkbox" 
            :value="number" 
            v-model="checkedNumbers" 
          />
          {{ number }}
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  
    <!-- Debug pour visualiser les valeurs cochées -->
    <p>Checked Numbers: {{ checkedNumbers }}</p>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      // Tableau réactif pour stocker les numéros générés
      const generatedNumbers = ref([]);
      // Tableau réactif pour stocker les numéros cochés
      const checkedNumbers = ref([]);
  
      // Génération des numéros aléatoires
      const generateRandomNumbers = () => {
        const numbers = [];
        const numberOfNumbers = Math.floor(Math.random() * 4) + 1; // Entre 1 et 4 numéros
        for (let i = 0; i < numberOfNumbers; i++) {
          numbers.push(Math.floor(Math.random() * 100)); // Numéros entre 0 et 99
        }
        generatedNumbers.value = numbers;
      };
  
      // Soumission du formulaire
      const submitForm = () => {
        console.log('Checked Numbers:', checkedNumbers.value); // Les numéros cochés
      };
  
      // Génère les numéros au chargement du composant
      generateRandomNumbers();
  
      return {
        generatedNumbers,
        checkedNumbers,
        submitForm,
      };
    },
  };
  </script>
  