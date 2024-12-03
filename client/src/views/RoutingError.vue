<template>
    <div class="routing-error-container">
        <img src="@/assets/404-illustration.webp" alt="404 Error Illustration" class="error-image" />
        <div class="error-text">
            <!-- <p class="">Sorry, we can't seem to find the page you're looking for.</p> -->
            <button class="styledButton-red" @click="goHome">Go Back Home</button>
        </div>
    </div>
</template>
  
<script>
import router from '@/router';

export default {
    name: 'RoutingError',
    methods: {
        goHome() {
            router.push({ path: '/' });
        },
    },
};
</script>
  
<style scoped>
    .routing-error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 15px;
        text-align: center;
        min-height: 100vh;
        padding-bottom: 1rem;
    }
  
    .error-image {
        width: 80%;
        max-width: 800px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }
</style>