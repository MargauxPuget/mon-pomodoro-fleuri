// Dates, affichage et rendu du planning sur 14 jours

function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes}min`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h${minutes}`;
}

function getMonday(date = new Date()) {
    const monday = new Date(date);
    monday.setHours(12, 0, 0, 0);

    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);

    return monday;
}

function getDayDate(dayOffset) {
    const date = getMonday();
    date.setDate(date.getDate() + dayOffset);
    return date;
}

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDayLabel(date) {
    return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}

function createPlanningSelect(task) {
    const select = document.createElement("select");
    select.className = "task-planning-select";
    select.setAttribute("aria-label", `Planifier ${task.title}`);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "＋ Planifier";
    select.appendChild(defaultOption);

    for (let day = 0; day < 14; day++) {
        const date = getDayDate(day);
        const dateKey = getDateKey(date);

        const option = document.createElement("option");
        option.value = dateKey;
        option.textContent = getDayLabel(date);

        select.appendChild(option);
    }

    select.addEventListener("change", () => {
        if (!select.value) return;

        task.plannedDate = select.value;
        task.needsReschedule = false;

        saveTasks();
        renderTasks();

        announcement.textContent =
            `${task.title} planifiée pour le ${getDayLabel(
                new Date(`${task.plannedDate}T12:00:00`)
            )}.`;
    });

    return select;
}

function renderPlanning() {
    planningGrid.replaceChildren();

    for (let day = 0; day < 14; day++) {
        const cell = document.createElement("section");
        cell.className = "planning-day";
        
        const dayDate = getDayDate(day);
        const dayKey = getDateKey(dayDate);

        const dayTasks = tasks.filter(task =>
            task.plannedDate === dayKey &&
            task.status === "backlog"
        );

        const heading = document.createElement("h3");
        heading.className = "planning-day-title";
        heading.textContent = getDayLabel(dayDate);

        if (getDateKey(dayDate) === getDateKey(new Date())) {
            heading.textContent += " · Aujourd'hui";
            cell.classList.add("is-today");
        }

    
        const list = document.createElement("ul");
        list.className = "planning-task-list";

        dayTasks.forEach(task => {
            const item = document.createElement("li");
            item.className = "planning-task";

            if (task.completed) item.classList.add("is-completed");

            const category = taskCategories[task.category];

            const categoryBadge = document.createElement("span");

            if (category) {
                categoryBadge.className = "task-category-badge";
                categoryBadge.setAttribute("aria-label", category.label);
                categoryBadge.title = category.label;
                item.style.backgroundColor = `${category.color}30`;
                item.style.borderColor = `${category.color}80`;

                const categoryIcon = createTaskCategoryIcon(task.category);

                if (categoryIcon) {
                    categoryBadge.appendChild(categoryIcon);
                }
            }

            const title = document.createElement("span");
            title.className = "planning-task-title";
            title.textContent = task.title;

            const sessions = document.createElement("small");
            sessions.className = "planning-task-duration";
            sessions.textContent = formatDuration(Number(task.minutes) || 0);

            const actions = document.createElement("div");
            actions.className = "planning-task-actions";

            actions.appendChild(makeButton(
                "À faire",
                "planning-action-button",
                `Déplacer ${task.title} vers À faire maintenant`,
                () => {
                    task.status = "now";
                    task.plannedDate = null;
                    saveTasks();
                    renderTasks();
                }
            ));

            actions.appendChild(makeButton(
                "Retirer",
                "planning-action-button",
                `Retirer ${task.title} du planning`,
                () => {
                    task.plannedDate = null;
                    saveTasks();
                    renderTasks();
                }
            ));

            if (category) {
                item.appendChild(categoryBadge);
            }

            item.append(title, sessions, actions);
            list.appendChild(item);
        });

        if (dayTasks.length === 0) {
            const empty = document.createElement("li");
            empty.className = "planning-day-empty";
            empty.textContent = "Un petit espace libre…";
            list.appendChild(empty);
        }

        cell.append(heading, list);
        planningGrid.appendChild(cell);
    }
}
