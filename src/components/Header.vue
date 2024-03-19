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

onMounted(() => {
  if ($cookies?.isKey("token")) {
    const tokenData = JSON.parse(atob($cookies?.get("token").split(".")[1]));
    state.email = tokenData.email;

    store.commit('setUserRole', tokenData.roles[0])
  }
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
        <router-link class="mx-3 uppercase font-bold text-blue-700" to="/articles">Articles</router-link>
        <router-link class="mx-3 font-bold text-blue-700" to="/current-user">{{ state.email }}
          <span v-if="store.state.userRole">({{ store.state.userRole }})</span>
        </router-link>
      </div>
    </header>
  </div>
</template>

<style scoped></style>
