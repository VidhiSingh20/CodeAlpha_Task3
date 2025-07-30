const API_URL = '/api/tasks';
const socket = io();

// DOM elements
const columns = {
  todo: document.getElementById('todo-column'),
  inprogress: document.getElementById('inprogress-column'),
  done: document.getElementById('done-column')
};

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Drag & drop setup
let draggedCard = null;

function loadTasks() {
  fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if using auth
    }
  })
    .then(res => res.json())
    .then(data => {
      data.forEach(task => renderTask(task));
    })
    .catch(err => console.error('Error loading tasks:', err));
}

function renderTask(task) {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.draggable = true;
  card.id = task._id;
  card.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
  `;

  // Drag events
  card.addEventListener('dragstart', () => {
    draggedCard = card;
  });

  card.addEventListener('dragend', () => {
    draggedCard = null;
  });

  columns[task.status]?.appendChild(card);
}

// Allow drop on columns
Object.values(columns).forEach(column => {
  column.addEventListener('dragover', e => e.preventDefault());

  column.addEventListener('drop', e => {
    e.preventDefault();
    if (!draggedCard) return;

    const taskId = draggedCard.id;
    const newStatus = column.dataset.status;

    // Update UI
    column.appendChild(draggedCard);

    // Emit WebSocket update
    socket.emit('taskMoved', { taskId, newStatus });

    // Update in DB
    fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: newStatus })
    });
  });
});

// WebSocket: sync task movement
socket.on('taskMoved', ({ taskId, newStatus }) => {
  const card = document.getElementById(taskId);
  if (card && columns[newStatus]) {
    columns[newStatus].appendChild(card);
  }
});
