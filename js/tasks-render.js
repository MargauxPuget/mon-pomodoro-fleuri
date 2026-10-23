// Création des lignes et affichage des tâches

function makeButton(text, className, label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", action);
    return button;
}

function deleteTask(task) {
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) {
        return;
    }

    tasks = tasks.filter(item => item.id !== task.id);
    saveTasks();
    renderTasks();

    announcement.textContent = `Tâche supprimée : ${task.title}`;
}

function createTaskCheckbox(task) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Terminer : ${task.title}`);

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
    });

    return checkbox;
}

function createTaskTitle(task) {
    const title = document.createElement("span");
    title.className = "task-item-title";
    title.textContent = task.title;

    if (task.completed) {
        title.classList.add("is-completed-title");
    }

    return title;
}

function createTaskSessions(task) {
    const sessions = document.createElement("span");
    sessions.className = "task-item-sessions";
    sessions.textContent =
        `${task.sessions} session${task.sessions > 1 ? "s" : ""}`;

    return sessions;
}

function createTaskRow(task, location) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.needsReschedule) {
        item.classList.add("task-needs-reschedule");
    }
    if (task.completed) item.classList.add("is-completed");

    item.append(
        createTaskCheckbox(task),
        createTaskTitle(task),
        createTaskSessions(task)
    );

    if (task.needsReschedule && location === "backlog") {
        const badge = document.createElement("span");
        badge.className = "reschedule-badge";
        badge.textContent = "À replanifier";
        item.appendChild(badge);
    }
    

    if (location === "backlog") {
        item.appendChild(createPlanningSelect(task));

        item.appendChild(makeButton(
            "→",
            "task-action-button",
            `Déplacer ${task.title} vers À faire maintenant`,
            () => {
                task.status = "now";
                task.plannedDate = null;
                saveTasks();
                renderTasks();
            }
        ));
    } else if (location === "now") {
        item.appendChild(makeButton(
            "←",
            "task-action-button",
            `Renvoyer ${task.title} dans À classer`,
            () => {
                task.status = "backlog";
                task.plannedDate = null;
                saveTasks();
                renderTasks();
            }
        ));
    }

    item.appendChild(makeButton(
        "×",
        "task-delete-button",
        `Supprimer la tâche : ${task.title}`,
        () => deleteTask(task)
    ));

    return item;
}

function renderTasks() {
    backlogList.replaceChildren();
    nowList.replaceChildren();

    const unplannedTasks = tasks.filter(task =>
        task.status === "backlog" && task.plannedDate === null
    );

    const nowTasks = tasks.filter(task => task.status === "now");

    unplannedTasks.forEach(task => {
        backlogList.appendChild(createTaskRow(task, "backlog"));
    });

    nowTasks.forEach(task => {
        nowList.appendChild(createTaskRow(task, "now"));
    });

    backlogEmpty.hidden = unplannedTasks.length > 0;
    nowEmpty.hidden = nowTasks.length > 0;

    const completedCount = nowTasks.filter(task => task.completed).length;
    const totalCount = nowTasks.length;

    taskSummary.textContent =
        `${completedCount} tâche${completedCount > 1 ? "s" : ""} terminée${completedCount > 1 ? "s" : ""} sur ${totalCount}.`;

    const totalMinutes = nowTasks.reduce(
        (sum, task) => sum + task.sessions * settings.work,
        0
    );

    const remainingMinutes = nowTasks
        .filter(task => !task.completed)
        .reduce((sum, task) => sum + task.sessions * settings.work, 0);

    taskTime.textContent =
        `Temps nécessaire global : ${formatDuration(totalMinutes)}`;

    taskRestTime.textContent =
        `Temps nécessaire restant : ${formatDuration(remainingMinutes)}`;

    renderPlanning();
}
