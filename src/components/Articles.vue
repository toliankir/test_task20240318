<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import { VueCookies } from 'vue-cookies';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { Article } from '../types/article';

const state = reactive<{
    editId: number | null;
    title: string;
    text: string;
    errorMessage: string | null;
    articles: Article[],
    offset: number,
    limit: number,
}>({
    editId: null,
    title: "",
    text: "",
    errorMessage: null,
    articles: [],
    offset: 0,
    limit: 4
});


const $cookies = inject<VueCookies>('$cookies');
const store = useStore<AppStore>();

onMounted(() => {
    fetchArticles()
});

const fetchArticles = async () => {
    if ($cookies?.isKey("token") && store.state.userRole) {
        try {
            const result = await makeRequest<Article[]>({
                path: "/articles",
                method: "GET",
                token: $cookies?.get("token"),
                role: store.state.userRole,
                query: {
                    offset: state.offset,
                    limit: state.limit
                }
            });
            if (result.length === 0) {
                return;
            }
            state.articles = result;
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}

const deleteArticle = async (articleId: number) => {
    if ($cookies?.isKey("token") && store.state.userRole) {
        try {
            await makeRequest<{
                id: number;
                email: string;
                roles: string[]
            }[]>({
                path: "/articles",
                method: "DELETE",
                data: {
                    id: articleId
                },
                token: $cookies?.get("token"),
                role: store.state.userRole
            });

            await fetchArticles()
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}

const createArticle = async (e: any) => {
    e.preventDefault()
    if ($cookies?.isKey("token") && store.state.userRole) {
        if (!state.text || !state.title) {
            state.errorMessage = "Fill all data";
            return;
        }
        try {
            await makeRequest<{
                id: number;
                email: string;
                roles: string[]
            }[]>({
                path: "/articles",
                method: "POST",
                data: {
                    title: state.title,
                    text: state.text
                },
                token: $cookies?.get("token"),
                role: store.state.userRole
            });

            await fetchArticles()
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}

const startEdit = (articleId: number) => {
    const article = state.articles.find(e => e.id === articleId);
    if (!article) {
        state.errorMessage = `Can not find article with id "${articleId}"`;
        return;
    }

    state.editId = article.id;
    state.title = article.title;
    state.text = article.text;
}

const cancelEdit = (e: any) => {
    e.preventDefault();
    state.editId = null;
    state.title = "";
    state.text = "";
}

const saveEdit = async (e: any) => {
    e.preventDefault();
    if ($cookies?.isKey("token") && store.state.userRole) {
        if (!state.text || !state.title) {
            state.errorMessage = "Fill all data";
            return;
        }
        try {
            const result = await makeRequest<{
                id: number | null;
            }>({
                path: "/articles",
                method: "PUT",
                data: {
                    id: state.editId,
                    title: state.title,
                    text: state.text
                },
                token: $cookies?.get("token"),
                role: store.state.userRole
            });

            if (!result.id) {
                state.errorMessage = 'Update article failed';
                return;
            }
            await fetchArticles()
        } catch (e) {
            state.errorMessage = wrapError(e);
        }
    }
}

const fetchNext = () => {
    if (state.articles.length === 4) {
        state.offset = state.offset + state.limit;
        fetchArticles()
    }
}

const fetchPrev = () => {
    if (state.offset > 0) {
        state.offset = state.offset - state.limit;
        fetchArticles()
    }
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Articles</p>
        <p v-if="state.editId" class="font-bold text-blue-700 mt-2">Edit article {{ state.editId }}</p>
        <form class="w-1/2">
            <div class="my-2">
                <input type="text" v-model="state.title"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Title" required />
            </div>

            <div class="my-2">
                <textarea v-model="state.text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Text" required />
            </div>

            <div v-if="!state.editId" class="text-center mt-5 mb-2">
                <button @click="createArticle"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Create</button>
            </div>

            <div v-if="state.editId" class="text-center mt-5 mb-2 flex justify-around">
                <button @click="saveEdit"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Save</button>
                <button @click="cancelEdit"
                    class="bg-red-800 hover:bg-red-600 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Cancel</button>
            </div>
        </form>
        <div class="w-full">
            <div v-for="article in state.articles" class="w-full sm:w-full lg:w-1/2 p-2 inline-block">
                <div class="p-2 bg-gray-100 rounded flex items-start">
                    <div class="p-2">
                        <p class="text-blue-500 font-semibold">Id : {{ article.id }}</p>
                        <p class="text-sm">Email: {{ article.email }}</p>
                        <p class="text-sm bg-white p-2 rounded">{{ article.title }}</p>
                        <p class="text-sm bg-white p-2 rounded my-2">{{ article.text }}</p>
                        <div>
                            <button class="bg-red-800 text-white text-sm rounded py-1 px-3 mt-1 hover:bg-red-600"
                                @click="deleteArticle(article.id)">Delete</button>
                            <button @click="startEdit(article.id)"
                                class="bg-blue-700 hover:bg-blue-800 text-white text-sm rounded py-1 px-3 mt-1 mx-2">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <span @click="fetchPrev" class="select-none font-semibold mx-3 text-blue-700 hover:text-blue-900 hover:cursor-pointer">Prev</span>
            <span @click="fetchNext" class="select-none font-semibold mx-3 text-blue-700 hover:text-blue-900 hover:cursor-pointer">Next</span>
        </div>
    </div>
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
</template>

<style scoped></style>
