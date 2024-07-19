<template>
  <div class="container">
    <div class="searchInput">
      <img src="../assets/Icons/Board/search.png" />
      <input class="input"type="text" placeholder="Search" />
    </div>
    <p class="board-title">Projects</p>
    <div class="project-column">
      <div class="column-header">
        <p>All Projects</p>
        <button class="add" @click="openForm()">+</button>
      </div>
      <div class="cards-container">
        <div class="project-card" v-for="project in projects" :key="project.id">
          <div class="project-header">
            <p>{{ capitalize(project.title) }}</p>
           
            <img src="../assets/Icons/Board/more.png" class="more" @click="toggleDropdown(project.id)" />
            
            <!-- Dropdown menu -->
            <div v-if="showDropdown === project.id" class="dropdown-menu">
              <ul>
                <li @click="deleteProject(project)">Delete Project</li>
                <li @click="showProject(project)">Show Project</li>
              </ul>
            </div>

                <!-- Form overlay -->
          <div class="form-overlay" v-if="showFormProject">
            <div class="form-container">
              <h2 class="form-title">Add new project</h2>
              <form @submit.prevent="addProject">
                <label>Project title:</label>
                <input type="text" v-model="newProjectTitle" />
                <label>Project Description:</label>
                <input type="text" v-model="newProjectDescription" />
                <button class="form-button" type="submit">Add Project</button>
                <button class="form-button" type="button" @click="cancelAddProjectForm">Cancel</button>
              </form>
            </div>
          </div>


  
          </div>
          <div class="project-body">
             <p class="project-description">{{ capitalize(project.description) }} </p>
              <hr class="long-line2"/>
              
            <p class="tasks-length"> {{ project.tasks.length }} tasks</p>
            <p class="assignedTo"> Assigned to : </p>
            <ul class="UsersAssigned">
              <li v-if="usersAssigned[project.id] && usersAssigned[project.id].length > 0" v-for="user in usersAssigned[project.id]" :key="user.id">
                  {{ user.name }} : {{ user.email }}
              </li>
               <span  v-else>
                None
               </span>
            </ul>
           
          </div>

        </div>
      </div>
    </div>

  
  
    
    

    <!-- Project details overlay -->
    <div class="form-overlay" v-if="showProjectInfo" >
      <div class="form-Poject-container" ref="projectDetailContainer">
        <img src="../assets/Icons/project/close.png" class="x" @click="cancelShowProject"/>
        <h2 class="form-title">Project details</h2>

        <div class="project-title">

          <div class="title-modify">
            <h1> Project Title:</h1>
            <img src="../assets/Icons/project/modify.png"  @click="modifyTitle()"/>
          </div>
           <p v-if="!isEditingTitle" > {{ capitalize(selectedProject.title )}}</p>
          <input v-else type="text" v-model="editedTitle" @keydown.enter="saveTitle" @blur="cancelEditTitle" class="input"/>

        </div>
         
          <div v-if="selectedProject.description" class="project-descriptioin">
            <div class="title-modify">
              <h1> Description:</h1>
              <img src="../assets/Icons/project/modify.png" @click="modifyDescription()"/>

            </div>
              <p v-if="!isEditingDescription">{{ capitalize(selectedProject.description) }}</p>
             <input v-else v-model="editedDescription" @keydown.enter="saveDescription" @blur="cancelEditDescription" class="input"></input>
          </div>

          <div class="task-info">
            <div class="header">
              <h1>Tasks : </h1>
              <div>
                <button @click="showAddTaskForm" >  + Add new Task</button>
              </div>
            </div>
            
            <div v-if="selectedProject.tasks" v-for="task in selectedProject.tasks" :key="task.id" class="tasks-subtasks">
              <div class="title-x">
                <p  v-if="editingTaskId!==task.id" class="task-info-title"> {{ task.title }}</p>
                <input v-else type="text" v-model="editedTaskTitle" @keydown.enter="saveTaskTitle(task)" @blur="cancelEditTaskTitle"class="input"/>
                 <img src="../assets/Icons/project/modify.png" title ="Modify" @click="modifyTask(task)" />
                  <img class= "assign-img" src="../assets/Icons/project/assign.png" title="Assign to user" @click="showUserForm(task)">

                 <p class="add-subtask" @click="toggleSubtaskInput(task.id)"> + </p>

              </div>
                <div class="assignedTo-details"  v-if="task.assigned_user_id"> 
                <span class="assign"> Assigned to : </span>  
                 <span class="user"> {{ usersAssignedToTasks[task.id]?.name }} : {{ usersAssignedToTasks[task.id]?.email }} </span>
                </div>

                
              <ul>
                <li v-for="subtask in task.subtasks" :key="subtask.id">
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
               <div v-if="showSubtaskInput === task.id" class="subtask-input">
                  <input type="text" v-model="newSubtaskTitle" @keydown.enter="addSubtask(task)" placeholder="New Subtask" class="input" />
                  <button @click="addSubtask(task)">Add</button>
              </div>
              <hr class="long-line"/>
            </div>

          </div>
      </div>   
    </div>





      <!--Task Form overlay -->
       <div class="form-overlay-task" v-if="showTaskForm">
      <div class="form-container-task">
        <h2 class="form-title">Add new task</h2>
        <form @submit.prevent="addTask">
          <label>Task title:</label>
          <input type="text" v-model="newTaskTitle"  class="input"/>
          <label>Add subtasks:</label>
          <div class="subtask-input-add">
            <input
              type="text"
              v-model="newSubtaskTitle"
              @keydown.enter.prevent="addSubtaskToList"
              class="input"
            />
          </div>
          <ul>
            <li class="subtask-x" v-for="(subtask, index) in newSubtasks" :key="index">
              <p>{{ subtask.title }}</p>
              <button type="button" @click="removeSubtask(index)">x</button>
            </li>
          </ul>
          <button  class="form-button" type="submit">Add</button>
          <button class="form-button" type="button" @click="cancelAddTaskForm">Cancel</button>
        </form>
      </div>
    </div>
    
             <!-- assign user  overlay -->
          <div class="form-overlay" v-if="showAssignForm">
            <div class="form-container">
              <h2 class="user-form-title">Assign the user to Task : </h2>
              <form @submit.prevent="assignToUsers">
          
                <div v-for="user in users" :key="user.id" class="checkbox">
                  <input type="checkbox"  :id="user.id"  :checked="isSelected(user.email)" @change="handleSelection(user.email)" >
                  <span>{{ user.email }}</span>
                </div>
                <button class="form-button" type="submit">Assign</button>
                <button class="form-button" type="button" @click="cancelAssignUserForm">Cancel</button>
              </form>
            </div>
          </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import doneImage from '@/assets/Icons/project/done.png';
