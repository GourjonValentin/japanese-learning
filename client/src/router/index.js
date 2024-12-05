import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage';
import AuthPage from '../views/AuthPage';
import JishoPage from '../views/JishoPage';
import QuizPage from '../views/QuizPage';
import AlphabetPage from '../views/AlphabetPage';
import CreateQuizPage from "../views/CreateQuizPage";
import EditQuizPage from "../views/EditQuizPage";
import ProfilePage from '../views/ProfilePage';
import RoutingError from "../views/RoutingError";
import AboutUsPage from "../views/AboutUsPage";
import AdminPage from "@/views/AdminPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomePage
        },
        {
            path: '/auth',
            component: AuthPage
        },
        {
            path: '/jisho',
            component: JishoPage
        },
        {
            path: '/quiz',
            component: QuizPage
        },
        {
            path: '/alphabet',
            component: AlphabetPage
        },
        {
            path: '/quiz/create',
            component: CreateQuizPage
        },
        {
            path: '/quiz/edit',
            component: EditQuizPage
        },
        {
            path: '/AboutUs',
            component: AboutUsPage
        },
        {
            path: '/settings/profile',
            component: ProfilePage
        },
        {
            path: '/settings/admin',
            component: AdminPage
        },
        {
            path: '/:notFound',
            component: RoutingError
        },
    ]
})

export default router;