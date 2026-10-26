// Références aux éléments HTML de Mon petit jardin

/* ==================================
   1. RÉCUPÉRATION DES ÉLÉMENTS HTML
================================== */

const display = document.getElementById("timer-display");
const label = document.getElementById("timer-label");
const caption = document.getElementById("timer-caption");

const startButton = document.getElementById("start-button");
const startText = document.getElementById("start-text");
const startIcon = document.getElementById("start-icon");

const resetButton = document.getElementById("reset-button");
const skipButton = document.getElementById("skip-button");

const modeButtons = document.querySelectorAll(".mode-button");

const progressBar = document.getElementById("progress-bar");
const sessionInfo = document.getElementById("session-info");
const sessionFlowers = document.getElementById("session-flowers");
const announcement = document.getElementById("announcement");

const settingsDialog = document.getElementById("settings-dialog");
const openSettings = document.getElementById("open-settings");
const closeSettings = document.getElementById("close-settings");
const settingsForm = document.getElementById("settings-form");

// Éléments HTML des tâches et du planning

const taskDialog = document.getElementById("task-dialog");
const taskForm = document.getElementById("task-form");
const closeTaskDialog = document.getElementById("close-task-dialog");
const taskTitleInput = document.getElementById("task-title-input");
const taskMinutesInput = document.getElementById("task-minutes-input");

const openBacklogDialog = document.getElementById("open-task-dialog-backlog");
const openNowDialog = document.getElementById("open-task-dialog-now");

const backlogList = document.getElementById("task-list-backlog");
const nowList = document.getElementById("task-list-now");
const backlogEmpty = document.getElementById("backlog-empty");
const nowEmpty = document.getElementById("now-empty");

const taskSummary = document.getElementById("task-summary");
const taskTime = document.getElementById("task-time");
const taskRestTime = document.getElementById("task-rest-time");
const planningGrid = document.getElementById("planning-grid");