import undoneImage from '@/assets/Icons/project/undone.png';



const axiosConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Example of retrieving JWT token from localStorage
  },
};

const newProjectTitle = ref('');
const newProjectDescription = ref('');

const newTaskTitle = ref('');
const newSubtaskTitle = ref('');
const showProjectInfo = ref(false);
const showFormProject = ref(false);
const showTaskForm=ref(false);
const selectedProject = ref({ title: '', description:'',tasks: [] });

const usersAssigned=ref({});
const usersAssignedToTasks = ref({});
const selectedUserEmail = ref(null);

let users=ref([]);

const userEmail = ref(''); 
  const isSelected = (email) => {
      return selectedUserEmail.value === email;
    };

const handleSelection = (email) => {
  if (selectedUserEmail.value === email) {
    selectedUserEmail.value = null;
    userEmail.value = '';
  } else {
    selectedUserEmail.value = email;
    userEmail.value = email;
  }
};


const fetchUsers=async()=>{
  try{
    const response=await axios.get('http://localhost:8001/api/users/',axiosConfig);
    if(response){
      
      users.value=response.data;
      
    }
    console.log(users.value);
    users.value.forEach(user => {
        console.log(user.id); // Log each user's ID
      });
  

  
  }catch(error){
    console.log("error fetching users",error);
  }
}

