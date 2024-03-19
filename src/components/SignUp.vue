<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { router } from '../router';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';

const state = reactive<{
    role: string | null;
    roles: string[];
    errorMessage: string | null;
    email: string;
    password: string;
}>({
    role: null,
    roles: [],
    errorMessage: null,
    email: "",
    password: "",
});

onMounted(async () => {
    try {
        state.errorMessage = null;

        const result = await makeRequest<{
            roles: string[];
        }>({
            path: "/users/available-roles",
            method: "GET",
        });

        state.role = result.roles[0];
        state.roles = result.roles;
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
});

async function createUser(e: any) {
    e.preventDefault();
    try {
        state.errorMessage = null;
        if (!state.email || !state.password || !state.role) {
            state.errorMessage = "Fill all data";
            return;
        }

        await makeRequest({
            path: "/users",
            method: "POST",
            data: {
                email: state.email,
                password: state.password,
                role: state.role
            }
        });

        router.push('/sign-in');
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Sign up</p>
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
            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                <select v-model="state.role"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="role in state.roles" :value="role">
                        {{ role }}
                    </option>
                </select>
            </div>

            <div class="text-center mt-5 mb-2">
                <button @click="createUser"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Sign up</button>
            </div>
        </form>
        <div v-if="state.errorMessage" class="font-semibold text-red-600">
            <p>Error: {{ state.errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped></style>
