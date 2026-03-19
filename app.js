const STORAGE_KEY = "taskflow-tasks";
const THEME_KEY = "taskflow-theme";

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

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
const themeToggleButton = document.getElementById("theme-toggle");

let tasks = loadTasks();
let currentFilter = "all";
let currentSearch = "";
let currentSort = "newest";

/**
 * Recupera un valor desde `localStorage` sin romper la app si el acceso falla.
 * @param {string} key
 * @returns {string|null}
 */
function safeStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error al leer LocalStorage:", error);
    return null;
  }
}

/**
 * Guarda un valor en `localStorage` sin romper la app si el acceso falla.
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
function safeStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
    return false;
  }
}

/**
 * Normaliza un objeto “task” hacia el shape esperado por la app.
 * @param {any} maybeTask
 * @param {number} fallbackIndex
 * @returns {{id: string, title: string, completed: boolean, createdAt: string} | null}
 */
function normalizeTask(maybeTask, fallbackIndex) {
  if (!maybeTask || typeof maybeTask !== "object") return null;

  const title = typeof maybeTask.title === "string" ? maybeTask.title.trim() : "";
  const completed = typeof maybeTask.completed === "boolean" ? maybeTask.completed : false;

  if (!title) return null;

  const id =
    typeof maybeTask.id === "string" && maybeTask.id
      ? maybeTask.id
      : crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${fallbackIndex}`;

  const createdAtRaw = maybeTask.createdAt;
  const createdAtDate = new Date(createdAtRaw);
  const createdAt = isNaN(createdAtDate.getTime())
    ? new Date().toISOString()
    : createdAtDate.toISOString();

  return { id, title, completed, createdAt };
}

/**
 * Carga tareas desde LocalStorage y las normaliza para evitar fallos por datos corruptos.
 * @returns {Array<{id: string, title: string, completed: boolean, createdAt: string}>}
 */
function loadTasks() {
  const savedTasks = safeStorageGetItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    // Normalize to the expected task shape to avoid runtime issues.
    return parsedTasks
      .map((task, idx) => normalizeTask(task, idx))
      .filter(Boolean);
  } catch (error) {
    console.error("Error al parsear tareas en LocalStorage:", error);
    return [];
  }
}

function saveTasks() {
  safeStorageSetItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

/**
 * Valida el título antes de crear una nueva tarea.
 * @param {string} title
 * @returns {{ valid: boolean, message?: string, cleanTitle?: string }}
 */
function validateTaskTitleForCreate(title) {
  const cleanTitle = String(title ?? "").trim();

  if (!cleanTitle) {
    return { valid: false, message: "La tarea no puede estar vacía." };
  }

  // Regla simple para evitar títulos demasiado cortos.
  if (cleanTitle.length < 3) {
    return {
      valid: false,
      message: "La tarea debe tener al menos 3 caracteres."
    };
  }

  if (cleanTitle.length > 100) {
    return {
      valid: false,
      message: "La tarea no puede superar los 100 caracteres."
    };
  }

  const isDuplicate = tasks.some((task) => {
    return task.title.toLowerCase() === cleanTitle.toLowerCase();
  });

  if (isDuplicate) {
    return { valid: false, message: "Ya existe una tarea con ese título." };
  }

  return { valid: true, cleanTitle };
}

function getCompletedCount() {
  return tasks.filter((task) => task.completed).length;
}

function getPendingCount() {
  return tasks.filter((task) => !task.completed).length;
}

/**
 * Aplica filtro (estado), búsqueda y ordenamiento a la lista de tareas.
 * Ordenamiento soportado:
 * - `newest`: tareas más recientes primero (`createdAt` desc)
 * - `oldest`: tareas más antiguas primero (`createdAt` asc)
 * - `alpha`: orden alfabético (A-Z) por `title`
 * @returns {Array<{id: string, title: string, completed: boolean, createdAt: string}>}
 */
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

  if (currentSort === "newest") {
    filteredTasks.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (currentSort === "oldest") {
    filteredTasks.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  } else if (currentSort === "alpha") {
    filteredTasks.sort((a, b) =>
      a.title.localeCompare(b.title, "es", { sensitivity: "base" })
    );
  }

  return filteredTasks;
}

function updateEmptyState(filteredTasks) {
  if (!emptyState) {
    return;
  }

  if (tasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = "No hay tareas todavía.";
    return;
  }

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = "No se encontraron tareas con ese criterio.";
    return;
  }

  emptyState.hidden = true;
}

function renderTasks() {
  if (!taskList) {
    return;
  }

  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = "";

  updateEmptyState(filteredTasks);

  filteredTasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  updateStats();
  updateProgress();
  updateFilterButtons();
}

/**
 * Crea el nodo DOM para una tarea.
 * @param {{id: string, title: string, completed: boolean}} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "animate-taskAppear transition-all duration-200";
  li.dataset.id = task.id;

  const article = document.createElement("article");
  article.className =
    "flex items-center justify-between gap-3.5 px-[18px] py-4 border rounded-xl bg-surface dark:bg-zinc-900 border-borderMain hover:-translate-y-[2px] hover:shadow-card transition dark:border-zinc-700";

  if (task.completed) {
    article.classList.add(
      "bg-[#fffaf7]",
      "border-[#f3d8c2]",
      "dark:bg-zinc-800",
      "dark:border-zinc-700"
    );
  }

  const label = document.createElement("label");
  label.className = "flex flex-1 items-center gap-3 cursor-pointer";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className =
    "w-[18px] h-[18px] shrink-0 cursor-pointer accent-orange-600";
  checkbox.setAttribute("aria-label", `Completar tarea: ${task.title}`);

  const span = document.createElement("span");
  span.className =
    "leading-[1.4] break-words dark:text-zinc-100";
  span.textContent = task.title;

  if (task.completed) {
    span.classList.add(
      "line-through",
      "opacity-75",
      "text-textMuted",
      "dark:text-zinc-400"
    );
  }

  const actions = document.createElement("div");
  actions.className = "flex gap-2.5 shrink-0";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className =
    "shrink-0 px-[14px] py-[10px] rounded-full border font-bold transition hover:-translate-y-[1px] bg-[#fff7ed] text-accentStrong border-[#ffd7bf] hover:bg-[#ffedd5] dark:border-zinc-700 dark:hover:bg-zinc-700";
  editButton.textContent = "Editar";
  editButton.setAttribute("aria-label", `Editar tarea: ${task.title}`);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className =
    "shrink-0 px-[14px] py-[10px] rounded-full border font-bold transition hover:-translate-y-[1px] bg-white text-accentStrong border-dangerBorder hover:bg-dangerSoft dark:border-zinc-700 dark:hover:bg-zinc-700";
  deleteButton.textContent = "Eliminar";
  deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);

  checkbox.addEventListener("change", () => {
    toggleTask(task.id);
  });

  editButton.addEventListener("click", () => {
    editTask(task.id);
  });

  deleteButton.addEventListener("click", () => {
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

/**
 * Añade una nueva tarea (usada por el formulario).
 * @param {string} title
 */
function addTask(title) {
  const validation = validateTaskTitleForCreate(title);
  if (!validation.valid) {
    window.alert(validation.message);
    return;
  }

  const cleanTitle = validation.cleanTitle;

  const newTask = createTask(cleanTitle);
  tasks.unshift(newTask);

  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

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

  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, title: cleanTitle }
      : task
  );

  saveTasks();
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = getCompletedCount();
  const pending = getPendingCount();

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
}

function updateProgress() {
  const total = tasks.length;
  const completed = getCompletedCount();
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (progressEl) {
    progressEl.style.width = `${percent}%`;
  }

  if (progressTextEl) {
    progressTextEl.textContent = `${percent}% completado`;
  }
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

/**
 * Actualiza el criterio de ordenamiento y re-renderiza la lista.
 * @param {"newest"|"oldest"|"alpha"} sortKey
 */
function setSort(sortKey) {
  currentSort = sortKey;
  renderTasks();
}

function completeAllTasks() {
  if (tasks.length === 0) {
    return;
  }

  tasks = tasks.map((task) => ({
    ...task,
    completed: true
  }));

  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

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

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    addTask(taskInput.value);
    form.reset();
    taskInput.focus();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    setSearch(event.target.value);
  });
}

if (sortSelect) {
  sortSelect.value = currentSort;

  sortSelect.addEventListener("change", (event) => {
    setSort(event.target.value);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setFilter(button.dataset.filter);
  });
});

if (completeAllButton) {
  completeAllButton.addEventListener("click", completeAllTasks);
}

if (clearCompletedButton) {
  clearCompletedButton.addEventListener("click", clearCompletedTasks);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

loadTheme();
renderTasks();