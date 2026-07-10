let stars = Number(localStorage.getItem("stars")) || 0;

const startPage = document.getElementById("startPage");
const taskPage = document.getElementById("taskPage");
const rewardPage = document.getElementById("rewardPage");
const restartButton = document.getElementById("restartButton");
const backFromReward = document.getElementById("backFromReward");
const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");

const starsCountStart = document.getElementById("starsCountStart");
const starsCountTasks = document.getElementById("starsCountTasks");

const progressBarStart = document.getElementById("progressBarStart");
const progressBarTasks = document.getElementById("progressBarTasks");

const taskChecks = document.querySelectorAll(".taskCheck");

startButton.addEventListener("click", function () {
startPage.classList.remove("active");
taskPage.classList.add("active");
});

backButton.addEventListener("click", function () {
taskPage.classList.remove("active");
startPage.classList.add("active");
});

taskChecks.forEach((check, index) => {
const saved = localStorage.getItem("task-" + index);

if (saved === "true") {
    check.checked = true;
    check.parentElement.classList.add("done");
}


check.addEventListener("change", function () {
localStorage.setItem("task-" + index, check.checked);
check.parentElement.classList.toggle("done", check.checked); 
stars = document.querySelectorAll(".taskCheck:checked").length;
localStorage.setItem("stars", stars);

updateStars();
});
});

function updateStars() {
    starsCountStart.textContent = stars;
    starsCountTasks.textContent = stars;

    const percent = (stars / 35) * 100;
    progressBarStart.style.width = percent + "%";
    progressBarTasks.style.width = percent + "%";

if (stars >= 35) {
    startPage.classList.remove("active");
    taskPage.classList.remove("active");
    rewardPage.classList.add("active");
}
}

updateStars(); 
