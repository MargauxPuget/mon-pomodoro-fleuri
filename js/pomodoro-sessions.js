// Son, fin de session et passage à la session suivante

function playSound() {

    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        const audioContext = new AudioContextClass();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 660;

        gain.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            audioContext.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.65
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.7);

        oscillator.onended = () => {
            audioContext.close();
        };

    } catch (error) {

        console.warn(
            "Le signal sonore n'a pas pu être joué.",
            error
        );

    }
}


/* ==================================
   13. FIN D'UNE SESSION
================================== */

function finishSession() {
    playSound();

    let nextMode;

    if (currentMode === "work") {
        completedWorkSessions++;

        announcement.textContent =
            "Session de concentration terminée. Bravo !";

        if (completedWorkSessions % settings.cycles === 0) {
            nextMode = "long";
        } else {
            nextMode = "short";
        }

    } else {
        announcement.textContent =
            "Pause terminée. C'est reparti !";

        nextMode = "work";
    }

    // Passer à l'étape suivante et réinitialiser son chrono
    setMode(nextMode);

}

/* ==================================
   14. PASSER À LA SESSION SUIVANTE
================================== */

function skipSession() {

    stopTimer();

    let nextMode;

    if (currentMode === "work") {
        if (
            completedWorkSessions > 0 &&
            completedWorkSessions % settings.cycles === 0
        ) {

            setMode("long");

        } else {

            setMode("short");

        }

    } else {

        setMode("work");

    }

   // setMode(nextMode);

    startTimer();
}
