// Modes, démarrage, pause, reprise et réinitialisation

/* ==================================
   6. AFFICHAGE DU MODE
================================== */

function updateModeButtons() {
    
    modeButtons.forEach(button => {

        const selected = button.dataset.mode === currentMode;

        button.classList.toggle("active", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

    });
}


function updateModeText() {

    const mode = modes[currentMode];

    label.textContent = mode.label;
    caption.textContent = mode.caption;

    startText.textContent = mode.buttonText;

    updateModeButtons();
}


/* ==================================
   7. ARRÊTER LE MINUTEUR
================================== */

function stopTimer() {

    if (intervalId !== null) {
        clearInterval(intervalId);
    }

    intervalId = null;
    isRunning = false;

    startIcon.textContent = "▶";
    startText.textContent =
        currentMode === "work"
            ? "Reprendre"
            : "Reprendre ma pause";
}


/* ==================================
   8. DÉMARRER LE MINUTEUR
================================== */

function startTimer() {


    if (isRunning) {
        return;
    }

    if (remainingSeconds <= 0) {
        skipSession()
        return;
    }

    isRunning = true;
	
	updateSessionFlowers();

    startIcon.textContent = "Ⅱ";
    startText.textContent = "Pause";

    intervalId = setInterval(() => {

        remainingSeconds--;

        updateDisplay();

        if (remainingSeconds <= 0) {

            stopTimer();

            remainingSeconds = 0;

            updateDisplay();

            finishSession();
        }

    }, 1000);
}


/* ==================================
   9. PAUSE ET REPRISE
================================== */

function toggleTimer() {

    if (isRunning) {

        stopTimer();

        updateDisplay();

    } else {

        startTimer();

    }
}


/* ==================================
   10. RÉINITIALISER
================================== */

function resetTimer() {
    
    stopTimer();

    remainingSeconds = settings[currentMode] * 60;
    totalSeconds = remainingSeconds;

    updateModeText();
    updateDisplay();
}


/* ==================================
   11. CHANGER DE MODE
================================== */

function setMode(mode) {
    if (!Object.prototype.hasOwnProperty.call(settings, mode)) {
        return;
    }

    stopTimer();

    currentMode = mode;

    remainingSeconds = settings[mode] * 60;
    totalSeconds = remainingSeconds;

    updateModeText();
    updateDisplay();
}


modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        setMode(button.dataset.mode);

    });

});


/* ==================================
   12. SIGNAL SONORE
================================== */