// Method to fetch users assigned to each task
const getUsersAssignedToTasks = async (task) => {
  try {
    console.log(task.assigned_user_id);
    if(task.assigned_user_id){

      const response = await axios.get(`http://localhost:8001/api/user/${task.assigned_user_id}`, axiosConfig);
      usersAssignedToTasks.value[task.id] = response.data;
      //console.log(usersAssignedToTasks.value[task.id]);
    }
  } catch (error) {
    console.error('Error fetching users assigned to task', error);
    usersAssignedToTasks.value[task.id] = []; // Handle error case
  }
};
const getUsersAssigned = async (project) => {
     try {
       const response = await axios.get(`http://localhost:8001/api/task/getUsersOfProject`, {  params: { id: project.id },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },});
      
       usersAssigned.value[project.id] = response.data;
     
     } catch (error) {
       console.error('Error fetching users assigned to project', error);
       usersAssigned.value[project.id] = []; // Handle the error case
     }
   };
const fetchProjects = async () => {
 try {
   const response = await axios.get('http://localhost:8001/api/projects', axiosConfig);
   projects.value = response.data ;
   console.log(response.data);
   for (let project of projects.value) {
           await getUsersAssigned(project);
         }

    for (let project of projects.value) {
      if (project.tasks) {
        for (let task of project.tasks) {
          await getUsersAssignedToTasks(task);
        }
      }}
 

 } catch (error) {
   console.error('Error fetching projects:', error);
 }
};

let isEditingTitle = ref(false);
let editedTitle = ref('');
let originalTitle = ref('');

let isEditingDescription = ref(false);
let editedDescription = ref('');
let originalDescription = ref('');

let isEditingTask= ref(false);
let editedTaskTitle = ref('');
let originalTaskTitle = ref('');

let isEditingSubtask= ref(false);
let editedSubTaskTitle= ref('');
let originalSubtaskTitle= ref('');


const modifyTitle=()=>{
  isEditingTitle.value=true;
  editedTitle.value=selectedProject.value.title;
  originalTitle.value=selectedProject.value.title;
}
const modifyDescription = () => {
  isEditingDescription.value = true;
  editedDescription.value = selectedProject.value.description;
  originalDescription.value = selectedProject.value.description;
};
let editingTaskId=ref('');
const modifyTask = (task) => {
  editingTaskId.value=task.id;
  isEditingTask.value = true;
  editedTaskTitle.value = task.title;
  originalTaskTitle.value = task.title;
};
let editingSubtaskId=ref('');
const modifySubTask = (subtask) => {
  
  editingSubtaskId.value=subtask.id;
  isEditingSubtask.value = true;
  editedSubTaskTitle.value = subtask.title;
  originalSubtaskTitle.value = subtask.title;
};

const cancelEditTitle = () => {
  editedTitle.value = '';
  isEditingTitle.value = false;
};
const cancelEditDescription = () => {
  editedDescription.value = '';
  isEditingDescription.value = false;
};


const cancelEditSubtaskTitle = () => {
  editingSubtaskId.value=null;
  editedSubTaskTitle.value = '';
  isEditingSubtask.value = false;
};
const cancelEditTaskTitle = () => {
  editingTaskId.value=null;
  editedTaskTitle.value = '';
  isEditingTask.value = false;
};
const selectedSubtask = ref(null); 
const showAssignForm = ref(false);

