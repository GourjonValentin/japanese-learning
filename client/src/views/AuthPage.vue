<template>
    <div class="content">
        <div
            v-if="this.$route.query.form === 'login/signup'"
            class="container"
            :class="{ active: isSignUpActive }"
            id="container"
        >
            <div class="form-container sign-up">
                <SignUpFormComp />
            </div>

            <div class="form-container log-in">
                <LogInFormComp />
            </div>

            <!-- Toggle Container -->
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">
                        <h1>Already have an account?</h1>
                        <p>
                            Enter your personal details to use all site features
                        </p>
                        <button class="hidden" @click="toggleSignUp">
                            Log In
                        </button>
                    </div>
                    <div class="toggle-panel toggle-right">
                        <h1>Wanna learn japanese?</h1>
                        <p>
                            Register with your personal details to use all site
                            features
                        </p>
                        <button class="hidden" @click="toggleSignUp">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <SignOutComp v-else-if="this.$route.query.form === 'signout'" />
        <RoutingError v-else />
    </div>
    <div class="mobile-login-signup">
        <div v-if="this.$route.query.form === 'login/signup'" class="mobile-form-container">
            <div v-if="isSignUpActive" class="mobile-signup">
                <SignUpFormComp />
                <p>Already have an account?</p>
                <button @click="toggleSignUp">Log In</button>
            </div>
            <div v-else class="mobile-login">
                <LogInFormComp />
                <p>First time here?</p>
                <button @click="toggleSignUp">Sign Up</button>
            </div>
        </div>
        <SignOutComp v-else-if="this.$route.query.form === 'signout'" />
        <RoutingError v-else />
    </div>
</template>

<script>
import SignUpFormComp from "../components/SignUpFormComp";
import LogInFormComp from "../components/LogInFormComp";
import SignOutComp from "../components/SignOutComp";
import RoutingError from "./RoutingError.vue";
import { globalColors } from "../utils/GlobalVariable";

export default {
    components: {
        SignUpFormComp,
        LogInFormComp,
        SignOutComp,
        RoutingError,
    },

    data() {
        return {
            isSignUpActive: false,
            formMessage: "",
            globalColors: globalColors,
        };
    },
    methods: {
        toggleSignUp() {
            this.isSignUpActive = !this.isSignUpActive;
        },
    },
};
</script>

<style>
#formMessage {
    color: red;
    font-size: small;
}

@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

.content {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.content * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
}

.content h1 {
    font-family: "JapaneseStyleFont", sans-serif;
    font-weight: 400;
}

.container {
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
    color: v-bind("globalColors.darkColor");
}

.container p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}

.container a {
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
}

.container button {
    background-color: v-bind("globalColors.redColor");
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container button.hidden {
    background-color: transparent;
    border-color: #fff;
    margin-top: 10px;
}

.container form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}

.container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}

.form-container p {
    margin: 0;
    color: v-bind("globalColors.redColor");
}

.log-in {
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .log-in {
    transform: translateX(100%);
}

.sign-up {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
}

.container.active .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
}

@keyframes move {
    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }
    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}

.toggle-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    z-index: 1000;
}

.container.active .toggle-container {
    transform: translateX(-100%);
}

.toggle {
    background-image: url("@/assets/sliding_door.png");
    background-size: 100% 100%;
    background-position: center;
    position: absolute;
    height: 100%;
    width: 100%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-panel {
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-panel h1 {
    background-color: rgba(228, 180, 132, 0.95);
    border-radius: 15px;
}

.container.active .toggle {
    background-image: url("@/assets/sliding_door_inverted.png");
    background-color: v-bind("globalColors.redColor");
    background-size: 100% 100%;
    background-position: center;
    position: absolute;
    height: 100%;
    width: 100%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}

.toggle-left {
    transform: translateX(-200%);
}

.container.active .toggle-left {
    transform: translateX(0);
}

.toggle-right {
    right: 0;
    transform: translateX(0);
}

.container.active .toggle-right {
    transform: translateX(200%);
}

.mobile-login-signup {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.mobile-form-container {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 75%;
    max-width: 400px;
    color: v-bind("globalColors.darkColor");
}

.mobile-form-container p {
    margin: 0;
    margin-top: 10px;
    font-size: 14px;
    color: #333;
}

.mobile-form-container button {
    background-color: v-bind("globalColors.redColor");
    color: #fff;
    font-size: 10px;
    padding: 10px 15px;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.mobile-form-container form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}

.mobile-form-container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

@media (max-width: 768px) {
    .content {
        display: none;
    }

    .mobile-login-signup {
        display: flex;
    }
}
</style>
