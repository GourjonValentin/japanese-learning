import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage';
import AuthPage from '../views/AuthPage';
import JishoPage from '../views/JishoPage';
import QuizzPage from '../views/QuizzPage';
import AlphabetPage from '../views/AlphabetPage';
import CreateQuizzPage from "../views/CreateQuizzPage";
import EditQuizzPage from "../views/EditQuizzPage";
import ProfilePage from '../views/ProfilePage';
import RoutingError from "../views/RoutingError";

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
            path: '/quizz',
            component: QuizzPage
        },
        {
            path: '/alphabet',
            component: AlphabetPage
        },
        {
            path: '/create',
            component: CreateQuizzPage
        },
        {
            path: '/edit',
            component: EditQuizzPage
        },
        {
            path: '/profile',
            component: ProfilePage
        },
        {
            path: '/:notFound',
            component: RoutingError
        }
    ]
})

export default router;