// ======================================================
// EMILIAS STERNENZAUBER
// Wochenübersicht + Tagesaufgaben + Belohnungen
// ======================================================

const WEEK_STORAGE_KEY = "emiliaWeekStarsV1";

const weekDays = [
    { key: "monday", inputId: "stars-monday" },
    { key: "tuesday", inputId: "stars-tuesday" },
    { key: "wednesday", inputId: "stars-wednesday" },
    { key: "thursday", inputId: "stars-thursday" },
    { key: "friday", inputId: "stars-friday" }
];

// ------------------------------------------------------
// Seiten und Buttons
// ------------------------------------------------------

const startPage = document.getElementById("startPage");
const taskPage = document.getElementById("taskPage");
const rewardPage = document.getElementById("rewardPage");

const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");
const finishWeekButton = document.getElementById("finishWeekButton");
const saveWeekButton = document.getElementById("saveWeekButton");

// ------------------------------------------------------
// Anzeigen
// ------------------------------------------------------

const finalStars = document.getElementById("finalStars");
const rewardMessage = document.getElementById("rewardMessage");

const starsCountStart = document.getElementById("starsCountStart");
const starsCountTasks = document.getElementById("starsCountTasks");

const progressBarStart = document.getElementById("progressBarStart");
const progressBarTasks = document.getElementById("progressBarTasks");

const taskChecks = document.querySelectorAll(".taskCheck");
const dayStarsInputs = document.querySelectorAll(".day-stars-input");

// ------------------------------------------------------
// Datum und aktueller Wochentag
// ------------------------------------------------------

const now = new Date();
const today = now.toDateString();
const currentDayNumber = now.getDay();

// JavaScript:
// Sonntag = 0
// Montag = 1
// Dienstag = 2
// Mittwoch = 3
// Donnerstag = 4
// Freitag = 5
// Samstag = 6

const dayNumberToKey = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
};

const currentWeekDayKey = dayNumberToKey[currentDayNumber] || null;

// ------------------------------------------------------
// Wochensterne laden
// ------------------------------------------------------

function createEmptyWeek() {
    return {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0
    };
}

function loadWeekStars() {
    const savedWeek = localStorage.getItem(WEEK_STORAGE_KEY);

    if (!savedWeek) {
        return createEmptyWeek();
    }

    try {
        const parsedWeek = JSON.parse(savedWeek);

        return {
            monday: clampStars(parsedWeek.monday),
            tuesday: clampStars(parsedWeek.tuesday),
            wednesday: clampStars(parsedWeek.wednesday),
            thursday: clampStars(parsedWeek.thursday),
            friday: clampStars(parsedWeek.friday)
        };
    } catch (error) {
        console.error("Wochensterne konnten nicht geladen werden:", error);
        return createEmptyWeek();
    }
}

function clampStars(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(8, Math.max(0, Math.round(number)));
}

let weekStars = loadWeekStars();
let stars = calculateTotalStars();

// ------------------------------------------------------
// Wochensterne speichern und berechnen
// ------------------------------------------------------

function saveWeekStars() {
    localStorage.setItem(
        WEEK_STORAGE_KEY,
        JSON.stringify(weekStars)
    );

    stars = calculateTotalStars();
    localStorage.setItem("stars", String(stars));

    updateWeekInputs();
    updateStars();
}

function calculateTotalStars() {
    return weekDays.reduce((total, day) => {
        return total + clampStars(weekStars[day.key]);
    }, 0);
}

function updateWeekInputs() {
    weekDays.forEach(day => {
        const input = document.getElementById(day.inputId);

        if (input) {
            input.value = clampStars(weekStars[day.key]);
        }
    });
}

// ------------------------------------------------------
// Tagesaufgaben laden oder bei neuem Tag zurücksetzen
// ------------------------------------------------------

const savedDay = localStorage.getItem("savedDay");

if (savedDay !== today) {
    taskChecks.forEach((check, index) => {
        check.checked = false;
        check.parentElement.classList.remove("done");
        localStorage.removeItem("task-" + index);
    });

    localStorage.setItem("savedDay", today);
} else {
    taskChecks.forEach((check, index) => {
        const saved = localStorage.getItem("task-" + index);

        if (saved === "true") {
            check.checked = true;
            check.parentElement.classList.add("done");
        }
    });
}

// ------------------------------------------------------
// Startseite → Aufgaben
// ------------------------------------------------------

startButton.addEventListener("click", function () {
    startPage.classList.remove("active");
    rewardPage.classList.remove("active");
    taskPage.classList.add("active");

    updateWeekInputs();
    updateStars();
});

// ------------------------------------------------------
// Aufgaben → Startseite
// ------------------------------------------------------

backButton.addEventListener("click", function () {
    taskPage.classList.remove("active");
    rewardPage.classList.remove("active");
    startPage.classList.add("active");

    updateStars();
});

// ------------------------------------------------------
// Heutige Aufgaben anklicken
// ------------------------------------------------------

