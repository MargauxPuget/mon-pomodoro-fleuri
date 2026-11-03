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
    const duration = document.createElement("span");
    duration.className = "task-item-sessions";
    duration.textContent = `${task.minutes} min`;

    return duration;
}

function enableTaskDrag(item, task, location) {
    item.draggable = true;

    item.addEventListener("dragstart", () => {
        item.classList.add("is-dragging");
    });

    item.addEventListener("dragend", () => {
        item.classList.remove("is-dragging");
    });

    const list = location === "backlog" ? backlogList : nowList;

    item.addEventListener("dragover", event => {
        event.preventDefault();

        const draggingItem = list.querySelector(".is-dragging");

        if (!draggingItem || draggingItem === item) return;

        const rect = item.getBoundingClientRect();
        const after = event.clientY > rect.top + rect.height / 2;

        list.insertBefore(
            draggingItem,
            after ? item.nextSibling : item
        );
    });

    item.addEventListener("drop", () => {
        const orderedIds = [...list.querySelectorAll(".task-item")]
            .map(element => {
                const checkbox = element.querySelector(".task-checkbox");
                return tasks.find(task => task.id === element.dataset.taskId);
            })
            .filter(Boolean);

        const otherTasks = tasks.filter(task => task.status !== locationStatus(location));

        tasks = [...otherTasks, ...orderedIds];
        saveTasks();
    });

    item.dataset.taskId = task.id;
}

function locationStatus(location) {
    return location === "backlog" ? "backlog" : "now";
}

function createTaskRow(task, location) {
    const item = document.createElement("li");
    item.className = "task-item";

    enableTaskDrag(item, task, location);

    // Restaurer la surbrillance de la tâche
    if (task.highlighted) {
        item.classList.add("is-highlighted");
    }

    // Activer ou retirer la surbrillance au clic
    item.addEventListener("click", (event) => {
        // Ne pas déclencher la surbrillance en cliquant sur un bouton
        if (event.target.closest("button, input, select")) {
            return;
        }

        task.highlighted = !task.highlighted;
        saveTasks();
        renderTasks();
    });

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
    (sum, task) => sum + (Number(task.minutes) || 0),
    0
);

const remainingMinutes = nowTasks
    .filter(task => !task.completed)
    .reduce((sum, task) => sum + (Number(task.minutes) || 0), 0);

    taskTime.textContent =
        `Temps nécessaire global : ${formatDuration(totalMinutes)}`;

    taskRestTime.textContent =
        `Temps nécessaire restant : ${formatDuration(remainingMinutes)}`;

    renderPlanning();
}
