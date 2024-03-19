<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import { VueCookies } from 'vue-cookies';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { User } from '../types/user';

const state = reactive<{
    errorMessage: string | null;
    users: User[]
}>({
    errorMessage: null,
    users: []
});


const $cookies = inject<VueCookies>('$cookies');
const store = useStore<AppStore>();

onMounted(() => {
    fetchUsers()
});

const fetchUsers = async () => {
    if ($cookies?.isKey("token") && store.state.userRole) {
        try {
            const result = await makeRequest<User[]>({
                path: "/users",
                method: "GET",
                token: $cookies?.get("token"),
                role: store.state.userRole
            });
            state.users = result;
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}
const deleteUser = async (userId: number) => {
    if ($cookies?.isKey("token") && store.state.userRole) {
        try {
            await makeRequest<{
                id: number;
                email: string;
                roles: string[]
            }[]>({
                path: "/users",
                method: "DELETE",
                data: {
                    id: userId
                },
                token: $cookies?.get("token"),
                role: store.state.userRole
            });

            await fetchUsers()
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Users</p>
        <div class="w-full">
            <div v-for="user in state.users" class="w-full sm:w-1/2 lg:w-1/3 p-2 inline-block">
                <div class="p-2 bg-gray-100 rounded flex items-start">
                    <div class="p-2">
                        <p class="text-blue-500 font-semibold"><span>Id : {{ user.id }}</span></p>
                        <p class="text-sm">Email: <span>{{ user.email }}</span></p>
                        <p class="text-sm">Phone: <span>{{ (user.roles || []).join(",") }}</span></p>
                        <button 
                        class="bg-red-800 text-white text-sm rounded py-1 px-3 mt-1 hover:bg-red-600"
                        @click="deleteUser(user.id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
</template>

<style scoped></style>
