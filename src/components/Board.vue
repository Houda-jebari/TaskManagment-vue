<template>
  <div class="container">
    <div class="searchInput">
      <img src="../assets/Icons/Board/search.png" />
      <input type="text" placeholder="Search" v-model="input" />
    </div>
    <p class="board-title">Board</p>
    <div class="board-container">
      <div class="column">
        <div class="column-header">
          <p>To do</p>
          <button class="add" @click="openForm('todo')">+</button>
        </div>
        <div class="cards-container">
          <div class="task-card" v-for="task in tasksToDo" :key="task.id">
            <div class="task-header">
              <p>{{capitalize( task.title )}}</p>

                 <img src="../assets/Icons/Board/more.png" class="more" @click="toggleDropdown(task.id)" />
                 <!-- Dropdown menu -->
                <div v-if="showDropdown === task.id" class="dropdown-menu" >
                  <ul>
                    <li @click="deleteTask(task)">Delete Task</li>
                    <li @click ="showTask(task)">Show Task</li>
                  </ul>
                </div>
            </div>
                <hr class="long-line"/>
                <h1 class="subtaks-length">{{task.subtasks.length}}  subtasks </h1>


            
          </div>
        </div>
      </div>
      <div class="column">
        <div class="column-header">
          <p>In progress</p>
          <button class="add" @click="openForm('inProgress')">+</button>
        </div>
        <div class="cards-container">
          <div class="task-card" v-for="task in tasksInProgress" :key="task.id">
            <div class="task-header">
              <p>{{ capitalize(task.title) }}</p>
                <img src="../assets/Icons/Board/more.png" class="more" @click="toggleDropdown(task.id)" />
                  <!-- Dropdown menu -->
                    <div v-if="showDropdown === task.id" class="dropdown-menu">
                      <ul>
                        <li @click="deleteTask(task)">Delete Task</li>
                        <li @click ="showTask(task)">Show Task</li>
                      </ul>
                    </div>
            </div>
            <hr class="long-line"/>
            <h1 class="subtaks-length">{{task.subtasks.length}}  subtasks </h1>
           
          </div>
        </div>
      </div>
      <div class="column">
        <div class="column-header">
          <p>Done</p>
          <button class="add" @click="openForm('done')">+</button>
        </div>
        <div class="cards-container">
          <div class="task-card" v-for="task in tasksDone" :key="task.id">
            <div class="task-header">
              <p>{{ capitalize(task.title) }}</p>
                <img src="../assets/Icons/Board/more.png" class="more" @click="toggleDropdown(task.id)" />
              <!-- Dropdown menu -->
              <div v-if="showDropdown === task.id" class="dropdown-menu">
                <ul>
                  <li @click="deleteTask(task)">Delete Task</li>
                  <li @click ="showTask(task)">Show Task</li>

                </ul>
              </div>
              <hr class="long-line"/>
              <h1 class="subtaks-length">{{task.subtasks.length}}  subtasks </h1>

            
          </div>
        </div>
      </div>
    </div>

    <!-- Form overlay -->
    <div class="form-overlay" v-if="showForm">
      <div class="form-container">
        <h2 class="form-title">Add new task</h2>
        <form @submit.prevent="addTask">
          <label>Task title:</label>
          <input type="text" v-model="newTaskTitle" />
          <label>Add subtasks:</label>
          <div class="subtask-input-add">
            <input
              type="text"
              v-model="newSubtaskTitle"
              @keydown.enter.prevent="addSubtask"
            />
          </div>
          <ul>
            <li class="subtask-x" v-for="(subtask, index) in newSubtasks" :key="index">
              <p>{{ subtask.title }}</p>
              <button type="button" @click="removeSubtask(index)">x</button>
            </li>
          </ul>
          <button class="form-button" type="submit">Add</button>
          <button class="form-button" type="button" @click="cancelAddForm">Cancel</button>
        </form>
      </div>
    </div>
      

    <!--Task Show Form -->


    <div class="form-overlay" v-if="showTaskForm" >
      <div class="form-container" >
        <div class="task-info">
          <div class="header">
            <img src="../assets/Icons/project/close.png" class="x" @click="cancelShowProject"/>
            <h1>Task Informations  : </h1>
            </div>
            
            <div class="tasks-subtasks">
              <div class="title-x">
                <p  v-if="!isEditingTask" class="task-info-title"> {{ capitalize(selectedTask.title) }}</p>
                <input v-else type="text" v-model="editedTaskTitle" @keydown.enter="saveTaskTitle()" @blur="cancelEditTaskTitle" class="input"/>
                 <img src="../assets/Icons/project/modify.png" title ="Modify" @click="modifyTask(task)" />
                 <p class="add-subtask" @click="toggleSubtaskInput(selectedTask.id)"> + </p>

              </div>
             

                
              <ul>
                <li v-for="subtask in selectedTask.subtasks" :key="subtask.id">
                  <div class="subtask">
                    
                    <div class="done-subtask">
                      <img :src=getSubtaskImage(subtask.status) @click="toggleSubtaskStatus(subtask)"/>
                      <span  v-if="editingSubtaskId!==subtask.id" :class="subtask.status==='done' ? 'subtask-done' : 'subtask-undone'">{{ subtask.title }}</span>
                      <input v-else type="text" v-model="editedSubTaskTitle" @keydown.enter="saveSubtaskTitle(subtask)" @blur="cancelEditSubtaskTitle(subtask)" class="input" />
                    </div>
                    <div class="options" >
                      <img src="../assets/Icons/project/modify.png" title ="Modify" @click="modifySubTask(subtask)" class="modifyImg"/>
                      <img src="../assets/Icons/project/delete.png" title ="Delete" @click="deleteSubtask(subtask)">

                    </div>
                  </div>
                </li>
              
              </ul>
               <div v-if="showSubtaskInput === selectedTask.id" class="subtask-input">
                  <input type="text" v-model="newSubtaskTitle" @keydown.enter="addnewSubtask(task)" placeholder="New Subtask" class="input" />
                  <button @click="addnewSubtask()">Add</button>
              </div>
              <hr class="long-line"/>
            </div>

          </div>
      </div>   
    </div>
  </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import doneImage from '@/assets/Icons/project/done.png';
