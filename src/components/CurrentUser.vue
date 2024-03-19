<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import { VueCookies } from 'vue-cookies';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { useStore } from 'vuex';
import { AppStore } from '../store';

const $cookies = inject<VueCookies>('$cookies');
const store = useStore<AppStore>();

const state = reactive<{
    id: number | null;
    email: string | null;
    roles: string[] | null;
    role: string | null;
    token: string | null;
    refreshToken: string | null;
    tokenExpiredAt: Date | null;
    refreshTokenExpiredAt: Date | null;
    errorMessage: string | null;
}>({
    id: null,
    email: null,
    role: null,
    roles: null,
    token: null,
    refreshToken: null,
    tokenExpiredAt: null,
    refreshTokenExpiredAt: null,
    errorMessage: null
});

const parseToken = () => {
    if ($cookies?.isKey("token")) {
        const tokenData = JSON.parse(atob($cookies?.get("token").split(".")[1]));
        state.token = $cookies?.get("token");
        state.email = tokenData.email;
        state.roles = tokenData.roles;
        state.id = tokenData.id;
        state.tokenExpiredAt = new Date(tokenData.exp * 1000);
    }

    if ($cookies?.isKey("refreshToken")) {
        const refreshTokenData = JSON.parse(atob($cookies?.get("refreshToken").split(".")[1]));
        state.refreshToken = $cookies?.get("refreshToken");
        state.refreshTokenExpiredAt = new Date(refreshTokenData.exp * 1000);
    }
}

const signOut = () => {
    if ($cookies?.isKey("token")) {
        $cookies?.remove("token");
    }
    if ($cookies?.isKey("refreshToken")) {
        $cookies?.remove("refreshToken");
    }
    state.id = null;
}

const refreshToken = async () => {
    try {
        state.errorMessage = null;

        const result = await makeRequest<{
            token: string;
            id: number;
        }>({
            path: "/auth/refresh",
            method: "GET",
            token: $cookies?.get("refreshToken")
        });

        const tokenData = JSON.parse(atob(result.token.split(".")[1]));
        const tokenExpireDate = new Date(tokenData.exp * 1000);

        $cookies?.set("token", result.token, tokenExpireDate);
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
    parseToken();
}

onMounted(() => {
    state.role = store.state.userRole;
    parseToken();
});

const setRole = (e) => {
    e.preventDefault();
    store.commit("setUserRole", state.role);
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Current user</p>
        <div v-if="state.id" class="w-1/2">
            <p class="my-2"><span class="font-bold">Id:</span> {{ state.id }}</p>
            <p class="my-2"><span class="font-bold">Email:</span> {{ state.email }}</p>
            <p class="my-2"><span class="font-bold">Roles:</span> {{ (state.roles || []).join(', ') }}</p>
            <p class="my-2 break-all"><span class="font-bold">Token:</span> {{ state.token }}</p>
            <p class="my-2"><span class="font-bold">Token expire at:</span> {{ state.tokenExpiredAt }}</p>
            <p class="my-2 break-all"><span class="font-bold">Refresh token:</span> {{ state.refreshToken }}</p>
            <p class="my-2"><span class="font-bold">Refresh token expire at:</span> {{ state.refreshTokenExpiredAt }}
            </p>

            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="refreshToken"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Refresh token</button>

                <button @click="signOut"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Sign out</button>
            </div>

            <div class="text-center mt-5 mb-2 flex justify-around">
                <select v-model="state.role"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="role in state.roles" :value="role">
                        {{ role }}
                    </option>
                </select>

                <button @click="setRole"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Set role</button>
            </div>
        </div>
        <div v-if="!state.id" class="w-1/2 md:w-1/3">
            <p>Require user sign in</p>
        </div>
    </div>
</template>

<style scoped></style>
