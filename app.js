let stars = Number(localStorage.getItem("stars")) || 0;

const startPage = document.getElementById("startPage");
const taskPage = document.getElementById("taskPage");
const rewardPage = document.getElementById("rewardPage");

const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");

const starsCountStart = document.getElementById("starsCountStart");
const starsCountTasks = document.getElementById("starsCountTasks");

const progressBarStart = document.getElementById("progressBarStart");
const progressBarTasks = document.getElementById("progressBarTasks");

const taskChecks = document.querySelectorAll(".taskCheck");

// Prüfen, ob ein neuer Tag begonnen hat
const today = "TEST-MORGEN";
const savedDay = localStorage.getItem("savedDay");

if (savedDay !== today) {
    // Nur die Tagesaufgaben zurücksetzen
    // Die gesammelten Wochensterne bleiben erhalten
    taskChecks.forEach((check, index) => {
        check.checked = false;
        check.parentElement.classList.remove("done");
        localStorage.removeItem("task-" + index);
    });

    localStorage.setItem("savedDay", today);
} else {
    // Häkchen vom heutigen Tag wieder laden
    taskChecks.forEach((check, index) => {
        const saved = localStorage.getItem("task-" + index);

        if (saved === "true") {
            check.checked = true;
            check.parentElement.classList.add("done");
        }
    });
}

// Startseite → Aufgaben
startButton.addEventListener("click", function () {
    startPage.classList.remove("active");
    taskPage.classList.add("active");
});

// Aufgaben → Startseite
backButton.addEventListener("click", function () {
    taskPage.classList.remove("active");
    startPage.classList.add("active");
});

// Aufgaben anklicken
taskChecks.forEach((check, index) => {
    check.addEventListener("change", function () {
        localStorage.setItem("task-" + index, check.checked);
        check.parentElement.classList.toggle("done", check.checked);

        if (check.checked) {
            stars++;
        } else {
            stars--;
        }

        stars = Math.max(0, stars);
        localStorage.setItem("stars", stars);

        updateStars();
    });
});

// Neue Woche starten
restartButton.addEventListener("click", function () {
    stars = 0;
    localStorage.setItem("stars", 0);
    localStorage.setItem("savedDay", today);

    taskChecks.forEach((check, index) => {
        check.checked = false;
        check.parentElement.classList.remove("done");
        localStorage.removeItem("task-" + index);
    });

    rewardPage.classList.remove("active");
    taskPage.classList.remove("active");
    startPage.classList.add("active");

    updateStars();
});

// Anzeige aktualisieren
function updateStars() {
    starsCountStart.textContent = stars;
    starsCountTasks.textContent = stars;

    const percent = Math.min((stars / 35) * 100, 100);

    progressBarStart.style.width = percent + "%";
    progressBarTasks.style.width = percent + "%";

    if (stars >= 35) {
        startPage.classList.remove("active");
        taskPage.classList.remove("active");
        rewardPage.classList.add("active");
    }
}

updateStars();
