<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import { VueCookies } from 'vue-cookies';
import { useStore } from 'vuex';
import { AppStore } from '../store';

const $cookies = inject<VueCookies>('$cookies');
const store = useStore<AppStore>();

const state = reactive<{
  email: string | null;
}>({
  email: null,
});

const updateUserData = () => {
  if ($cookies?.isKey("token")) {
    const tokenData = JSON.parse(atob($cookies?.get("token").split(".")[1]));
    state.email = tokenData.email;

    if (!store.state.userRole) {
      store.commit('setUserRole', tokenData.roles[0]);
    }
  } else {
    state.email = null;
  }
}

store.state.eventBus.on("user-data-update", () => {
  updateUserData();
});

onMounted(() => {
  updateUserData();
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto">
    <header class="px-2 border-b flex items-center justify-between h-14">
      <p class="uppercase font-bold text-blue-700">Test task 20240418</p>
      <div v-if="!state.email">
        <router-link class="mx-3 uppercase font-bold text-blue-700" to="/sign-up">Sign up</router-link>
        <router-link class="mr-5 uppercase font-bold text-blue-700" to="/sign-in">Sign in</router-link>
      </div>
      <div v-if="state.email">
        <router-link class="mx-3 uppercase font-bold text-blue-700" to="/users">Users</router-link>
        <router-link class="ml-3 mr-16 uppercase font-bold text-blue-700" to="/articles">Articles</router-link>
        <router-link class="mx-3 text-blue-700" to="/current-user">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6 inline-block">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          {{ state.email }}
          <span v-if="store.state.userRole">({{ store.state.userRole }})</span>
        </router-link>
      </div>
    </header>
  </div>
</template>

<style scoped></style>
