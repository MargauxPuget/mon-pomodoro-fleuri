// Création des lignes et affichage des tâches

const taskCategories = {
    concours: {
        label: "Concours",
        color: "#DDA6B2"
    },
    menagere: {
        label: "Tâche ménagère",
        color: "#A8B99A"
    },
    cuisine: {
        label: "Cuisine",
        color: "#D9BD8C"
    },
    bricolage: {
        label: "Bricolage",
        color: "#B8A5CE"
    },
    administratif: {
        label: "Administratif",
        color: "#9EADBF"
    },
    jardin: {
        label: "Jardin",
        color: "#91AE8A"
    }
};

function createTaskCategoryIcon(category) {
    const icons = {
        concours: `
            <path d="M7 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
            <path d="M5 7h12M9 8v9"/>
        `,
        menagere: `
            <path d="M4 14h13l-1.5 6h-10Z"/>
            <path d="M7 14l9-10M14 3l4 2"/>
            <path d="M6 17h9"/>
        `,
        cuisine: `
            <circle cx="12" cy="12" r="7"/>
            <circle cx="12" cy="12" r="4"/>
            <path d="M3 5v6M1 5v4M5 5v4M3 11v8"/>
            <path d="M21 5v14M19 5v5h2"/>
        `,
        bricolage: `
            <path d="M3 17l12-12 4 4L7 21Z"/>
            <path d="M5 15l2 2M8 12l2 2M11 9l2 2"/>
            <path d="M3 21h18"/>
        `,
        administratif: `
            <path d="M7 4h10v15H7z"/>
            <path d="M10 8h5M10 11h5M10 14h5"/>
            <path d="M5 7H4v15h11v-1"/>
        `,
        jardin: `
            <path d="M6 13h12l-2 8H8Z"/>
            <path d="M12 13V7"/>
            <path d="M12 9c-5 0-6-4-6-4s5-1 6 4Z"/>
            <path d="M12 8c0-4 4-5 6-4 0 0-1 4-6 4Z"/>
        `
    };

    if (!icons[category]) return null;

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "task-category-icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const group = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
    );

    group.innerHTML = icons[category];
    svg.appendChild(group);

    return svg;
}

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

function createTaskRow(task, location) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.needsReschedule) {
        item.classList.add("task-needs-reschedule");
    }
    if (task.completed) item.classList.add("is-completed");

    const category = taskCategories[task.category];
    
    if (category) {
        categoryBadge = document.createElement("span");
        categoryBadge.className = "task-category-badge";
        categoryBadge.style.color = category.color;
        item.style.backgroundColor = `${category.color}30`;
        item.style.borderColor = `${category.color}80`;

        categoryBadge.setAttribute("aria-label", category.label);
        categoryBadge.title = category.label;
    }

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
