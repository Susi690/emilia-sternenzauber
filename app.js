let stars = Number(localStorage.getItem("stars")) || 0;

const startPage = document.getElementById("startPage");
const taskPage = document.getElementById("taskPage");
const rewardPage = document.getElementById("rewardPage");

const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");

const finishWeekButton = document.getElementById("finishWeekButton");
const finalStars = document.getElementById("finalStars");
const rewardMessage = document.getElementById("rewardMessage");

const starsCountStart = document.getElementById("starsCountStart");
const starsCountTasks = document.getElementById("starsCountTasks");

const progressBarStart = document.getElementById("progressBarStart");
const progressBarTasks = document.getElementById("progressBarTasks");

const taskChecks = document.querySelectorAll(".taskCheck");

// Prüfen, ob ein neuer Tag begonnen hat
const today = new Date().toDateString();
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
// Woche abschließen
finishWeekButton.addEventListener("click", function () {
    const wirklichAbschliessen = confirm(
        "Möchtest du die Woche wirklich abschließen? ⭐\n\nDanach siehst du deine Wochenbelohnung. Bist du sicher?"
    );

    if (!wirklichAbschliessen) {
        return;
    }
    finalStars.textContent = stars;

    if (stars < 20) {
        rewardMessage.textContent =
            "Diese Woche wurde noch keine Belohnungsstufe erreicht. Nächste Woche klappt es bestimmt! 💕";
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
// Neue Woche starten
restartButton.addEventListener("click", function () {
    const wirklichNeuStarten = confirm(
        "Möchtest du wirklich eine neue Woche starten? ⭐\n\nAlle gesammelten Sterne werden auf 0 zurückgesetzt."
    );

    if (!wirklichNeuStarten) {
        return;
    }
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

    const percent = Math.min((stars / 40) * 100, 100);

    progressBarStart.style.width = percent + "%";
    progressBarTasks.style.width = percent + "%";

}
function startConfetti() {
    const canvas = document.getElementById("confettiCanvas");
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
            ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 65%)`;
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    draw();
}
updateStars();
