// Fenêtre d'ajout des tâches et initialisation

function openTaskDialog(target) {
    taskCreationTarget = target;
    taskForm.reset();
    taskMinutesInput.value = "25";
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
    const minutes = Number(taskMinutesInput.value);

    if (!title) {
        taskTitleInput.focus();
        return;
    }

    if (!Number.isInteger(minutes) || minutes < 1) {
        taskMinutesInput.focus();
        return;
    }

    tasks.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title,
        minutes,
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
