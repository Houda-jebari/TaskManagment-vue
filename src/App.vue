<!-- App.vue -->
<template>
  <div class="app">
    <Login/>
  </div>

</template>

<script setup >
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';


</script>

<style >

body
{
  margin :0;
  background:#eee;
}
</style>
