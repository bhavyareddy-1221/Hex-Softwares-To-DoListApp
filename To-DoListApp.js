const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const editTaskBtn = document.getElementById("edit-task");
const taskList = document.getElementById("task-list");

let editMode = null; 


document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", addTask);
editTaskBtn.addEventListener("click", updateTask);

function addTask() {
  if (taskInput.value.trim() === "") return;

  const task = {
    text: taskInput.value,
    completed: false
  };

  addTaskToDOM(task);
  saveTask(task);

  taskInput.value = "";
}

function addTaskToDOM(task) {
  const li = document.createElement("li");

  if (task.completed) {
    li.classList.add("completed");
  }

  const taskText = document.createElement("span");
  taskText.textContent = task.text;
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.classList.add("complete");
  completeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.classList.toggle("completed");
    toggleTaskCompletion(task.text);
  });


  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit");
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    taskInput.value = task.text;
    editMode = task.text;
    editTaskBtn.disabled = false;
    addTaskBtn.disabled = true;
  });

 
  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.classList.add("delete");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeTask(task.text);
    li.remove();
  });

  li.appendChild(taskText);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(delBtn);

  taskList.appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToDOM);
}

function toggleTaskCompletion(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === text ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(text) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask() {
  if (!editMode) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.text === editMode ? { ...task, text: taskInput.value } : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskList.innerHTML = "";
  tasks.forEach(addTaskToDOM);

  taskInput.value = "";
  editMode = null;
  editTaskBtn.disabled = true;
  addTaskBtn.disabled = false;
}