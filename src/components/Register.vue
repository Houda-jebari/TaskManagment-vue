<!-- Register.vue -->
<template class="container">
  <div class="card">
    <h2 >Register</h2>
    <p>Please register to create your account.</p>
    <form  @submit.prevent="register">
      <label > Name</label>
        <input type="text"  required v-model="form.name" id="name" >
        <div v-if="errors.name" class="error">{{ errors.name[0] }}</div>

        <label > Email</label>  
        <input type="email"  required v-model="form.email" id="email" >
        <div v-if="errors.email" class="error">{{ errors.email[0] }}</div>
        <label> Password</label>
         <div class="password-input">
            <input  required v-model="form.password" :type="showPassword? 'text':'password'" id="password">
            <img src="../assets/icons/eye.png" @click="showPassword=!showPassword" class="eye-icon">
         </div>

        


          <div v-if="errors.password" class="error">{{ errors.password[0] }}</div>

        <div class="stayLogged">
         <input type="checkbox">  
         <label> keep me logged in</label> 
        </div>
        <div class="submit" >
        <button type ="submit"> Sign up </button>
         <div v-if="message">{{ message }}</div>
        </div>
        
    </form>
   <p>Already have an account? <router-link  class="register" to="/login">Sign in</router-link ></p>
    
  </div>

</template>

<script setup>
import { ref } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';

let showPassword=false;


const form = ref({
  name: '',
  email: '',
  password: '',
  
})
const router = useRouter();
const errors = ref({});
const message = ref('');

const register = async () => {
  errors.value = {}; 
  try {
    const response = await axios.post('/register', form.value);
    console.log(response.data); 
    message.value = response.data.message;
    // Optionally redirect to login page after successful registration
    router.push('/login');
  }  catch (error) {
        if (error.response && error.response.status === 422) {
          errors.value = error.response.data.errors || {};
        } else {
          message.value = 'An error occurred';
        }
      }
};


</script>


<style scoped>
.card  h2{
  font-weight:700;
  font-size: 20px;
  margin-bottom: 15px;
}

.error {
  color: red;
  font-size: 0.875em;
}
.card{
   max-width: 420px;
  margin: 30px auto; 
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
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
  color:#555;
  font-weight: 300;
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