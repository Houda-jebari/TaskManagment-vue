<template>
    <div class="sidebar">
        <div class="title">
            <img src="../assets/Icons/sidebar/icon.png" >
            <p class="proManage">Pro Manage</p>
        </div>


        <router-link to="/project" v-if="isAdmin">
            <div class="select">
                <img src="../assets/Icons/sidebar/project.png" />
                <p class="option">Project</p>
            </div>
        </router-link>

        <router-link to="/Board">
            <div class="select">
                <img src="../assets/Icons/sidebar/board.png" >
                <p class="option"> Board</p>
            </div>
        </router-link>

       
        <router-link to="/settings">
            <div class="select">
                <img src="../assets/Icons/sidebar/settings.png" >
                <p class="option"> Settings</p>
            </div>
        </router-link>

        <div @click="logout" class="select-logout">
            <img src="../assets/Icons/sidebar/logout.png" >
            <p class="option-logout"> Log out</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const role = localStorage.getItem('role');

const logout = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('http://localhost:8001/api/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        router.push('/login');
    } catch (error) {
        console.error('Logout failed: ', error);
    }
};

const isAdmin = role === 'superadmin';
</script>

<style scoped>

.sidebar{
    width:150px ;
    position:fixed;
    background : #ffff;
    left:0;
    bottom:0;
    top:0;
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    align-items: center;
    display: flex;
    flex-direction: column;
}
img{
    width: 20px;
    height: 20px;
    position:absolute;
}
.proManage{
    position: relative;
    padding-left: 25px;
    font-size: 12px;
    color: black;
}
.title{
    align-items: center;
    display: flex;
    text-align: center;
    font-weight: 700;
    padding:15px;
    padding-bottom:48px ;
    
}
.select, .select-logout{
    align-items: center;
    display: flex;
    text-align: center;
    font-weight: 400;
    padding:20px;
    width: 150px;
    justify-content: space-between;
}
.select:hover{
    background: #dee9f6;
    cursor: pointer;
}
.select:hover img {
   filter: grayscale(100%) brightness(50%); 
}
.select:hover .option{
    color:black;
    font-weight: 500;
}
.option,.option-logout{

    position: relative;
    padding-left: 30px;
    font-size: 12px;
    color:#707070; 
}

.select-logout{
    font-weight: 600;
    margin-top:180%;
    cursor: pointer;
}

</style>