const cancelAssignUserForm=()=>{
  showAssignForm.value = false;
  selectedSubtask.value = null;
  userEmail.value = '';
}
const selectedTask=ref('');
const showUserForm=(task)=>{
  showAssignForm.value=true;
  selectedTask.value = task;
}
const assignToUsers=async()=>{
 try {
  console.log("sekected taaaaaaaaaaask " ,selectedTask.value);
  console.log("selected task id  " ,selectedTask.value.id);
  console.log("email : ",userEmail.value );

   const response=  await axios.post(`http://localhost:8001/api/task/${selectedTask.value.id}/assign`, { email:userEmail.value }, axiosConfig);
     selectedTask.user=response.data.user;
      showAssignForm.value=false;
      userEmail.value='';
      console.log('User assigned successfully');
      cancelAssignUserForm();
    } catch (error) {
      console.error('Error assigning user to subtask:', error);
  }

}
const saveTitle = async () => {
  if (editedTitle.value.trim() !== originalTitle) {
    selectedProject.value.title = editedTitle.value.trim();
    await updateProject();
  }
  isEditingTitle.value = false;
  showProjectInfo.value=true;
};
const saveDescription = async () => {
  if (editedDescription.value.trim() !== originalDescription) {
    selectedProject.value.description = editedDescription.value.trim();
    await updateProject();
  }
  isEditingDescription.value = false;
  showProjectInfo.value=true;
};

const saveTaskTitle = async (task) => {
  if (editedTaskTitle.value.trim() !== originalTaskTitle) {
    task.title = editedTaskTitle.value.trim();
    await updateProject();
  }
  isEditingTask.value = false;
   editingTaskId.value=null;
};

const saveSubtaskTitle = async (subtask) => {
  if (editedSubTaskTitle.value.trim() !== originalSubtaskTitle) {
    subtask.title = editedSubTaskTitle.value.trim();
    await updateProject();
  }
  isEditingSubtask.value = false;
   editingSubtaskId.value=null;
};


const projects = ref([]);
const showAddTaskForm=()=>{
  showTaskForm.value=true;
}
const cancelAddProjectForm = () => {
  showFormProject.value = false;
  newProjectTitle.value = '';
};

const cancelAddTaskForm = () => {
  showTaskForm.value = false;
  
};
const showProject = (project) => {

  selectedProject.value = project; // Deep copy to prevent immediate binding
  if (!selectedProject.value.tasks) {
    selectedProject.value.tasks = [];
  }
  showProjectInfo.value = true;
  console.log("selected project " , selectedProject.value) ;
};

 const getSubtaskImage=(status)=> {
       return status === 'done' ? doneImage : undoneImage;
  };
  
const toggleSubtaskStatus=async (subtask)=>{
  try{
   
    subtask.status = subtask.status === 'done' ? 'undone' : 'done';
    const reponse=await axios.patch(`http://localhost:8001/api/subtasks/${subtask.id}`,subtask, axiosConfig);
    console.log=(reponse.data);
    }catch(error){
      console.error('error updating subtask status : ' , error);  }
  }



const openForm = () => {
  showFormProject.value = true;
};

const addTask = () => {
  if (newTaskTitle.value.trim()) {
    if (!selectedProject.value.tasks) {
      selectedProject.value.tasks = [];
    }
    selectedProject.value.tasks.push({
      title: newTaskTitle.value,
      subtasks: [...newSubtasks.value],
    });
    newTaskTitle.value = '';
    newSubtasks.value = []; // Clear new subtasks
    
  }
};

const newSubtasks = ref([]); // Add this line to store new subtasks
const addSubtaskToList = () => {
  if (newSubtaskTitle.value.trim()) {
    newSubtasks.value.push({
      title: newSubtaskTitle.value,
    });
    newSubtaskTitle.value = '';
  }
};
const showSubtaskInput = ref(null); // Initialize with null


const toggleSubtaskInput = (taskId) => {
   if (showSubtaskInput.value === taskId) {
    showSubtaskInput.value = null;
    newSubtaskTitle.value = '';
  } else {
    showSubtaskInput.value = taskId;
  }

};
const addSubtask =async (task) => {
  if (newSubtaskTitle.value.trim()) {
    if (!task.subtasks) {
      task.subtasks = [];
    }
    task.subtasks.push({ title: newSubtaskTitle.value.trim(),
                         status: 'undone' });

    newSubtaskTitle.value = '';
        await updateProject();

  }

   showSubtaskInput.value = null;
};

