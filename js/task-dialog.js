// Fenêtre d'ajout des tâches et initialisation

function openTaskDialog(target) {
    taskCreationTarget = target;
    taskForm.reset();
    taskSessionsInput.value = "1";
    taskDialog.showModal();
    taskTitleInput.focus();
}

openBacklogDialog.addEventListener("click", () => {
    openTaskDialog("backlog");
});

openNowDialog.addEventListener("click", () => {
    openTaskDialog("now");
});

closeTaskDialog.addEventListener("click", () => {
    taskDialog.close();
});

taskDialog.addEventListener("click", event => {
    if (event.target === taskDialog) {
        taskDialog.close();
    }
});

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const sessions = Number(taskSessionsInput.value);

    if (!title) {
        taskTitleInput.focus();
        return;
    }

    if (!Number.isInteger(sessions) || sessions < 1 || sessions > 99) {
        taskSessionsInput.focus();
        return;
    }

    tasks.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title,
        sessions,
        completed: false,
        status: taskCreationTarget,
        plannedDate: null,
        needsReschedule: false
    });

    saveTasks();
    renderTasks();
    taskDialog.close();

    announcement.textContent =
        `Tâche ajoutée à ${taskCreationTarget === "now" ? "À faire maintenant" : "À classer"} : ${title}`;
});

// Afficher les tâches enregistrées au chargement
renderTasks();



/* ==================================
   19. INITIALISATION
================================== */

updateModeText();
updateDisplay();
