// Chargement, sauvegarde et report des tâches

let taskCreationTarget = "backlog";

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("pomodoroTasks");
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

        if (!Array.isArray(parsedTasks)) return [];

        return parsedTasks
            .filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.title === "string"
            )
            .map(task => {
                const minutes =
                    Number.isInteger(task.minutes) && task.minutes >= 1
                        ? task.minutes
                        : Number.isInteger(task.sessions) && task.sessions >= 1
                            ? task.sessions * settings.work
                            : 25;

                let plannedDate = null;

            // Conserver les anciennes tâches déjà planifiées.
            if (
                typeof task.plannedDate === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(task.plannedDate)
            ) {
                plannedDate = task.plannedDate;
            } else if (
                Number.isInteger(task.plannedDay) &&
                task.plannedDay >= 0 &&
                task.plannedDay < 14
            ) {
                // Conversion des anciennes dates relatives en dates réelles.
                const oldDate = new Date();
                oldDate.setHours(12, 0, 0, 0);
                oldDate.setDate(oldDate.getDate() + task.plannedDay);
                plannedDate = getDateKey(oldDate);
            }

            return {
                ...task,
                minutes,
                completed: task.completed === true,
            };
        });
    } catch (error) {
        console.warn("Impossible de charger les tâches.", error);
        return [];
    }
}

let tasks = loadTasks();

function saveTasks() {
    try {
        localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
    } catch (error) {
        console.warn("Impossible d'enregistrer les tâches.", error);
        announcement.textContent =
            "Les tâches n'ont pas pu être sauvegardées dans le navigateur.";
    }
}

/* ==================================
   REPORT AUTOMATIQUE DES TÂCHES
================================== */

function returnExpiredTasksToBacklog() {
    const mondayKey = getDateKey(getMonday());
    let changed = false;

    tasks.forEach(task => {
        if (
            task.status === "backlog" &&
            !task.completed &&
            task.plannedDate &&
            task.plannedDate < mondayKey
        ) {
            task.plannedDate = null;
            task.needsReschedule = true;
            changed = true;
        }
    });

    if (changed) {
        saveTasks();
    }

    return changed;
}

// Vérifier dès le chargement de la page.
returnExpiredTasksToBacklog();

// Vérifier régulièrement, notamment après le passage à lundi minuit.
// Cela fonctionne aussi si l'ordinateur se réveille après minuit.
setInterval(() => {
    if (returnExpiredTasksToBacklog()) {
        renderTasks();

        announcement.textContent =
            "La semaine a changé. Les tâches non terminées ont été replacées dans À classer.";
    }
}, 60_000);

// Vérifier aussi lorsque l'utilisateur revient sur la page.
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && returnExpiredTasksToBacklog()) {
        renderTasks();
    }
});