const removeSubtask = (index) => {
  newSubtasks.value.splice(index, 1);
};
const addProject = async () => {
  if (newProjectTitle.value.trim()) {
    const newProject = {
      title: newProjectTitle.value,
      description:newProjectDescription.value,
      tasks: selectedProject.value.tasks,
    };

    try {
      const response = await axios.post('http://localhost:8001/api/projects', newProject, axiosConfig);
      fetchProjects();

      const createdProject = response.data;
      projects.value.push(createdProject);
      showFormProject.value = false;
      newProjectTitle.value = '';
      selectedProject.value = { title: '', tasks: [] };
    } catch (error) {
      console.error('Error adding project:', error);
    }
  }
};


const updateProject = async () => {
  try {
    
    const payload = {
      title: selectedProject.value.title,
      description:selectedProject.value.description,
      tasks: selectedProject.value.tasks.map(task => ({
        ...task,
        subtasks: task.subtasks.map(subtask => ({ title: subtask.title })),
      })),
    };

    const response = await axios.put(`http://localhost:8001/api/projects/${selectedProject.value.id}`, payload, axiosConfig);
    const updatedProject = response.data;

    const index = projects.value.findIndex(p => p.id === selectedProject.value.id);
    if (index !== -1) {
      projects.value.splice(index, 1, updatedProject);
    }
    showProjectInfo.value = true;
    fetchUsers();

  } catch (error) {
    console.error('Error updating project:', error);
    console.log('Error response:', error.response); // Log the response for detailed error information
  }
};


/*const cancelAddForm = () => {
  showFormProject.value = false;

};*/

const showDropdown = ref(null);
const toggleDropdown = (projectId) => {
  if (showDropdown.value === projectId) {
    showDropdown.value = null; // Close dropdown if already open
  } else {
    showDropdown.value = projectId; // Open dropdown for the clicked project
  }
};
const imgSrc = ref('');
const done=ref(false);
const className=ref('');



const deleteProject = async (project) => {
  try {
    await axios.delete(`http://localhost:8001/api/projects/${project.id}`, axiosConfig);
    projects.value = projects.value.filter(p => p.id !== project.id);
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};
// Method to delete a subtask
const deleteSubtask = async (subtask) => {
  try {
    await axios.delete(`http://localhost:8001/api/subtasks/${subtask.id}`, axiosConfig);
    // Remove the deleted subtask from the UI
    const taskIndex = selectedProject.value.tasks.findIndex(task => task.id === subtask.task_id);
    if (taskIndex !== -1) {
      selectedProject.value.tasks[taskIndex].subtasks = selectedProject.value.tasks[taskIndex].subtasks.filter(s => s.id !== subtask.id);
    }
  } catch (error) {
    console.error('Error deleting subtask:', error);
  }
};




const cancelShowProject = () => {
  showProjectInfo.value = false;
  selectedProject.value = { title: '',description:'', tasks: [] };
};

onMounted(() => {
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('Token found in localStorage:', token);
    // Fetch projects here
    fetchProjects();
     fetchUsers();
     
  } else {
    console.log('Token not found in localStorage');
  }
});

const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped>

.user-form-title{
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 30px;
  margin-top: 12px;
  margin-left: 5px;
  color:rgba(42, 43, 47, 0.878);
}
.checkbox {
  display: flex;
  align-items: center;
  margin:20px;
}
.checkbox span{
   margin-left: 10px;
   font-weight: 300;

}
.assign{
  font-weight: 500;
  font-size: 14px;
}
.user{
  font-weight: 300;
   color: #555;
   font-size: 14px;
}
.assignedTo-details{
   font-size: 14px;
   padding-left: 15px;
}
.tasks-length{
  color: rgb(75, 147, 255);
  font-weight: 500;
}
.UsersAssigned span{
  color: rgba(199, 2, 2, 0.63);
  padding-left: 8px;
}
.UsersAssigned li::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: blue;
    border-radius: 50%; /* Shape the dot */
    margin-right: 10px; /* Space between dot and text */
    vertical-align: middle; /* Center dot vertically */
}
.UsersAssigned li{
  margin-left: 10px;

}
.assignedTo {
  position: relative;
  
}
.assignedTo span{
  position: absolute;
  
}

