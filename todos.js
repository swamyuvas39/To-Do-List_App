const todoNameInput = document.getElementById('todo-name');
const todoDescInput = document.getElementById('todo-description');
const addItemBtn = document.getElementById('add-item');
const remainingList = document.getElementById('remaining-list');
const doneList = document.getElementById('done-list');

addItemBtn.addEventListener('click', addTodo);

// CRUD CRUD API endpoint
const apiBaseUrl = 'https://crudcrud.com/api/503f506ec2a44559b1fb47a55cf550eb';

function addTodo() {
    const todoName = todoNameInput.value.trim();
    const todoDesc = todoDescInput.value.trim();

    if (todoName !== '') {
        const todoItem = createTodoItem(todoName, todoDesc);
        remainingList.appendChild(todoItem);
        todoNameInput.value = '';
        todoDescInput.value = '';

        // Save the new to-do item to the API
        saveTodoToAPI({ name: todoName, description: todoDesc });
    }
}

function createTodoItem(name, description, id) {
    const todoItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.textContent = name;
    const desc = document.createElement('p');
    desc.textContent = description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        todoItem.remove();
        // Remove the task from the API
        deleteTodoFromAPI(id);
    });

    todoItem.classList.add('todo-item');
    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    todoItem.appendChild(desc);
    todoItem.appendChild(deleteButton);

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            todoItem.classList.add('completed');
            remainingList.removeChild(todoItem);
            doneList.appendChild(todoItem);
        } else {
            todoItem.classList.remove('completed');
            doneList.removeChild(todoItem);
            remainingList.appendChild(todoItem);
        }
    });

    return todoItem;
}

function saveTodoToAPI(todo) {
    const endpoint = `${apiBaseUrl}/todos`;
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json())
    .then(data => console.log('Saved to-do:', data))
    .catch(error => console.error('Error saving to-do:', error));
}

function loadTodosFromAPI() {
    const endpoint = `${apiBaseUrl}/todos`;
    fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        data.forEach(todo => {
            const todoItem = createTodoItem(todo.name, todo.description, todo._id);
            if (todo.completed) {
                todoItem.classList.add('completed');
                doneList.appendChild(todoItem);
            } else {
                remainingList.appendChild(todoItem);
            }
        });
    })
    .catch(error => console.error('Error loading to-dos:', error));
}

function deleteTodoFromAPI(taskId) {
    const endpoint = `${apiBaseUrl}/todos/${taskId}`;
    fetch(endpoint, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log('Deleted to-do:', data))
    .catch(error => console.error('Error deleting to-do:', error));
}

// Load existing todos from the API when the page loads
loadTodosFromAPI();