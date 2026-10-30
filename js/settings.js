// Réglages par défaut et chargement des préférences Pomodoro

/* ==================================
   2. RÉGLAGES PAR DÉFAUT
================================== */

// Réglages par défaut
const defaultSettings = {
    work: 25,
    short: 5,
    long: 15,
    cycles: 4,
    volume: 50
};

// Charger les réglages sauvegardés
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem("pomodoroSettings");

        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);

            return {
                work: validateSetting(parsed.work, 25, 1, 180),
                short: validateSetting(parsed.short, 5, 1, 60),
                long: validateSetting(parsed.long, 15, 1, 90),
                cycles: validateSetting(parsed.cycles, 4, 1, 12),
                volume: validateSetting(parsed.volume, 50, 0, 100)
            };
        }
    } catch (error) {
        console.warn("Impossible de charger les réglages.", error);
    }

    return { ...defaultSettings };
}

// Vérifier les valeurs récupérées
function validateSetting(value, fallback, min, max) {
    const number = Number(value);

    if (
        Number.isInteger(number) &&
        number >= min &&
        number <= max
    ) {
        return number;
    }

    return fallback;
}

// Réglages actifs
const settings = loadSettings();

const modes = {
    work: {
        label: "C'est le moment de fleurir 🌷",
        caption: "Une chose à la fois.",
        buttonText: "Commencer",
        color: "#d98f9d"
    },

    short: {
        label: "Une petite respiration ☕",
        caption: "Tu mérites cette pause.",
        buttonText: "Commencer ma pause",
        color: "#8fa58a"
    },

    long: {
        label: "Le temps de te ressourcer 🌿",
        caption: "Laisse ton esprit vagabonder.",
        buttonText: "Commencer ma pause",
        color: "#8fa58a"
    }
};
