import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage';
import AuthPage from '../views/AuthPage';
import JishoPage from '../views/JishoPage';
import QuizPage from '../views/QuizPage';
import AlphabetPage from '../views/AlphabetPage';
import CreateQuizPage from "../views/CreateQuizPage";
import ProfilePage from '../views/ProfilePage';

const router = createRouter({
    history: createWebHistory(),
    routes: [ //a route has at least two properties, 
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
            path: '/create',
            component: CreateQuizPage
        },
        {
            path: '/profile',
            component: ProfilePage
        },
    ]
})

export default router;