taskChecks.forEach((check, index) => {
    check.addEventListener("change", function () {
        localStorage.setItem(
            "task-" + index,
            String(check.checked)
        );

        check.parentElement.classList.toggle(
            "done",
            check.checked
        );

        const checkedToday = document.querySelectorAll(
            ".taskCheck:checked"
        ).length;

        // Montag bis Freitag:
        // Heutige Häkchen automatisch beim passenden Tag eintragen
        if (currentWeekDayKey) {
            weekStars[currentWeekDayKey] = clampStars(checkedToday);
            saveWeekStars();
        } else {
            // Am Wochenende werden keine zusätzlichen Wochensterne vergeben.
            updateStars();
        }
    });
});

// ------------------------------------------------------
// Wochenübersicht manuell speichern
// ------------------------------------------------------

saveWeekButton.addEventListener("click", function () {
    weekDays.forEach(day => {
        const input = document.getElementById(day.inputId);

        if (input) {
            const correctedValue = clampStars(input.value);

            input.value = correctedValue;
            weekStars[day.key] = correctedValue;
        }
    });

    saveWeekStars();

    alert(
        "Deine Sternenwoche wurde gespeichert! ⭐\n\n" +
        "Aktueller Wochenstand: " +
        stars +
        " von 40 Sternen."
    );
});

// Eingaben sofort auf den erlaubten Bereich 0–8 begrenzen
dayStarsInputs.forEach(input => {
    input.addEventListener("change", function () {
        input.value = clampStars(input.value);
    });
});

// ------------------------------------------------------
// Woche abschließen
// ------------------------------------------------------

finishWeekButton.addEventListener("click", function () {
    const wirklichAbschliessen = confirm(
        "Möchtest du die Woche wirklich abschließen? ⭐\n\n" +
        "Danach siehst du deine Wochenbelohnung. Bist du sicher?"
    );

    if (!wirklichAbschliessen) {
        return;
    }

    // Noch einmal aktuelle Eingaben übernehmen,
    // falls vor dem Abschließen nicht auf Speichern gedrückt wurde.
    weekDays.forEach(day => {
        const input = document.getElementById(day.inputId);

        if (input) {
            weekStars[day.key] = clampStars(input.value);
        }
    });

    saveWeekStars();

    finalStars.textContent = stars;

    if (stars < 20) {
        rewardMessage.textContent =
            "Diese Woche wurde noch keine Belohnungsstufe erreicht. " +
            "Nächste Woche klappt es bestimmt! 💕";
    } else if (stars <= 24) {
        rewardMessage.textContent =
            "🍦 Deine Belohnung: Eis essen oder ein Brettspiel aussuchen.";
    } else if (stars <= 29) {
        rewardMessage.textContent =
            "🍿 Deine Belohnung: Kinoabend zu Hause oder Lieblingsessen.";
    } else if (stars <= 34) {
        rewardMessage.textContent =
            "🏊 Deine Belohnung: Schwimmbad, Bowling oder eine Kleinigkeit bis 5 €.";
    } else {
        rewardMessage.textContent =
            "🌈 Deine Belohnung: Wunsch-Unternehmung oder ein großes Extra bis 10 €.";

        startConfetti();
    }

    startPage.classList.remove("active");
    taskPage.classList.remove("active");
    rewardPage.classList.add("active");
});

// ------------------------------------------------------
// Neue Woche starten
// ------------------------------------------------------

restartButton.addEventListener("click", function () {
    const wirklichNeuStarten = confirm(
        "Möchtest du wirklich eine neue Woche starten? ⭐\n\n" +
        "Alle gesammelten Sterne werden auf 0 zurückgesetzt."
    );

    if (!wirklichNeuStarten) {
        return;
    }

    weekStars = createEmptyWeek();
    stars = 0;

    localStorage.setItem(
        WEEK_STORAGE_KEY,
        JSON.stringify(weekStars)
    );

    localStorage.setItem("stars", "0");
    localStorage.setItem("savedDay", today);

    taskChecks.forEach((check, index) => {
        check.checked = false;
        check.parentElement.classList.remove("done");
        localStorage.removeItem("task-" + index);
    });

    updateWeekInputs();
    updateStars();

    rewardPage.classList.remove("active");
    taskPage.classList.remove("active");
    startPage.classList.add("active");
});

// ------------------------------------------------------
// Anzeige aktualisieren
// ------------------------------------------------------

function updateStars() {
    stars = calculateTotalStars();

    starsCountStart.textContent = stars;
    starsCountTasks.textContent = stars;

    const percent = Math.min((stars / 40) * 100, 100);

    progressBarStart.style.width = percent + "%";
    progressBarTasks.style.width = percent + "%";
}

// ------------------------------------------------------
// Konfetti
// ------------------------------------------------------

function startConfetti() {
    const canvas = document.getElementById("confettiCanvas");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];

    for (let i = 0; i < 140; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            drift: Math.random() * 2 - 1,
            rotation: Math.random() * 360
        });
    }

    let frames = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(piece => {
            piece.y += piece.speed;
            piece.x += piece.drift;
            piece.rotation += 4;

            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);

            ctx.fillStyle =
                `hsl(${Math.random() * 360}, 90%, 65%)`;

            ctx.fillRect(
                -piece.size / 2,
                -piece.size / 2,
                piece.size,
                piece.size
            );

            ctx.restore();
        });

        frames++;

        if (frames < 240) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }

    draw();
}

// ------------------------------------------------------
// App beim Laden vorbereiten
// ------------------------------------------------------

updateWeekInputs();
updateStars();
