// Fenêtre des réglages et branchement des boutons du minuteur

/* ==================================
   15. OUVRIR ET FERMER LES RÉGLAGES
================================== */

openSettings.addEventListener("click", () => {

    document.getElementById("work-input").value =
        settings.work;

    document.getElementById("short-input").value =
        settings.short;

    document.getElementById("long-input").value =
        settings.long;

    document.getElementById("cycles-input").value =
        settings.cycles;

    settingsDialog.showModal();

    volumeInput.value = settings.volume ?? 50;
    volumeValue.textContent = `${volumeInput.value} %`;

});


closeSettings.addEventListener("click", () => {

    settingsDialog.close();

});


/* Fermer si l'on clique à l'extérieur de la fenêtre */

settingsDialog.addEventListener("click", event => {

    if (event.target === settingsDialog) {
        settingsDialog.close();
    }

});


/* ==================================
   16. ENREGISTRER LES RÉGLAGES
================================== */

settingsForm.addEventListener("submit", event => {

    event.preventDefault();

    const newSettings = {

        work: Number(
            document.getElementById("work-input").value
        ),

        short: Number(
            document.getElementById("short-input").value
        ),

        long: Number(
            document.getElementById("long-input").value
        ),

        cycles: Number(
            document.getElementById("cycles-input").value
        ),

        volume: Number(
           volumeInput.value
        )

    };

    const limits = {
        work: [1, 180],
        short: [1, 60],
        long: [1, 90],
        cycles: [1, 12],
        volume: [0, 100]
    };

    for (const key in newSettings) {

        const value = newSettings[key];
        const [min, max] = limits[key];

        if (
            !Number.isInteger(value) ||
            value < min ||
            value > max
        ) {

            alert(
                "Vérifie les durées : elles doivent être comprises dans les limites indiquées."
            );

            return;
        }

    }

    // Mettre à jour les réglages actifs
    Object.assign(settings, newSettings);

    // Enregistrer les réglages dans le navigateur
    try {
        localStorage.setItem(
            "pomodoroSettings",
            JSON.stringify(settings)
        );
    } catch (error) {
        console.warn("Impossible de sauvegarder les réglages.", error);

        alert(
            "Tes réglages n'ont pas pu être sauvegardés par le navigateur."
        );
    }

    settingsDialog.close();

    /*
       On conserve le temps restant si le minuteur
       est en cours. Sinon, on recharge la durée
       complète du mode actuel.
    */

    if (!isRunning) {

        remainingSeconds = settings[currentMode] * 60;
        totalSeconds = remainingSeconds;

    }

    updateDisplay();

});


/* ==================================
   17. BRANCHER LES BOUTONS
================================== */

startButton.addEventListener("click", toggleTimer);

resetButton.addEventListener("click", resetTimer);

skipButton.addEventListener("click", skipSession);


/* ==================================
   VOLUME DU SIGNAL SONORE
================================== */

const volumeInput = document.getElementById("volume-input");
const volumeValue = document.getElementById("volume-value");

if (volumeInput && volumeValue) {
    volumeInput.addEventListener("input", () => {
        volumeValue.textContent = `${volumeInput.value} %`;
    });
}