.form-overlay-task {
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
.form-container-task{
    background: white;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    width: 340px;
    width: 400px;
    position: relative;
    z-index: 1001;
}


/* Scoped styles specific to Projects.vue */
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
.long-line{
  margin: 10px 0;
}
.long-line2{
  color: #000000;
  margin:10px 0;
}
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
.task-info ul{
  padding-left: 10px;
}
.task-info h1{
  margin-bottom: 8px;

}
.title-modify{
  display: flex;
 

}
.title-modify img{
  padding: 2px;
  cursor: pointer;
}
.task-info h1,.project-descriptioin  h1 ,.project-title h1{
  padding-top: 5px;
  font-weight: 500;
  font-size: 16px;
  margin-right:10px;
  color: black;
 
}

.project-descriptioin p ,.project-title  p{
    margin-left: 10px;
    font-weight: 300;
    color:#555;
    margin-bottom: 10px;
    word-break: break-all;
}
.subtask-info li{
  display: flex;
}

.project-header p{
  font-size: 25px;
  padding:  5px 0;

}
 .project-body{
  margin-left: 20px;
  color: #616874;
  font-size: 14px;
  

 }
.project-column {
  background: #EEF2F5;
  width: 70%;
  height: auto;
  border-radius: 20px;
  align-items: center;
  padding-bottom: 15px;
  margin-right: 30px;
}

.project-column .column-header {
  display: flex;
  justify-content: space-between;
}

.project-column .column-header p {
  font-weight: 500;
  margin: 10px 20px;
  font-size: 15px;
  color: black;
}

.project-column .add {
  width: 24px;
  height: 24px;
  border-radius: 20px;
  margin: 10px 20px;
  font-size: 20px;
}

.project-column .cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-column .project-card {
  background-color: white;
  width: 80%;
  border-radius: 15px;
  margin: 10px;
  position: relative;
  padding-bottom: 15px;
}

.project-column .project-card .project-header {
  display: flex;
  justify-content: space-between;
}

.project-column .project-card .project-header p {
  font-size: 17px;
  font-weight: 600;
  color: black;
  margin: 10px 20px;
  word-break: break-word;
}

.project-column .project-card .project-header img.more {
  width: 14px;
  height: 3px;
  right: 10px;
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
}

.project-column .project-card .tasks {
  margin-left: 20px;
  font-weight: 500;
  font-size: 12px;
  color: black;
  padding-right: 10px;
}

.project-column .project-card .tasks .subtasks {
  margin-left: 20px;
  font-weight: 500;
  font-size: 12px;
  color: black;
  padding-right: 10px;
}

.project-column .project-card .tasks .subtasks li::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: blue;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
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
  z-index: 999;
}


.form-container {
  background: white;
  align-items: center;
  border-radius: 15px;
  padding: 20px;
  width: 340px;
}



.form-button {
  background: #3679ffc0;
  color: white;
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border: none;
  margin: 20px;
  cursor: pointer;
  font-size: 13px;
}



.task-input-add input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
  border-radius: 15px;
  outline-color: #aaa;
  margin-bottom: 10px;
}

.subtask-input-add input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
  border-radius: 15px;
  outline-color: #aaa;
  margin-bottom: 10px;
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
.input,select{
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
    width:70%;
    height: auto;
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
    font-weight: 600;
    color: black;
    
    margin: 10px 15px 10px 20px;
    word-break: break-word; 
    padding-right: 5px;
    
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
  right:20px;
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
.assign-img{
  height: 21px;
  width: 21px;
}



</style>