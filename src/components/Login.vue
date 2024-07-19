<!-- Register.vue -->
<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>
      <p>Please login to continue to your account.</p>
      <form @submit.prevent="login">
        <label>Email</label>
        <input type="email" required v-model="form.email">
        <label>Password</label>
        <div class="password-input">
          <input required v-model="form.password" :type="showPassword ? 'text' : 'password'">
          <img src="../assets/icons/eye.png" @click="showPassword=!showPassword" class="eye-icon">
        </div>
        <div class="stayLogged">
          <input type="checkbox">  
          <label>keep me logged in</label> 
        </div>
        <div class="submit">
          <button type="submit">Sign in</button>
        </div>
        <div v-if="loginError" class="error">{{ loginError }}</div>
      </form>
      <p>Need an Account? <router-link class="register" to="/register">Sign up</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

let showPassword = false;

const form = ref({
  email: '',
  password: '',
});

const router = useRouter();
const loginError = ref(null);

const login = async () => {
  loginError.value = null; // Clear previous errors
  
  try {
    console.log('Sending login request with:', form.value); // Debugging line
    const response = await axios.post('http://127.0.0.1:8001/api/login', form.value);    
    const { user, token } = response.data;

    const role = response.data.role;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
    localStorage.setItem('token', token);
 
   console.log('Login successful, redirecting to:', role === 'admin' ? '/dashboard' : '/board');

    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/board');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      loginError.value = error.response.data.message;
    } else {
      loginError.value = 'An unexpected error occurred. Please try again.';
    }
    console.error('Login error:', error);
  }
};
</script>





<style scoped>

.card{
   max-width: 420px;
  margin: 30px auto; 
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
.card  h2{
  font-weight:700;
  font-size: 20px;
  margin-bottom: 15px;
}
label{
  color:#aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input,select{
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color :#555;

}
input[type ="checkbox"]{
  display :inline-block;
  width:16px;
  margin : 0 10px 0 0 ;
  position : relative;
  top :2px;
}
p{
  font-size:14px;
  font-weight: 300;
  color:#555
}
button{
  background:#367AFF;
  color:white;
  width:180px;
  height:40px;
  border-radius:10px;
  border:none;
  margin:20px;
  cursor:pointer;

}
.submit{
  text-align:center;
}
.register{
  color:#367AFF;
  text-decoration:underline;
  font-weight:bold;
  cursor:pointer;
}
.password-input{
  position:relative;

}
.eye-icon{
  width:19.69px;
  height:18px;
  position:absolute;
  right:10px;
  top:30%;
  cursor: pointer;
}


</style> 