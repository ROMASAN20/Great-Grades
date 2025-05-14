function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const now = new Date();
  const pendingEl = document.getElementById('pending');
  const completedEl = document.getElementById('completed');
  const expiredEl = document.getElementById('expired');
  pendingEl.innerHTML = '';
  completedEl.innerHTML = '';
  expiredEl.innerHTML = '';

  tasks.forEach((task, i) => {
    const taskDate = new Date(task.date);
    const taskEl = document.createElement('div');
    taskEl.className = 'task';
    taskEl.innerHTML = \`\${task.name} (\${task.subject}) - \${new Date(task.date).toLocaleString()}
      <input type="checkbox" onchange="completeTask(\${i})" \${task.completed ? 'checked' : ''} />\`;

    if (task.completed) {
      completedEl.appendChild(taskEl);
    } else if (taskDate < now) {
      expiredEl.appendChild(taskEl);
    } else {
      pendingEl.appendChild(taskEl);
    }
  });
}

function addTask() {
  const name = document.getElementById('taskName').value;
  const date = document.getElementById('taskDate').value;
  const subject = document.getElementById('subject').value;
  if (!name || !date || !subject) return alert('Faltan datos');

  const task = { name, date, subject, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();
  notify("Tarea agregada", \`\${name} (\${subject}) para \${new Date(date).toLocaleString()}\`);
}

function completeTask(index) {
  tasks[index].completed = true;
  saveTasks();
  renderTasks();
}

function notify(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
