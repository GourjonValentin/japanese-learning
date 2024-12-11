<template>
    <div class="profile">
        <div class="nav-bar">
            <ul>
                <li><a href="#password-settings">Security</a></li>
                <!-- <li><a href="#confidentialty-settings">Confidentiality</a></li> -->
                <li><a href="#quizzes-history">Quizzes history</a></li>
                <li><a href="#favorite-quizzes">Favorite quizzes</a></li>
                <li>
                    <router-link
                        :to="{ path: '/auth', query: { form: 'signout' } }"
                        >Sign Out</router-link
                    >
                </li>
            </ul>
        </div>
        <div class="profile-content">
            <div class="avatar-username">
                <div class="avatar">
                    <img :src="avatarPath" alt="avatar" class="user-avatar" />
                </div>
                <div class="username">
                    <h1>{{ username }}</h1>
                </div>
                <div @click="toggleUsernameEdit" class="edit-icon">
                    <img
                        v-if="!isEditingUsername"
                        src="@/assets/icons/pencil-icon.png"
                        alt="Edit"
                    />
                </div>
                <div v-if="isEditingUsername" class="dialog-overlay">
                    <div class="dialog">
                        <div class="dialog-header">
                            <h2>Change Username</h2>
                            <div @click="toggleUsernameEdit" class="close-icon">
                                <img
                                    src="@/assets/icons/katana_cross.png"
                                    alt="Close"
                                />
                            </div>
                        </div>
                        <div class="dialog-body">
                            <form @submit.prevent="saveUsername">
                                <input
                                    class="styledInput"
                                    type="text"
                                    v-model="newUsername"
                                    placeholder="Enter new username"
                                    maxlength="20"
                                />
                                <p
                                    v-if="updateUsernameMessage"
                                    style="white-space: pre-wrap"
                                >
                                    {{ updateUsernameMessage }}
                                </p>
                                <button class="styledButton-red" type="submit">
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="password-settings">
                <form @submit.prevent="updatePassword">
                    <h2>Change your password</h2>
                    <input
                        type="password"
                        v-model="currentPassword"
                        placeholder="Current password"
                        required
                    />
                    <input
                        type="password"
                        v-model="password"
                        placeholder="New password"
                        required
                    />
                    <input
                        type="password"
                        v-model="confirmPassword"
                        placeholder="Confirm new password"
                        required
                    />
                    <p
                        v-if="updatePasswordMessage"
                        style="white-space: pre-wrap"
                    >
                        {{ updatePasswordMessage }}
                    </p>
                    <button class="styledButton-red" type="submit">Save</button>
                </form>
            </div>
            <div id="quizzes-history">
                <div
                    class="arrow-title-settings"
                    @click="toggleSection('history')"
                >
                    <div class="title-settings">
                        <h2>Quizzes history</h2>
                    </div>
                    <div
                        :class="[
                            'arrow-down',
                            { visible: visibleSections.history },
                        ]"
                    >
                        <img src="@/assets/icons/down-arrow.png" alt="Arrow" />
                    </div>
                </div>
                <div
                    :class="[
                        'quizzes-profile-page',
                        { visible: visibleSections.history },
                    ]"
                >
                    <div
                        class="quiz"
                        v-for="quiz in userQuizzes"
                        :key="quiz.id"
                    >
                        <div
                            class="quiz-header"
                            v-if="
                                this.userId !== '' || this.sessionToken !== ''
                            "
                        >
                            <div
                                class="favorites"
                                @click="changeFavorites(quiz.id)"
                            >
                                <img
                                    class="logo"
                                    src="@/assets/icons/heart-unfilled.png"
                                    v-if="favorites.indexOf(quiz.id) === -1"
                                />
                                <img
                                    class="logo"
                                    src="@/assets/icons/heart-filled.png"
                                    v-else
                                />
                            </div>
                            <div
                                class="edit"
                                @click="editQuiz(quiz.id)"
                                v-if="isQuizOwner(quiz) == 1"
                            >
                                <img
                                    class="logo"
                                    src="@/assets/icons/pencil-icon-colored.png"
                                />
                            </div>
                        </div>

                        <h3>{{ quiz.name }}</h3>
                        <button class="styledButton" @click="startQuiz(quiz)">
                            Start Quiz
                        </button>
                        <div class="quiz-caption">
                            <p>Difficulty :</p>
                            <div v-for="i in quiz.difficultylevel" :key="i">
                                <img src="@/assets/icons/torii.png" />
                            </div>
                        </div>
                        <p>Best score : {{ quiz.score }} / {{ quiz.length }}</p>
                    </div>
                    <p v-if="userQuizzesMessage" id="userQuizzesMessage">
                        {{ userQuizzesMessage }}
                    </p>
                </div>
            </div>
            <div id="favorite-quizzes">
                <div
                    class="arrow-title-settings"
                    @click="toggleSection('favorites')"
                >
                    <div class="title-settings">
                        <h2>Favorite quizzes</h2>
                    </div>
                    <div
                        :class="[
                            'arrow-down',
                            { visible: visibleSections.favorites },
                        ]"
                    >
                        <img src="@/assets/icons/down-arrow.png" alt="Arrow" />
                    </div>
                </div>
                <div
                    :class="[
                        'quizzes-profile-page',
                        { visible: visibleSections.favorites },
                    ]"
                >
                    <div
                        class="quiz"
                        v-for="quiz in userFavQuizzes"
                        :key="quiz.id"
                    >
                        <div
                            class="quiz-header"
                            v-if="
                                this.userId !== '' || this.sessionToken !== ''
                            "
                        >
                            <div
                                class="favorites"
                                @click="changeFavorites(quiz.id)"
                            >
                                <img
                                    class="logo"
                                    src="@/assets/icons/heart-unfilled.png"
                                    v-if="favorites.indexOf(quiz.id) === -1"
                                />
                                <img
                                    class="logo"
                                    src="@/assets/icons/heart-filled.png"
                                    v-else
                                />
                            </div>
                            <div
                                class="edit"
                                @click="editQuiz(quiz.id)"
                                v-if="isQuizOwner(quiz) == 1"
                            >
                                <img
                                    class="logo"
                                    src="@/assets/icons/pencil-icon-colored.png"
                                />
                            </div>
                        </div>

                        <h3>{{ quiz.name }}</h3>
                        <button class="styledButton" @click="startQuiz(quiz)">
                            Start Quiz
                        </button>
                        <div class="quiz-caption">
                            <p>Difficulty :</p>
                            <div v-for="i in quiz.difficultylevel" :key="i">
                                <img src="@/assets/icons/torii.png" />
                            </div>
                        </div>
                    </div>
                    <p v-if="userFavQuizzesMessage" id="userFavQuizzesMessage">
                        {{ userFavQuizzesMessage }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import { inject } from "vue";
import { globalColors } from "../utils/GlobalVariable";
import axios from "axios";
import { checkAuth } from "@/utils/utils";

export default {
    setup() {
        const username = inject("username");
        const avatarPath = inject("avatarPath");
        const userId = inject("userId");
        const favorites = inject("favorites");
        const sessionToken = inject("sessionToken");
        const setFavorites = inject("setFavorites");
        return {
            username,
            avatarPath,
            userId,
            favorites,
            sessionToken,
            setFavorites,
        };
    },
    data() {
        return {
            globalColors: globalColors,
            currentPassword: "",
            password: "",
            confirmPassword: "",
            updatePasswordMessage: "",
            userQuizzesMessage: "",
            userQuizzes: [],
            userFavQuizzesMessage: "",
            userFavQuizzes: [],
            newUsername: "",
            updateUsernameMessage: "",
            isEditingUsername: false,
            visibleSections: {
                history: false,
                favorites: false,
            },
        };
    },
    mounted() {
        this.getUserQuizzes();
        this.getUserFavQuizzes();
        checkAuth(this.sessionToken).catch(() => {
            this.$router.push({
                path: "/auth",
                query: { form: "login/signup", redirect: "/settings/profile" },
            });
        });
    },
    methods: {
        async getUserQuizzes() {
            try {
                const res = await axios.get(
                    "http://localhost:3000/quizzes/attempts",
                    {
                        params: {
                            userId: this.userId,
                        },
                        headers: {
                            Authorization: `Bearer ${this.sessionToken}`,
                        },
                    }
                );
                if (res.status === 200) {
                    this.userQuizzes = res.data;
                }
            } catch (err) {
                console.error(err);
                if (err.response) {
                    if (err.response.status === 404) {
                        this.userQuizzesMessage = err.response.data.message;
                    } else if (err.response.status === 500) {
                        this.userQuizzesMessage = err.response.data.error;
                    } else {
                        this.userQuizzesMessage =
                            "Oops... Something went wrong while fetching quizzes.";
                    }
                } else {
                    this.userQuizzesMessage =
                        "Oops... Something went wrong while fetching quizzes.";
                }
            }
        },
        async getUserFavQuizzes() {
            try {
                console.log("fev", this.favorites);
                const res = await axios.get("http://localhost:3000/quizzes", {
                    params: {
                        favorites:
                            this.favorites.length !== 0
                                ? this.favorites
                                : JSON.stringify([]),
                    },
                });
                if (res.status === 200 || res.status === 206) {
                    this.userFavQuizzes = res.data;
                }
            } catch (err) {
                console.error(err);
                if (err.response) {
                    if (err.response.status === 404) {
                        this.userFavQuizzesMessage = err.response.data.message;
                    } else if (err.response.status === 500) {
                        this.userFavQuizzesMessage = err.response.data.error;
                    }
                } else {
                    this.userFavQuizzesMessage =
                        "Oops... Something went wrong while fetching quizzes.";
                }
            }
        },
        async updatePassword() {
            if (this.password !== this.confirmPassword) {
                this.updatePasswordMessage = "Passwords do not match.";
                return;
            }

            try {
                const response = await axios.post(
                    "http://localhost:3000/users/change-password",
                    {
                        userId: this.userId,
                        currentPassword: this.currentPassword,
                        newPassword: this.password,
                    }
                );

                if (response.status === 200) {
                    this.updatePasswordMessage = response.data.message;
                }
            } catch (error) {
                if (error.response) {
                    if (Array.isArray(error.response.data.message)) {
                        this.updatePasswordMessage =
                            error.response.data.message.join("\n");
                    } else {
                        this.updatePasswordMessage =
                            error.response.data.message;
                    }
                } else {
                    this.updatePasswordMessage =
                        "An error occurred during signup.";
                }
            }
        },
        async startQuiz(quiz) {
            router.push({ path: "/quiz", query: { quizId: quiz.id } });
        },
        isQuizOwner(quiz) {
            if (quiz.ownerid == this.userId) {
                return 1;
            }
            return 0;
        },
        editQuiz(quizId) {
            this.$router.push({
                path: "/quiz/edit",
                query: { quizId: quizId },
            });
        },
        async changeFavorites(quizId) {
            let mode = "add";
            if (this.favorites.includes(quizId)) {
                mode = "delete";
            }

            try {
                const res = await axios
                    .post(
                        "http://localhost:3000/users/edit-favorite",
                        {
                            mode: mode,
                            quizId: quizId,
                            sessionToken: this.sessionToken,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${this.sessionToken}`,
                            },
                        }
                    )
                    .catch((err) => {
                        if (err.response.status === 409) {
                            alert(
                                "You have already added this quiz to your favorites"
                            );
                        }
                        console.error(err);
                    });

                this.setFavorites(res.data.favorites);
                this.getUserFavQuizzes();
            } catch (err) {
                console.error(err);
            }
        },
        toggleUsernameEdit() {
            this.isEditingUsername = !this.isEditingUsername;
            if (this.isEditingUsername) {
                this.newUsername = this.username;
            }
        },
        async saveUsername() {
            if (!this.newUsername) {
                this.updateUsernameMessage = "Please enter a new username.";
                return;
            }

            if (this.newUsername === this.username) {
                this.updateUsernameMessage =
                    "Please enter a different username.";
                return;
            }

            try {
                const response = await axios.post(
                    "http://localhost:3000/users/change-username",
                    {
                        userId: this.userId,
                        newUsername: this.newUsername,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.sessionToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    this.username = this.newUsername;
                    this.updateUsernameMessage = response.data.message;
                    this.toggleUsernameEdit();
                }
            } catch (error) {
                if (error.response) {
                    this.updateUsernameMessage = error.response.data.message;
                } else {
                    this.updateUsernameMessage =
                        "An error occurred during username change.";
                }
            }
        },
        toggleSection(section) {
            this.visibleSections[section] = !this.visibleSections[section];
        },
    },
};
</script>

<style scoped>
.profile {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    padding-top: 30px;
    gap: 45px;
}

.nav-bar {
    border-right: 5px solid black;
    height: 100vh;
    width: 165px;
    display: flex;
    flex-direction: column;
}

.nav-bar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-bar li {
    margin: 10px;
}

.nav-bar a {
    text-decoration: none;
    color: v-bind("globalColors.darkColor");
    font-size: 16px;
    padding: 10px;
    display: block;
    text-align: left;
    transition: color 0.3s ease;
}

.nav-bar a:hover {
    font-weight: bold;
}

.profile-content {
    display: flex;
    flex-direction: column;
}

.profile-content h2 {
    font-size: 40px;
    margin: 20px 0;
    color: v-bind("globalColors.darkColor");
}

.avatar-username {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.avatar {
    width: 60px;
    height: 60px;
}

.avatar img {
    width: 60px;
    height: 60px;
}

.username h1 {
    margin: 0;
    font-size: 75px;
    font-weight: 900;
    color: v-bind("globalColors.darkColor");
    line-height: 60px;
}

.edit-icon {
    cursor: pointer;
    width: 45px;
    height: 45px;
}

.edit-icon img {
    width: 45px;
    height: 45px;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog {
    background: v-bind("globalColors.lightColor");
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#password-settings {
    display: flex;
}

#password-settings form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

#password-settings input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    outline: none;
}

#confidentialty-settings,
#quizzes-history,
#favorite-quizzes {
    display: flex;
    flex-direction: column;
}

.title-settings {
    display: flex;
}

.quizzes-profile-page {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

.arrow-down {
    display: none;
    align-self: center;
    width: 50px;
    height: 50px;
}

.arrow-down img {
    width: 50px;
    height: 50px;
}

@media (max-width: 768px) {
    .nav-bar {
        display: none;
    }

    .profile {
        flex-direction: column;
        gap: 0;
    }

    #quizzes-history,
    #favorite-quizzes {
        margin-top: 25px;
    }

    .arrow-title-settings {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .title-settings h2 {
        font-size: 2em;
    }

    .avatar-username {
        justify-content: center;
    }

    .quizzes-profile-page {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: normal;
    }

    .quizzes-profile-page.visible {
        display: flex;
    }

    .arrow-down {
        display: flex;
    }

    .arrow-down.visible {
        transform: scaleY(-1);
    }
}
</style>
