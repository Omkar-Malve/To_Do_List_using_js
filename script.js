"use strict";

const STORAGE_KEY = "my-tasks";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const categoryInput = document.querySelector("#todo-category");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#task-count");
const summary = document.querySelector("#list-summary");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyMessage = document.querySelector("#empty-message");
const clearCompletedButton = document.querySelector("#clear-completed");
const storageNotice = document.querySelector("#storage-notice");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let activeFilter = "all";

function showStorageNotice(message) {
    storageNotice.textContent = message;
    storageNotice.hidden = false;
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);
        if (!Array.isArray(parsedTasks)) {
            throw new Error("Saved task data is not a list.");
        }

        return parsedTasks.filter((task) =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        ).map((task) => ({
            ...task,
            category: task.category === "work" ? "work" : "personal"
        }));
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        showStorageNotice("Saved tasks could not be loaded. Your new tasks may not be saved.");
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        storageNotice.hidden = true;
    } catch (error) {
        console.error("Could not save tasks:", error);
        showStorageNotice("Your tasks could not be saved in this browser.");
    }
}

function renderTasks() {
    const visibleTasks = tasks.filter((task) => {
        if (activeFilter === "active") return !task.completed;
        if (activeFilter === "completed") return task.completed;
        return true;
    });
    const remaining = tasks.filter((task) => !task.completed).length;
    const completed = tasks.length - remaining;

    list.replaceChildren();
    visibleTasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = `todo-item${task.completed ? " is-completed" : ""}`;

        const toggle = document.createElement("button");
        toggle.className = "task-toggle";
        toggle.type = "button";
        toggle.textContent = "✓";
        toggle.setAttribute("aria-label", task.completed ? `Mark ${task.text} as active` : `Complete ${task.text}`);
        toggle.setAttribute("aria-pressed", String(task.completed));
        toggle.addEventListener("click", () => toggleTask(task.id));

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const category = document.createElement("span");
        category.className = `task-category is-${task.category}`;
        category.textContent = task.category === "work" ? "Work" : "Personal";

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Delete ${task.text}`);
        remove.addEventListener("click", () => deleteTask(task.id));

        item.append(toggle, text, category, remove);
        list.append(item);
    });

    count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
    summary.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
    clearCompletedButton.hidden = completed === 0;
    emptyState.hidden = visibleTasks.length > 0;

    if (activeFilter === "active" && tasks.length > 0 && remaining === 0) {
        emptyTitle.textContent = "All caught up";
        emptyMessage.textContent = "You’ve completed every task. Nice work!";
    } else if (activeFilter === "completed" && completed === 0 && tasks.length > 0) {
        emptyTitle.textContent = "Nothing completed yet";
        emptyMessage.textContent = "Finished tasks will show up here.";
    } else {
        emptyTitle.textContent = "A fresh start";
        emptyMessage.textContent = "Add a task above and make today count.";
    }
}

function addTask(text, category) {
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    tasks.unshift({
        id,
        text,
        category,
        completed: false
    });
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
        input.focus();
        return;
    }

    addTask(text, categoryInput.value);
    input.value = "";
    input.focus();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });
        renderTasks();
    });
});

clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
