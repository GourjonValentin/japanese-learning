<template>
    <div class="admin">
        <div class="nav-bar">
            <ul>
                <li><a href="#user-admin">User management</a></li>
                <li><a href="#quiz-admin">Quiz management</a></li>
            </ul>
        </div>
        <div class="dialog-overlay" id="alertDialog" v-if="isAlert">
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ alert.title }}</h2>
                </div>
                <div class="dialog-body">
                    <p v-html="alert.body"></p>
                    <form
                        @submit.prevent="
                            () => {
                                isAlert = false;
                            }
                        "
                    >
                        <button class="styledButton-red" type="submit">
                            Ok
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div
            class="dialog-overlay"
            id="confirmationDialog"
            v-if="isConfirmation"
        >
            <div class="dialog">
                <div class="dialog-header">
                    <h2>{{ confirmation.title }}</h2>
                </div>
                <div class="dialog-body">
                    <p>{{ confirmation.body }}</p>
                    <div class="confirmation-div-button">
                        <button
                            class="styledButton-brown-minor"
                            @click="
                                () => {
                                    confirmation.result = false;
                                    isConfirmation = false;
                                }
                            "
                        >
                            Cancel
                        </button>
                        <button
                            class="styledButton-red"
                            @click="
                                () => {
                                    confirmation.result = true;
                                    isConfirmation = false;
                                }
                            "
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-content">
            <div id="user-admin">
                <div class="arrow-admin-title" @click="toggleSection('users')">
                    <div class="admin-title">
                        <h1>Users Management</h1>
                    </div>
                    <div
                        :class="[
                            'arrow-down',
                            { visible: visibleSections.users },
                        ]"
                    >
                        <img src="@/assets/icons/down-arrow.png" alt="Arrow" />
                    </div>
                </div>
                <div :class="['users', { visible: visibleSections.users }]">
                    <div
                        class="styledDiv-pretty"
                        v-for="user in users"
                        :key="user.id"
                    >
                        <div class="user-header">
                            <div @click="deleteUser(user)" class="delete">
                                <img
                                    class="logo"
                                    src="@/assets/icons/delete-red.webp"
                                />
                            </div>
                        </div>
                        <h3>{{ user.username }}</h3>
                        <button
                            class="styledButton"
                            v-if="user.isAdmin"
                            @click="toggleAdmin(user)"
                        >
                            Remove Admin
                        </button>
                        <button
                            class="styledButton"
                            v-else
                            @click="toggleAdmin(user)"
                        >
                            Make Admin
                        </button>
                    </div>
                </div>
            </div>
            <div id="quiz-admin">
                <div
                    class="arrow-admin-title"
                    @click="toggleSection('quizzes')"
                >
                    <div class="admin-title">
                        <h1>Quizzes Management</h1>
                    </div>
                    <div
                        :class="[
                            'arrow-down',
                            { visible: visibleSections.quizzes },
                        ]"
                    >
                        <img src="@/assets/icons/down-arrow.png" alt="Arrow" />
                    </div>
                </div>
                <div :class="['search', { visible: visibleSections.quizzes }]">
                    <form
                        class="search-form"
                        @submit.prevent="handleSearchSubmit()"
                    >
                        <img
                            src="@/assets/icons/search-logo.png"
                            alt="search_logo.png"
                        />
                        <input
                            class="search-input"
                            type="text"
                            name="searchName"
                            v-model="searchName"
                            placeholder="Search by name..."
                        />
                        <button
                            class="search-button"
                            style="padding: 8px 20px; font-size: 13px"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                    <div>
                        <div
                            class="filter"
                            @click="toggleQuizFilterType('simple')"
                            :class="{
                                active: this.searchFilterType === 'simple',
                            }"
                        >
                            Normal Quiz
                        </div>
                        <div
                            class="filter"
                            @click="toggleQuizFilterType('anime')"
                            :class="{
                                active: this.searchFilterType === 'anime',
                            }"
                        >
                            Anime Quiz
                        </div>
                        <div>
                            <select
                                class="styledSelectInput"
                                v-model="searchFilterDifficulty"
                            >
                                <option>all</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    :class="[
                        'quizzes-admin-page',
                        { visible: visibleSections.quizzes },
                    ]"
                >
                    <div class="quiz" v-for="quiz in quizzes" :key="quiz.id">
                        <div
                            class="quiz-header"
                            v-if="
                                this.userId !== '' || this.sessionToken !== ''
                            "
                        >
                            <div class="favorites">
                                <img
                                    class="logo"
                                    src="@/assets/icons/heart-unfilled.png"
                                />
                            </div>
                            <div class="tools">
                                <div class="edit" @click="editQuiz(quiz.id)">
                                    <img
                                        class="logo"
                                        src="@/assets/icons/pencil-icon-colored.png"
                                    />
                                </div>
                                <div @click="deleteQuiz(quiz)" class="delete">
                                    <img
                                        class="logo"
                                        src="@/assets/icons/delete-red.webp"
                                    />
                                </div>
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
                        <p>Creator : {{ quiz.ownername }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from "@/router";
import { inject } from "vue"; // to access user variable
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
        const isAdmin = inject("isAdmin");
        const setIsAdmin = inject("setIsAdmin");
        return {
            username,
            avatarPath,
            userId,
            favorites,
            sessionToken,
            setFavorites,
            isAdmin,
            setIsAdmin,
        };
    },
    data() {
        return {
            globalColors: globalColors,
            quizzes: [],
            searchFilterType: "",
            searchFilterDifficulty: "all",
            users: [],
            isAlert: false,
            alert: {
                title: "",
                body: "",
            },
            isConfirmation: false,
            confirmation: {
                body: "",
                title: "",
                result: null,
            },
            visibleSections: {
                users: false,
                quizzes: false,
            },
        };
    },
    mounted() {
        this.getAllquizzes();
        this.getAllUsers();
        checkAuth(this.sessionToken)
            .then((res) => {
                if (!res.data.data.isAdmin) {
                    this.$router.push({
                        path: "/auth",
                        query: {
                            form: "login/signup",
                            redirect: "/settings/admin",
                        },
                    });
                }
            })
            .catch(() => {
                this.$router.push({
                    path: "/auth",
                    query: {
                        form: "login/signup",
                        redirect: "/settings/admin",
                    },
                });
            });
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        async getAllUsers() {
            try {
                const res = await axios.get("http://localhost:3000/users", {
                    headers: { Authorization: `Bearer ${this.sessionToken}` },
                });
                if (res.status === 200) {
                    this.users = res.data;
                }
            } catch (err) {
                console.error(err);
            }
        },
        async getAllquizzes() {
            try {
                const res = await axios.get("http://localhost:3000/quizzes");
                if (
                    res.status === 200 ||
                    res.status === 206 ||
                    res.status === 304
                ) {
                    this.quizzes = res.data;
                }
            } catch (err) {
                console.error(err);
                if (err.response === undefined) {
                    if (err.code === "ERR_NETWORK") {
                        this.quizzesMessage =
                            "Oops... The server is currently unavailable...";
                    } else {
                        this.quizzesMessage = "Oops... An error occured...";
                    }
                } else if (err.response.status === 404) {
                    this.quizzesMessage =
                        "Oops... The quizzes could not be reached... ";
                } else if (err.response.status === 500) {
                    this.quizzesMessage =
                        "Oops... The server couldn't respond to the request...";
                } else {
                    this.quizzesMessage =
                        "Oops... The quizzes could not be loaded... ";
                }
            }
        },
        async startQuiz(quiz) {
            router.push({ path: "/quiz", query: { quizId: quiz.id } });
        },
        editQuiz(quizId) {
            this.$router.push({
                path: "/quiz/edit",
                query: { quizId: quizId },
            });
        },
        async handleSearchSubmit() {
            await axios
                .get("http://localhost:3000/quizzes", {
                    params: {
                        difficulty: this.searchFilterDifficulty,
                        type:
                            this.searchFilterType === ""
                                ? null
                                : this.searchFilterType,
                        favorites: JSON.stringify(this.searchFilterFavorites)
                            ? this.favorites
                            : [],
                        name: this.searchName,
                    },
                })
                .then((res) => {
                    if (res.status === 200 || res.status === 206) {
                        this.quizzes = res.data;
                        this.quizzesMessage = "";
                    }
                })
                .catch((err) => {
                    if (err.status === 404) {
                        this.quizzesMessage = "No quizzes found...";
                        this.quizzes = [];
                    }
                    console.error(err);
                });
        },
        toggleQuizFilterType(type) {
            if (this.searchFilterType === "") {
                this.searchFilterType = type;
            } else if (this.searchFilterType == type) {
                this.searchFilterType = "";
            } else {
                this.searchFilterType = type;
            }
        },
        async deleteQuiz(quiz) {
            this.confirmation.title = "Caution";
            this.confirmation.body = `You are about to delete the quiz *${quiz.name}*...\nAre you sure you want to continue ?`;
            this.isConfirmation = true;
            const unwatchConfirmation = this.$watch(
                () => this.confirmation.result,
                async (newVal) => {
                    if (newVal === true) {
                        try {
                            let res = await axios.delete(
                                "http://localhost:3000/quizzes/delete",
                                {
                                    params: { quizId: quiz.id },
                                    headers: {
                                        Authorization: `Bearer ${this.sessionToken}`,
                                    },
                                }
                            );
                            if (res.status === 200) {
                                this.quizzes = res.data;
                            } else {
                                this.alert.header = "Oops...";
                                this.alert.body = `the quiz ${quiz.name} couldn't be removed`;
                                this.isAlert = true;
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    unwatchConfirmation();
                }
            );
        },
        async toggleAdmin(user) {
            try {
                if (user.id === this.userId) {
                    let adminCount = this.users.filter(
                        (elt) => elt.isAdmin
                    ).length;
                    if (adminCount === 1) {
                        this.confirmation.title = "Last Admin";
                        this.confirmation.body =
                            "You are the last admin, there will be no admin left after this. Do you still want to proceed ?";
                        this.isConfirmation = 1;

                        while (this.confirmation.result === 1) {
                            continue;
                        }
                        if (this.confirmation.result === false) {
                            return;
                        }
                    }
                }
                await axios.post(
                    "http://localhost:3000/admin/toggle",
                    {
                        user: user,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.sessionToken}`,
                        },
                    }
                );
                this.setIsAdmin(this.isAdmin ? 0 : 1);
                this.getAllUsers();
            } catch (err) {
                if (err.response.status === 400) {
                    console.error("Invalid user format");
                } else if (err.response.status === 401) {
                    console.error("Invalid Token");
                } else if (err.response.status === 403) {
                    console.error("Access Forbidden, must be admin to access");
                    this.$router.push({
                        path: "/auth",
                        query: { form: "login/signup" },
                    });
                } else if (err.response.status === 404) {
                    console.error("No result found for given user");
                }
            }
        },
        async deleteUser(user) {
            try {
                await axios.delete("http://localhost:3000/users/delete", {
                    headers: { Authorization: `Bearer ${this.sessionToken}` },
                    params: { user: user },
                });
                this.getAllUsers();
            } catch (err) {
                if (err.response.status === 400) {
                    console.error("Invalid User Format");
                } else if (err.response.status === 401) {
                    console.error("Invalid or no Token");
                } else if (err.response.status === 403) {
                    console.error(
                        "Access Forbidden, not permitted to delete this user"
                    );
                } else if (err.response.status === 404) {
                    console.error("User not found");
                } else if (err.response.status === 500) {
                    console.error("Internal Server Error : " + err);
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
.admin {
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

.admin-content {
    display: flex;
    flex-direction: column;
}

.admin-content h1 {
    margin: 20px 0;
}

.dialog-body button {
    background-color: v-bind("globalColors.redColor");
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 20px;
    cursor: pointer;
    align-self: center;
}

.users,
.quizzes-admin-page {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
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

.users h3 {
    margin-top: 0px;
}

.filter {
    background-color: v-bind("globalColors.brownColor");
}

.filter:hover {
    background-color: v-bind("globalColors.lightColor");
    transform: scale(1.05);
}

.filter.active {
    background-color: v-bind("globalColors.lightColor");
}

.user-header .delete {
    margin: 0px;
    padding: 0px;
}
.user-header {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 0px;
    padding-bottom: 0px;
}

@media (max-width: 768px) {
    .nav-bar {
        display: none;
    }

    .admin {
        flex-direction: column;
        gap: 0;
    }

    .admin-content {
        gap: 50px;
    }

    .arrow-admin-title {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .admin-title h1 {
        font-size: 2em;
    }

    .users,
    .quizzes-admin-page {
        display: none;
        flex-direction: column;
        justify-content: center;
        flex-wrap: wrap;
    }

    .users.visible,
    .quizzes-admin-page.visible {
        display: flex;
    }

    .arrow-down {
        display: flex;
    }

    .arrow-down.visible {
        transform: scaleY(-1);
    }

    .search {
        display: none;
    }

    .search.visible {
        display: flex;
    }
}
</style>
