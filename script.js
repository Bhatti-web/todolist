const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-completed');

// 1. State Structure (Array of Objects)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Add Task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText) {
        const newTask = { id: Date.now(), text: taskText, completed: false };
        tasks.push(newTask);
        todoInput.value = '';
        saveAndRender();
    }
});

// Render Tasks
function renderTasks() {
    todoList.innerHTML = '';
    
    // Filtering Logic
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;
        todoList.appendChild(li);
    });
}

// Toggle Complete
window.toggleTask = (id) => {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveAndRender();
};

// Delete Task
window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
};

// Clear Completed
clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
});

// Filter Switching
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Save to Local Storage
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Initial Load
renderTasks();
