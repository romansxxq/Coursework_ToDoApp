// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Test ToDo form handler.
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("test-todo-form");
	if (!form) {
		return;
	}

	const resultBox = document.getElementById("test-todo-result");
	const dueInput = document.getElementById("todo-due");

	if (dueInput && !dueInput.value) {
		const now = new Date();
		now.setHours(now.getHours() + 2);
		dueInput.value = now.toISOString().slice(0, 16);
	}

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

		if (!resultBox) {
			return;
		}

		resultBox.textContent = "Sending...";

		try {
			const response = await fetch("/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			const text = await response.text();
			if (!response.ok) {
				resultBox.textContent = `Error ${response.status}: ${text}`;
				return;
			}

			resultBox.textContent = text || "Created.";
		} catch (error) {
			resultBox.textContent = `Request failed: ${error}`;
		}
	});
});
