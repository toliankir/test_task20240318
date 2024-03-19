import { createRouter, createWebHistory } from "vue-router";
import Users from './components/Users.vue';
import SignUp from './components/SignUp.vue';
import SignIn from './components/SignIn.vue';
import CurrentUser from './components/CurrentUser.vue';
import Main from './components/Main.vue';
import Articles from './components/Articles.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/sign-up', component: SignUp },
        { path: '/sign-in', component: SignIn },
        { path: '/current-user', component: CurrentUser },
        { path: '/users', component: Users },
        { path: '/articles', component: Articles },
    ]
})
