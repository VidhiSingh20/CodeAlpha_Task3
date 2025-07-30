const BASE_URL = "http://localhost:5000";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const socket = io(BASE_URL);

document.getElementById("user-name").textContent = user?.name || "User";

window.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadTasks();
});

// Load Projects to Dropdown
async function loadProjects() {
  try {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projects = await res.json();
    const select = document.getElementById("task-project-select");
    select.innerHTML = '<option value="">Select a Project</option>';
    projects.forEach((project) => {
      const opt = document.createElement("option");
      opt.value = project._id;
      opt.textContent = project.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load projects", err);
  }
}

// Load Tasks
async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    renderTasks(data);
  } catch (err) {
    console.error("Error loading tasks", err);
  }
}

// Render Tasks in Columns
function renderTasks(tasks) {
  ["todo", "inprogress", "done"].forEach((status) => {
    document.getElementById(`${status}-tasks`).innerHTML = "";
  });

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.textContent = task.title;
    div.className = "bg-white p-2 rounded shadow cursor-move";
    div.draggable = true;
    div.dataset.id = task._id;
    div.addEventListener("dragstart", (e) =>
      e.dataTransfer.setData("text/plain", task._id)
    );
    document.getElementById(`${task.status}-tasks`).appendChild(div);
  });
}

// Handle Task Drop
["todo", "inprogress", "done"].forEach((status) => {
  const col = document.getElementById(`${status}-tasks`);
  col.addEventListener("dragover", (e) => e.preventDefault());
  col.addEventListener("drop", async (e) => {
    const id = e.dataTransfer.getData("text/plain");
    await fetch(`${BASE_URL}/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    loadTasks();
    socket.emit("taskMoved", { taskId: id, status });
  });
});

// Sync tasks via socket
socket.on("taskMoved", loadTasks);

// Create task
document.getElementById("create-task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const project = e.target.project.value;

  if (!title || !project) return;

  try {
    await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, project }),
    });
    e.target.reset();
    loadTasks();
  } catch (err) {
    console.error("Task creation failed", err);
  }
});

// Create project
document.getElementById("create-project-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.projectname.value.trim();
  const members = e.target.members.value.trim();
  if (!name) return;

  try {
    await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, members }),
    });
    e.target.reset();
    loadProjects();
  } catch (err) {
    console.error("Project creation failed", err);
  }
});

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out");
  showTab("login");
}
