// État du minuteur, cercle de progression et fleurs de session

/* ==================================
   3. ÉTAT DU MINUTEUR
================================== */

let currentMode = "work";

let remainingSeconds = settings.work * 60;
let totalSeconds = remainingSeconds;

let isRunning = false;
let intervalId = null;

let completedWorkSessions = 0;


/* ==================================
   4. CONFIGURATION DU CERCLE
================================== */

const radius = 116;
const circumference = 2 * Math.PI * radius;

progressBar.style.strokeDasharray = circumference;


/* ==================================
   5. AFFICHAGE DU TEMPS
================================== */

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remaining).padStart(2, "0")
    );
}


function updateDisplay() {

    display.textContent = formatTime(remainingSeconds);

    const elapsed = totalSeconds - remainingSeconds;

    const progress = totalSeconds > 0
        ? elapsed / totalSeconds
        : 0;

    progressBar.style.strokeDashoffset =
        circumference * (1 - progress);

    const mode = modes[currentMode];

    progressBar.style.stroke = mode.color;

    document.title =
        `${formatTime(remainingSeconds)} · Mon petit jardin`;

    updateSessionInfo();
}


function updateSessionInfo() {
    sessionInfo.textContent =
        `Session ${completedWorkSessions + 1}`;

    updateSessionFlowers();
}

function updateSessionFlowers() {
    const flowers = sessionFlowers.querySelectorAll(".session-flower");

    // Nombre de sessions prévu avant la grande pause
    const cycleLength = Math.max(1, Number(settings.cycles) || 4);

    // Sessions terminées dans le cycle actuel
    let completedInCycle = completedWorkSessions % cycleLength;

    // Si le cycle vient de se terminer, garder les 4 fleurs colorées
    // pendant la pause avant le prochain cycle.
    const cycleJustCompleted =
        completedWorkSessions > 0 &&
        completedInCycle === 0 &&
        currentMode !== "work";

    if (cycleJustCompleted) {
        completedInCycle = cycleLength;
    }

    // Convertir la progression en nombre de fleurs terminées
    const completedFlowerCount = Math.floor(
        (completedInCycle / cycleLength) * flowers.length
    );

    // Une fleur est en cours si la concentration a commencé,
    // même si le minuteur a été mis en pause.
    const workIsInProgress =
        currentMode === "work" &&
        (isRunning || remainingSeconds < totalSeconds);

    flowers.forEach((flower, index) => {
        flower.classList.remove("is-complete", "is-active");

        if (index < completedFlowerCount) {
            flower.classList.add("is-complete");
        } else if (
            workIsInProgress &&
            index === completedFlowerCount
        ) {
            flower.classList.add("is-active");
        }
    });

    // Description accessible mise à jour
    sessionFlowers.setAttribute(
        "aria-label",
        `${completedFlowerCount} fleur(s) entièrement colorée(s) sur ${flowers.length}.`
    );
}