import undoneImage from '@/assets/Icons/project/undone.png';


const input = ref('');
const newTaskTitle = ref('');
const newSubtaskTitle = ref('');
const showForm = ref(false);
const targetColumn = ref('');

const tasksToDo = ref([]);
const tasksInProgress = ref([]);
const tasksDone = ref([]);




const newSubtasks = ref([]);
const user = JSON.parse(localStorage.getItem('user')); // Define user here

const selectedTask=ref('');
const showTaskForm=ref(false);

const toggleSubtaskStatus=async (subtask)=>{
  try{
   
    subtask.status = subtask.status === 'done' ? 'undone' : 'done';
    const reponse=await axios.patch(`http://localhost:8001/api/subtasks/${subtask.id}`,subtask, axiosConfig);
    console.log=(reponse.data);
    }catch(error){
      console.error('error updating subtask status : ' , error);  }
  }


const showSubtaskInput=ref(null);


const toggleSubtaskInput = (taskId) => {
   if (showSubtaskInput.value === taskId) {
    showSubtaskInput.value = null;
    newSubtaskTitle.value = '';
  } else {
    showSubtaskInput.value = taskId;
  }

};

const getSubtaskImage=(status)=> {
      return status === 'done' ? doneImage : undoneImage;
};

const showTask=(task)=>{
  selectedTask.value=task;
  showTaskForm.value=true;
}
const cancelShowProject = () => {
  showTaskForm.value = false;
  selectedTask.value = '';
};





let isEditingTask= ref(false);
let editedTaskTitle = ref('');
let originalTaskTitle = ref('');

let isEditingSubtask= ref(false);
let editedSubTaskTitle= ref('');
let originalSubtaskTitle= ref('');


const modifyTask = () => {
  isEditingTask.value = true;
  editedTaskTitle.value = selectedTask.value.title;
  originalTaskTitle.value = selectedTask.value.title;
};

let editingSubtaskId=ref('');

