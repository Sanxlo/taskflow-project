const STORAGE_KEY = "taskflow-tasks";

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const searchInput = document.getElementById("search-input");

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const pendingTasksEl = document.getElementById("pending-tasks");

const progressEl = document.getElementById("progress");
const progressTextEl = document.getElementById("progress-text");

const filterButtons = document.querySelectorAll("[data-filter]");
const clearCompletedButton = document.getElementById("clear-completed");
const completeAllButton = document.getElementById("complete-all");

let tasks = loadTasks();
let currentFilter = "all";
let currentSearch = "";

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }
  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      return parsedTasks;
    }

    return [];
  } catch (error) {
    console.error("Error al leer LocalStorage:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function getCompletedCount() {
  return tasks.filter((task) => task.completed).length;
}

function getPendingCount() {
  return tasks.filter((task) => !task.completed).length;
}

function getFilteredTasks() {
  let filteredTasks = [...tasks];

  if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (currentSearch) {
    const searchText = currentSearch.toLowerCase();

    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchText)
    );
  }

  return filteredTasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateStats();
  updateProgress();
  updateFilterButtons();
}
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item animate-taskAppear transition-all duration-200";
  li.dataset.id = task.id;

  const article = document.createElement("article");
  article.className = "task-card flex items-center justify-between gap-3.5 px-[18px] dark:border-zinc-700 rounded-mdx bg-surface dark:bg-zinc-900 py-4 border border-borderMain rounded-mdx bg-surface hover:-translate-y-[2px] hover:shadow-card transition";

  if (task.completed) {
    article.classList.add("bg-[#fffaf7]", "border-[#f3d8c2]","dark:bg-zinc-800", "dark:border-zinc-700");
  }

  const label = document.createElement("label");
  label.className = "task-main flex flex-1 items-center gap-3 m-0 cursor-pointer";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox w-[18px] h-[18px] shrink-0 cursor-pointer accent-orange-600";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Completar tarea: ${task.title}`);

  const span = document.createElement("span");
  span.className = "task-label leading-[1.4] dark:text-zinc-100 break-words cursor-pointer";
  span.textContent = task.title;

  if (task.completed) {
    span.classList.add("text-textMuted", "line-through", "opacity-75","dark:text-zinc-400");
  }

  const actions = document.createElement("div");
  actions.className = "task-actions flex gap-2.5 shrink-0";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-task shrink-0 px-[14px] py-[10px] rounded-full bg-[#fff7ed] dark:border-zinc-700 font-bold hover:bg-[#ffedd5] dark:hover:bg-zinc-700  text-accentStrong border border-[#ffd7bf] font-bold hover:bg-[#ffedd5] hover:-translate-y-[1px] transition";
  editButton.textContent = "Editar";
  editButton.setAttribute("aria-label", `Editar tarea: ${task.title}`);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-task shrink-0 px-[14px] py-[10px] rounded-full bg-white text-accentStrong dark:border-zinc-700 font-bold hover:bg-[#ffedd5] dark:hover:bg-zinc-700  border border-dangerBorder font-bold hover:bg-dangerSoft hover:-translate-y-[1px] transition";
  deleteButton.textContent = "Eliminar";
  deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);

  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  editButton.addEventListener("click", function () {
    editTask(task.id);
  });

  deleteButton.addEventListener("click", function () {
    deleteTask(task.id, li);
  });

  label.appendChild(checkbox);
  label.appendChild(span);

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  article.appendChild(label);
  article.appendChild(actions);

  li.appendChild(article);

  return li;
}

function addTask(title) {
  const cleanTitle = title.trim();

  if (!cleanTitle) {
    return;
  }

  const newTask = createTask(cleanTitle);
  tasks.unshift(newTask);

  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId, taskElement) {
  if (taskElement) {
    taskElement.classList.add("opacity-0", "translate-x-6");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== taskId);
      saveTasks();
      renderTasks();
    }, 180);

    return;
  }

  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  const taskToEdit = tasks.find((task) => task.id === taskId);

  if (!taskToEdit) {
    return;
  }

  const newTitle = window.prompt("Editar tarea:", taskToEdit.title);

  if (newTitle === null) {
    return;
  }

  const cleanTitle = newTitle.trim();

  if (!cleanTitle) {
    return;
  }

  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        title: cleanTitle
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = getCompletedCount();
  const pending = getPendingCount();

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
}

function updateProgress() {
  const total = tasks.length;
  const completed = getCompletedCount();

  let percent = 0;

  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  progressEl.style.width = `${percent}%`;
  progressTextEl.textContent = `${percent}% completado`;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;

    button.classList.toggle("is-active", isActive);

    if (isActive) {
      button.classList.remove(
        "border-borderMain",
        "bg-white",
        "text-textMain",
        "hover:border-accent",
        "hover:bg-[#fffaf0]"
      );

      button.classList.add(
        "border-transparent",
        "bg-gradient-to-br",
        "from-accent",
        "to-accentStrong",
        "text-white",
        "shadow-button"
      );
    } else {
      button.classList.remove(
        "border-transparent",
        "bg-gradient-to-br",
        "from-accent",
        "to-accentStrong",
        "text-white",
        "shadow-button"
      );

      button.classList.add(
        "border-borderMain",
        "bg-white",
        "text-textMain",
        "hover:border-accent",
        "hover:bg-[#fffaf0]"
      );
    }
  });
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function setSearch(searchText) {
  currentSearch = searchText.trim();
  renderTasks();
}

function completeAllTasks() {
  if (tasks.length === 0) {
    return;
  }

  tasks = tasks.map((task) => {
    return {
      ...task,
      completed: true
    };
  });

  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  addTask(taskInput.value);
  form.reset();
  taskInput.focus();
});

if (searchInput) {
  searchInput.addEventListener("input", function (event) {
    setSearch(event.target.value);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    setFilter(button.dataset.filter);
  });
});

if (completeAllButton) {
  completeAllButton.addEventListener("click", completeAllTasks);
}

if (clearCompletedButton) {
  clearCompletedButton.addEventListener("click", clearCompletedTasks);
}

const themeToggleButton = document.getElementById("theme-toggle");
const THEME_KEY = "taskflow-theme";

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";

  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

loadTheme();

renderTasks();