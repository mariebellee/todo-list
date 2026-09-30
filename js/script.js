const input = document.querySelector('#taskInput');
const btn = document.querySelector('#addButton');
const feedback = document.querySelector('#feedback');
const list = document.querySelector('#taskList');



function save() {
    // JSON.stringify turns the array into a string
    const json = JSON.stringify(tasks);
    localStorage.setItem('tasks', json);
}

function load() {
    const raw = localStorage.getItem('tasks');
    // JSON.parse(null) gives null, so we fall back to an empty array []
    return JSON.parse(raw) || [];
}

let tasks = load();



function renderTasks() {
    list.innerHTML = ''; // Session 8, Slide 9: clear, or you duplicate

    // Session 7, Slide 15: forEach runs code per item
    tasks.forEach(function(task) {

        // Session 8, Slide 8: Create, fill, attach
        const li = document.createElement('li');
        li.classList.add('task');
        
        // Session 8, Slide 15 (KEY IDEA): Store the ID on the HTML element
        li.dataset.id = task.id;

        if (task.completed === true) {
            li.classList.add('completed');
        }

        const leftSide = document.createElement('div');
        leftSide.classList.add('task-left');

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox'); // Session 8, Slide 7
        if (task.completed === true) {
            checkbox.setAttribute('checked', 'true');
        }

        const span = document.createElement('span');
        span.textContent = task.text;

        // Session 8, Slide 8: append()
        leftSide.append(checkbox);
        leftSide.append(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-button');

        li.append(leftSide);
        li.append(deleteBtn);

        list.append(li);
    });
}



function addTask() {
    const taskText = input.value;

    // Session 7, Slide 10: Empty string behaves exactly like false
    if (taskText === '') {
        feedback.textContent = 'Please enter a task.';
        return;
    }
    
    feedback.textContent = '';

    const newTask = {
        id: Date.now() + "", // Turn ID into a string to match dataset.id later
        text: taskText,
        completed: false
    };

    tasks.push(newTask); 
    save();
    renderTasks();
    
    input.value = '';
}


function deleteTask(id) {
    // filter() keeps only the items that pass
    tasks = tasks.filter(function(task) {
        return task.id !== id; 
    });
    save();
    renderTasks();
}


function toggleTask(id) {
    // map() returns a new array, one result per item
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            task.completed = !task.completed; // Session 8, Slide 8: flip the boolean
        }
        return task;
    });
    save();
    renderTasks();
}

btn.addEventListener('click', function() {
    addTask();
});

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});



list.addEventListener('click', function(event) {
    
    // closest() walks up to find the li
    const li = event.target.closest('li');

    // Session 8, Slide 5: No match returns null
    if (li === null) {
        return; 
    }

    // Read the ID back from the HTML
    const id = li.dataset.id; 

    // If they clicked the delete button
    if (event.target.closest('.delete-button')) {
        deleteTask(id);
        return;
    }

    // If they clicked the checkbox
    if (event.target.closest('input')) {
        toggleTask(id);
        return;
    }
});

// Run once to show tasks on page load
renderTasks();