const modifySubTask = (subtask) => {
  editingSubtaskId.value=subtask.id;
  isEditingSubtask.value = true;
  editedSubTaskTitle.value = subtask.title;
  originalSubtaskTitle.value = subtask.title;
};
const addnewSubtask=async()=>{
  try{
    console.log(selectedTask.value.id);
      const token = localStorage.getItem('token');

        const response = await axios.post(`http://localhost:8001/api/tasks/${selectedTask.value.id}/subtasks/title`,  { title: newSubtaskTitle.value }, // Ensure payload structure
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        
      });

      console.log('Subtask added:', response.data);

  }catch(error){
      console.error('error adding new subtask error : ' , error);
  }

}
const deleteSubtask = async (subtask) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8001/api/subtasks/${subtask.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      const taskIndex = selectedTask.value.subtasks.findIndex(st => st.id === subtask.id);
    if (taskIndex > -1) {
      selectedTask.value.subtasks.splice(taskIndex, 1);
    }
    // Remove the deleted subtask from the UI
    
  } catch (error) {
    console.error('Error deleting subtask:', error);
  }
};

const cancelEditSubtaskTitle = () => {
  editingSubtaskId.value=null;
  editedSubTaskTitle.value = '';
  isEditingSubtask.value = false;
};
const cancelEditTaskTitle = () => {
  editedTaskTitle.value = '';
  isEditingTask.value = false;
};


const saveTaskTitle = async () => {
  if (editedTaskTitle.value.trim() !== originalTaskTitle) {
    selectedTask.value.title = editedTaskTitle.value.trim();  
  }
  await updateTask(selectedTask.value);
  isEditingTask.value = false;
};

const saveSubtaskTitle = async (subtask) => {
  if (editedSubTaskTitle.value.trim() !== originalSubtaskTitle) {
    subtask.title = editedSubTaskTitle.value.trim();
  }
 await updateSubtask(subtask);
  isEditingSubtask.value = false;
  editingSubtaskId.value=null;
};
const savenewSubtask=()=>{

}



const updateTask=async (task)=>{
    try{
      const token = localStorage.getItem('token');
       const response= await axios.put("http://localhost:8001/api/tasks",task,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      } );

    }catch(error){
      console.log("update task error : ",error);
    }
}


const updateSubtask=async (subtask)=>{
  const token = localStorage.getItem('token');
    try{
       const response= await axios.put("http://localhost:8001/api/subtask",subtask,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      } );

    }catch(error){
      console.log("update task error : ",error);
    }
}



const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const openForm = (column) => {
  targetColumn.value = column;
  showForm.value = true;
};

const addSubtask = () => {
  if (newSubtaskTitle.value.trim()) {
    newSubtasks.value.push({ title: newSubtaskTitle.value });
    newSubtaskTitle.value = '';
  }
};

const removeSubtask = (index) => {
  newSubtasks.value.splice(index, 1);
};

