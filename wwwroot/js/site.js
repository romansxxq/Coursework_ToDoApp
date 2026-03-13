// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("test-todo-form");

	const resultBox = document.getElementById("test-todo-result");
	const dueInput = document.getElementById("todo-due");
	const taskList = document.getElementById("task-list");
	const completedList = document.getElementById("completed-list");
	const completedCount = document.getElementById("analytics-completed");
	const overdueCount = document.getElementById("analytics-overdue");
	const tabs = document.querySelectorAll(".tab");
	const togglePanel = document.getElementById("toggle-test-panel");
	const testPanel = document.getElementById("test-panel");

	if (dueInput && !dueInput.value) {
		const now = new Date();
		now.setHours(now.getHours() + 2);
		dueInput.value = now.toISOString().slice(0, 16);
	}

	const state = {
		filter: "today",
		tasks: []
	};

	const formatDate = (value) => {
		if (!value) {
			return "";
		}
		const date = new Date(value);
		return date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};

	const isSameDay = (a, b) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const getStatusValue = (status) => {
		if (typeof status === "number") {
			return status;
		}
		if (typeof status === "string") {
			switch (status.toLowerCase()) {
				case "completed":
					return 1;
				case "overdue":
					return 2;
				default:
					return 0;
			}
		}
		return 0;
	};

	const isCompleted = (task) => getStatusValue(task.status) === 1;

	const isOverdue = (task) => {
		if (isCompleted(task)) {
			return false;
		}
		if (getStatusValue(task.status) === 2) {
			return true;
		}
		const due = new Date(task.dueDate);
		return due < new Date();
	};

	const filterTasks = (task) => {
		const due = new Date(task.dueDate);
		if (state.filter === "today") {
			return !isCompleted(task) && isSameDay(due, new Date());
		}
		if (state.filter === "overdue") {
			return isOverdue(task);
		}
		return !isCompleted(task) && !isOverdue(task);
	};

	const priorityClass = (priority) => {
		switch (priority) {
			case 2:
				return "pill-high";
			case 1:
				return "pill-medium";
			default:
				return "pill-low";
		}
	};

	const renderEmpty = (target, message) => {
		if (!target) {
			return;
		}
		target.innerHTML = `<div class="task-empty">${message}</div>`;
	};

	const renderTasks = () => {
		if (!taskList || !completedList) {
			return;
		}

		const activeTasks = state.tasks.filter(filterTasks);
		const doneTasks = state.tasks.filter(isCompleted);

		if (activeTasks.length === 0) {
			renderEmpty(taskList, "No tasks for this view yet.");
		} else {
			taskList.innerHTML = activeTasks
				.map(
					(task) => `
					<div class="task-card">
						<input class="task-check" type="checkbox" data-id="${task.id}" ${isCompleted(task) ? "checked" : ""} />
						<div>
							<div class="task-title">${task.title}</div>
							<div class="task-meta">${formatDate(task.dueDate)}</div>
						</div>
						<div class="task-meta">${task.description || ""}</div>
						<div class="task-pill ${priorityClass(task.priority)}"></div>
					</div>`
				)
				.join("");
		}

		if (doneTasks.length === 0) {
			renderEmpty(completedList, "No completed tasks yet.");
		} else {
			completedList.innerHTML = doneTasks
				.map(
					(task) => `
					<div class="task-card">
						<input class="task-check" type="checkbox" checked disabled />
						<div>
							<div class="task-title">${task.title}</div>
							<div class="task-meta">${formatDate(task.dueDate)}</div>
						</div>
						<div class="task-meta">${task.description || ""}</div>
						<div class="task-pill ${priorityClass(task.priority)}"></div>
					</div>`
				)
				.join("");
		}

		if (completedCount) {
			completedCount.textContent = doneTasks.length;
		}
		if (overdueCount) {
			overdueCount.textContent = state.tasks.filter(isOverdue).length;
		}
	};

	const loadTasks = async () => {
		try {
			const response = await fetch("/tasks");
			if (!response.ok) {
				throw new Error(`Failed to load tasks (${response.status}).`);
			}
			state.tasks = await response.json();
			renderTasks();
		} catch (error) {
			if (taskList) {
				renderEmpty(taskList, "Failed to load tasks.");
			}
		}
	};

	const handleComplete = async (event) => {
		const target = event.target;
		if (!target.classList.contains("task-check") || !target.dataset.id) {
			return;
		}

		const task = state.tasks.find((item) => item.id === target.dataset.id);
		if (!task || isCompleted(task)) {
			return;
		}

		try {
			const response = await fetch(`/tasks/${target.dataset.id}/complete`, {
				method: "POST"
			});
			if (!response.ok) {
				throw new Error("Complete failed.");
			}
			await loadTasks();
		} catch (error) {
			target.checked = false;
		}
	};

	if (tabs.length > 0) {
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				tabs.forEach((item) => item.classList.remove("active"));
				tab.classList.add("active");
				state.filter = tab.dataset.filter;
				renderTasks();
			});
		});
	}

	if (taskList) {
		taskList.addEventListener("change", handleComplete);
	}

	if (togglePanel && testPanel) {
		togglePanel.addEventListener("click", () => {
			testPanel.classList.toggle("hidden");
			testPanel.setAttribute(
				"aria-hidden",
				testPanel.classList.contains("hidden") ? "true" : "false"
			);
		});
	}

	if (form) {
		form.addEventListener("submit", async (event) => {
			event.preventDefault();

			const payload = {
				title: document.getElementById("todo-title").value.trim(),
				description: document.getElementById("todo-description").value.trim(),
				dueDate: new Date(document.getElementById("todo-due").value).toISOString(),
				priority: Number(document.getElementById("todo-priority").value),
				repetitionType: Number(document.getElementById("todo-repetition").value),
				telegramChatId: Number(document.getElementById("todo-chat").value)
			};

			if (resultBox) {
				resultBox.textContent = "Sending...";
			}

			try {
				const response = await fetch("/tasks", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});

				const text = await response.text();
				if (!response.ok) {
					if (resultBox) {
						resultBox.textContent = `Error ${response.status}: ${text}`;
					}
					return;
				}

				if (resultBox) {
					resultBox.textContent = text || "Created.";
				}
				await loadTasks();
			} catch (error) {
				if (resultBox) {
					resultBox.textContent = `Request failed: ${error}`;
				}
			}
		});
	}

	loadTasks();
});
