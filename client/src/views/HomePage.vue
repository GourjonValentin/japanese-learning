<template>
  <div class="landing-page">

    <!-- Header Section -->
    <section class="header-section">
      <div class="hero-section">
        <img src="@/assets/hero-image.jpg" alt="Japanese Culture" class="hero-image" />
        <div class="text-overlay">
          <h1 class="main-title">Master Japanese Today!</h1>
          <p class="subtitle">Learn the language with <strong>INTERACTIVE QUIZZES</strong> and <strong>THE BEST COMMUNITY</strong>.</p>
          <button class="cta-button" @click="goToQuizPage">Get started</button>
        </div>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="introduction-section">
      <h2>Why Learn Japanese?</h2>
      <p>
        Japanese opens doors to a rich culture, exciting career opportunities, and a vibrant community of learners.
        Our platform offers tools that make your learning <strong>engaging</strong>, <strong>effective</strong>, and <strong>fun</strong>.
      </p>
      <img src="@/assets/introduction-image.jpg" alt="Learning Japanese" class="intro-image" />
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <h2>Key Features</h2>
        <div class="features-grid">
            <div class="feature-item">
                <img src="@/assets/alphabet-icon.png" alt="Alphabet Learning" />
                <h3>Get the Basics Straight</h3>
                <p>Learn the main japanese alphabets through a unique interactive display.</p>
            </div>
            <div class="feature-item">
                <img src="@/assets/quiz-icon.png" alt="Interactive Lessons" />
                <h3>Interactive Quizzes</h3>
                <p>Learn through quizzes, inspired by mangas, imagined by us, or users.</p>
            </div>
            <div class="feature-item">
                <img src="@/assets/tracking-icon.png" alt="Progress Tracking" />
                <h3>Progress Tracking</h3>
                <p>Track your journey and improve on your previous quizzes.</p>
            </div>
            <div class="feature-item">
                <img src="@/assets/community-icon.png" alt="Community Support" />
                <h3>Community Support</h3>
                <p>Join a community of learners and native speakers.</p>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2>What Our Users Say</h2>
      <div class="testimonials">
        <blockquote>"This platform made learning Japanese easy and fun!"</blockquote>
        <cite>- Alex</cite>
        <blockquote>"I love the community and the quizzes. Highly recommended!"</blockquote>
        <cite>- Maya</cite>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer-section">
      <p>&copy; 2024 Louise Monciero - Valentin Gourjon - Fares Darghouth. All Rights Reserved.</p>
      <router-link to="/AboutUs">About Us</router-link>
    </footer>

  </div>
</template>

<script>
import { globalColors } from '@/utils/GlobalVariable';

export default {
    data() {
        return {
            globalColors: globalColors,
        }
    },methods: {
        goToQuizPage() {
            this.$router.push({ path: '/quiz' });
        }
    },
};
</script>

<style>
/* General Layout */
.landing-page {
  font-family: 'Montserrat', sans-serif;
}

/* Hero Section */
.header-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  text-align: center;
}
.hero-section {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}
.hero-image {
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}
.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  background-color: rgba(0, 0, 0, 0.45); /* Semi-transparent background */
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
}
.main-title {
  font-size: 3em;
  color: v-bind('globalColors.redColor');
}
.subtitle {
  font-size: 1.2em;
  margin-bottom: 20px;
}
.cta-button {
  background-color: v-bind('globalColors.redColor');
  color: #fff;
  font-size: 16px;
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  align-self: center;
}
.cta-button:hover {
  background-color: #bf3e3e;
}

/* Introduction Section */
.introduction-section {
  padding: 40px 100px;
  text-align: center;
}
.introduction-section img {
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
}

/* Features Section */
.features-section {
  margin: 0 50px;
  padding: 40px 20px;
  background-color: #f8e3cd;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
}
.features-grid {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.feature-item {
  max-width: 300px;
  text-align: center;
}
.feature-item img {
  width: 80px;
  height: 80px;
}
.feature-item h3 {
  font-size: 1.2em;
  color: #333;
}
.feature-item p {
  font-size: 1em;
  color: #666;
}

/* Testimonials Section */
.testimonials-section {
  padding: 40px 20px;
  text-align: center;
}
.testimonials blockquote {
  font-size: 1.2em;
  font-style: italic;
  color: #333;
  margin-bottom: 10px;
}
.testimonials cite {
  font-size: 1em;
  color: #666;
}

/* Footer Section */
.footer-section {
  text-align: center;
  padding: 20px;
  background-color: #333;
  color: white;
}
.footer-section a {
  color: #ff5733;
  text-decoration: none;
}
.footer-section a:hover {
  text-decoration: underline;
}
</style>