const fetchTasks =async () => {
  const token = localStorage.getItem('token');
   await axios.get('http://localhost:8001/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    .then(response => {
      const tasks = response.data;
      console.log('Fetched tasks:', tasks); // Log tasks to console

      tasks.forEach(task => {
        if (task.status === 'todo') {
          tasksToDo.value.push(task);
        } else if (task.status === 'inProgress') {
          tasksInProgress.value.push(task);
        } else if (task.status === 'done') {
          tasksDone.value.push(task);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching tasks', error);
    });
};

const addTask = async () => {
  if (newTaskTitle.value.trim()) {
    const newTask = {
      title: newTaskTitle.value,
      status: targetColumn.value,
      subtasks: [],
    };
    const token = localStorage.getItem('token'); // Get token from localStorage

    try {

      const response = await axios.post('http://localhost:8001/api/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      const createdTask = response.data;
       if (!Array.isArray(createdTask.subtasks)) {
        createdTask.subtasks = [];
      }
      // Function to add subtasks
      const addSubtasks = async (task) => {
        const subtaskPromises = newSubtasks.value.map(async (subtask) => {
          subtask.task_id = task.id;
          try {
            const response = await axios.post(`http://localhost:8001/api/tasks/${task.id}/subtasks`, subtask, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
            const createdSubtask = response.data;
            task.subtasks.push(createdSubtask);
          } catch (error) {
            console.error('Error adding subtask:', error);
          }
        });

        await Promise.all(subtaskPromises);
      };

      // Add subtasks
      await addSubtasks(createdTask);

      // Add task to the corresponding column
      if (createdTask.status === 'todo') {
        tasksToDo.value.push(createdTask);
      } else if (createdTask.status === 'inProgress') {
        tasksInProgress.value.push(createdTask);
      } else if (createdTask.status === 'done') {
        tasksDone.value.push(createdTask);
      }

      showForm.value = false;
      cancelAddForm();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
};

const cancelAddForm = () => {
  showForm.value = false;
  newTaskTitle.value = '';
  newSubtasks.value = [];
};
const showDropdown = ref(null);
const toggleDropdown = (taskId) => {
  if (showDropdown.value === taskId) {
    showDropdown.value = null; // Close dropdown if already open
  } else {
    showDropdown.value = taskId; // Open dropdown for the clicked task
  }
};
const deleteTask = async (task) => {
  try {
      const token = localStorage.getItem('token');

    // Delete task API call
    await axios.delete(`http://localhost:8001/api/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });

    // Remove task from the corresponding column
    if (task.status === 'todo') {
      tasksToDo.value = tasksToDo.value.filter(t => t.id !== task.id);
    } else if (task.status === 'inProgress') {
      tasksInProgress.value = tasksInProgress.value.filter(t => t.id !== task.id);
    } else if (task.status === 'done') {
      tasksDone.value = tasksDone.value.filter(t => t.id !== task.id);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};




onMounted(() => {
   const token = localStorage.getItem('token');
   if (token) {
        console.log('Token found in localStorage:', token);
        if (user) {
          console.log('User found:', user); // Log user if present
        } else {
          console.log('User not found in localStorage');
        }
        fetchTasks(); // Fetch tasks if token and user are present
      } else {
        console.log('Token not found in localStorage');
      }
  
});





</script>


<style scoped >
.options{
  display: flex;
}
.task-info button{
  background-color: #f5f2f2;
  border-radius: 25px;
  font-size: 12px;
  padding:2px 10px;
  margin: 5px 0 0 5px;
  color :#616874;
}
.header{
  
  display: flex;
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 19px;
  padding-top: 10px;
  position: relative;
  
}  
.done-subtask {
  display:  flex;
  padding-top: 5px;
}
 .subtask{
  display: flex;
  justify-content: space-between
 }
 .subtask img{
  width: 22px;
  height: 22px;
  cursor: pointer;
 }

.subtask span{
  margin-top: 3px;
  margin-left: 2px;
  color: #555;
  font-weight: 300;
}

.subtask-done{
  text-decoration: line-through;
}
.task-info-title{
  padding-top: 5px;
  font-weight: 700;
  font-size: 15px;
  color: #3679ffc0;
  padding-right: 5px;


}
.add-subtask{
  margin-top: 10px;
  padding :2px 10px;
  background-color: #f5f2f2;
  color: #616874;
  border-radius: 20px;
  width: 23px;
  height: 23px;
  font-size: 13px;
  padding-top: 3px;
  padding-right: 3px;
  padding-left: 8px;
  margin-top: -1px;
  margin-top: 5px;
  cursor: pointer;
}
.title-x{
  display: flex;
 
}
.modifyImg{
  padding: 3px;
  cursor: pointer;

}
.title-x img{
  padding: 2px;
  cursor: pointer;

}
.tasks-subtasks{
  margin-left: 10px;
}
.tasks-subtasks{
  margin-left: 10px;
}
.task-info button{
  background-color: #f5f2f2;
  border-radius: 25px;
  font-size: 12px;
  padding:2px 10px;
  margin: 5px 0 0 5px;
  color :#616874;
}
.subtaks-length{
  color: rgb(75, 147, 255);
  font-weight: 500;
  padding-left: 18px;
  font-size: 14px;

}
.long-line{
  margin: 10px 0;
}
.dropdown-menu{
  background-color:#f2f2f2;
  width: 150px;
  border-radius: 20px;
  align-items: center;
  font-size: 13px;
  position: absolute;
   z-index: 1000; 
  right:0;
  padding: 10px;
  top:25px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.dropdown-menu li{
  cursor: pointer;
  margin-bottom: 5px;
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
  border-radius: 15px;
  outline-color: #aaa;

}

.container{
   padding-left: 180px;
   padding-top: 25px;
    background:white;
    min-height: 100vh;
   
}

.board-title{
    font-weight: 500;
    font-size: 20px;
    color:black;
    padding: 40px 0;

}
.searchInput{
    background: #F5F5F5;
    width: 300px;
    border-radius: 15px;
    border:none;
    height: 30px;
    display: flex;
}
img{
    width: 18px;
    height:18px ;
    margin: 6px;
}
.searchInput img{
    width: 15px;
    height:14px ;
    margin: 7px 5px 2px 18px;
}
.searchInput input{
    background:transparent ;
    margin-top: 10px;
    width: 240px;
    border: none;
    padding-top:0;
    outline: none;
    font-size:12px ;
}


.column{
   
    background: #EEF2F5;
    width:30%;
    height: 100vh;
    border-radius: 20px;
    align-items: center;
    padding-bottom: 15px;
    margin-right: 30px;
   
    
}

.column-header , .task-header{
    display: flex;
    flex: 1;
    justify-content: space-between;
}
.column-header p{
    font-weight: 500;
    margin: 10px 20px;
    font-size: 15px;
    color: black;

}
.add{ 
    width: 24px;
    height: 24px;
    border-radius: 20px;
    margin: 10px 20px;
    font-size: 20px;
}
.cards-container{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.task-card{
    background-color: white;
    width: 80%;
    border-radius:15px ;
    margin:10px;
    position: relative;
    padding-bottom: 15px;

}
.task-card p{
  font-size:  15px;
  color: black;
  word-break: break-word; 
  padding-right: 5px;
  font-weight: 600;
  color: black;
  margin: 10px 20px;
 
}
.task-card img.more{
    width: 14px;
    height: 3px;
    right: 10px;
    margin-top: 20px;
    margin-left: 10px;
    cursor: pointer;
    
}

.subtasks{
    margin-left: 20px;
    font-weight: 500;
    font-size: 12px;
    color :black;
    padding-right: 10px;
}
.subtasks li::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: blue;
    border-radius: 50%; /* Shape the dot */
    margin-right: 10px; /* Space between dot and text */
    vertical-align: middle; /* Center dot vertically */
}
.board-container{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.form-container{
    background: white;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    width: 450px;
}

.form-button{
    background:#3679ffc0;
    color:white;
    width:100px;
    height:40px;
    border-radius:10px;
     border:none;
     margin:20px;
     cursor:pointer;
     font-size: 13px;
}

.form-title{
    font-weight: 600;
}
.subtask-x{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #EEF2F5;
  border-radius: 20px;
  margin: 15px;
  padding :0 20px ;
  word-break: break-word; 
  
  
}

.subtask-input-add input{
    position :relative;
   
}
.subtask-input-add button{
    position:absolute;
    
}
.form-Poject-container{
    background: white;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    
    width: 600px;
    height: 500px; 
    overflow-y: auto; 
    position: relative;
    
}
.form-Poject-container::-webkit-scrollbar {
  width: 14px;
  height: 18px;
}
.form-Poject-container::-webkit-scrollbar-thumb {
  height: 6px;
  border: 4px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  background-color: #ddd;
  -webkit-border-radius: 7px;
  -webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05),
    inset 1px 1px 0px rgba(0, 0, 0, 0.05);
}

.form-Poject-container::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

.form-Poject-container::-webkit-scrollbar-corner {
  background-color: transparent;
}

.x{
  position: absolute;
  right:0px;
  font-weight: 00;
  color: #616874;
  cursor: pointer;

}
.form-button{
    background:#3679ffc0;
    color:white;
    width:100px;
    height:40px;
    border-radius:10px;
     border:none;
     margin:20px;
     cursor:pointer;
     font-size: 13px;
}

.form-title{
    font-weight: 600;
    color:rgba(26, 100, 237, 0.823);
    margin-bottom: 14px;
    font-size: 23px;
    font-weight: 600;

}
.subtask-x{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #EEF2F5;
  border-radius: 20px;
  margin: 15px;
  padding :0 20px ;
  word-break: break-word; 
  
  
}

.subtask-input-add input{
    position :relative;
   
}
.subtask-input-add button{
    position:absolute;
}



</style>