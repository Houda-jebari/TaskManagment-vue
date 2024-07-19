<!-- App.vue -->
<template>
  <div class="app">
    <Sidebar v-if="showSidebar"/>
    <RouterView/>
  </div>

</template>

<script setup >
import { ref, watchEffect } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Sidebar from './components/Sidebar.vue';
import Board from './components/Board.vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();

const showSidebar=ref(true);

watchEffect(() => {
  showSidebar.value = !(route.path === '/login' || route.path === '/register');
});

</script>

<style >

body
{
  margin :0;
  background:#eee;
}
</style>
