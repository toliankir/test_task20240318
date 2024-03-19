<script setup lang="ts">
import { inject, reactive } from 'vue'
import { VueCookies } from 'vue-cookies';
import { router } from '../router';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { useStore } from 'vuex';
import { AppStore } from '../store';

const store = useStore<AppStore>();

const state = reactive<{
    errorMessage: string | null;
    email: string;
    password: string;
}>({
    errorMessage: null,
    email: "",
    password: "",
});

const $cookies = inject<VueCookies>('$cookies');

async function login(e) {
    e.preventDefault();
    try {
        state.errorMessage = null;
        if (!state.email || !state.password) {
            state.errorMessage = "Fill all data";
            return;
        }

        const result = await makeRequest<{
            token: string;
            refreshToken: string;
        }>({
            path: "/auth/login",
            method: "POST",
            data: {
                username: state.email,
                password: state.password
            }
        });

        const tokenData = JSON.parse(atob(result.token.split(".")[1]));
        const refreshTokenData = JSON.parse(atob(result.refreshToken.split(".")[1]));
        const tokenExpireDate = new Date(tokenData.exp * 1000);
        const refreshTokenExpireDate = new Date(refreshTokenData.exp * 1000);

        $cookies?.set("token", result.token, tokenExpireDate);
        $cookies?.set("refreshToken", result.refreshToken, refreshTokenExpireDate);
        store.commit('setUserRole', tokenData.roles[0]);

        router.push('/current-user');
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Sign in</p>
        <form class="w-1/2 md:w-1/3">
            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="text" v-model="state.email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="test@mail.com" required />
            </div>

            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" v-model="state.password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="password" required />
            </div>

            <div class="text-center mt-5 mb-2">
                <button @click="login"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Sign in</button>
            </div>
        </form>
        <div v-if="state.errorMessage" class="font-semibold text-red-600">
            <p>Error: {{ state.errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped></style>
