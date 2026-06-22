function raining_graciella() {
    const img = document.createElement("img");
    img.src = "../assets/boquet.png";
    img.alt = "flower";

    const size = Math.random() * 100 + 60;
    const maxLeft = Math.max(0, window.innerWidth - size);

    img.style.position = "fixed";
    img.style.top = "-120px";
    img.style.left = `${Math.random() * maxLeft}px`;
    img.style.width = `${size}px`;
    img.style.height = "auto";
    img.style.zIndex = "46";
    img.style.opacity = "0.9";
    img.style.pointerEvents = "none";

    const duration = Math.random() * 3 + 2;
    img.style.animation = `fall ${duration}s linear forwards`;

    document.body.appendChild(img);
    setTimeout(() => img.remove(), duration * 1000);
}

function startRaining() {
    setInterval(raining_graciella, 180);
}

const toast = document.getElementById("toast");
const yesBtn = document.querySelector(".y");
const noBtn = document.querySelector(".n");
const pauseBtn = document.getElementById("pauseBtn");
const muteBtn = document.getElementById("muteBtn");
const music = document.getElementById("bgMusic");
const yesSound = document.getElementById("yesSound");
const noSound = document.getElementById("noSound");
const card = document.querySelector(".yn");
const planCard = document.getElementById("planCard");
const progressFill = document.getElementById("progressFill");
const stepLabel = document.getElementById("stepLabel");
const stepPanels = document.querySelectorAll(".step-panel");
const optionButtons = document.querySelectorAll(".option-card");
const backBtn = document.getElementById("backBtn");
const stepImageA = document.getElementById("stepImageA");
const stepImageB = document.getElementById("stepImageB");
const overlay = document.getElementById("overlay");
const resultText = document.getElementById("resultText");
const resultBtn = document.getElementById("resultBtn");
const resultPage = document.getElementById("resultPage");

let toastTimer;
let currentStep = 0;
let hasStartedMusic = false;

const stepImages = [
    ["../assets/who1.png", "../assets/who2.png"],
    ["../assets/where1.png", "../assets/where2.png"],
    ["../assets/with1.png", "../assets/with2.png"],
    ["../assets/sin1.png", "../assets/sin2.png"]
];

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function tryStartMusic() {
    if (!music || hasStartedMusic) return;

    hasStartedMusic = true;
    if (music.volume === 0) music.volume = 0.35;
    music.play().catch(() => {
        hasStartedMusic = false;
    });
}

function updateWizard() {
    if (!progressFill || !stepLabel || stepPanels.length === 0) return;

    const totalSteps = stepPanels.length;
    progressFill.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
    stepLabel.textContent = `Step ${currentStep + 1} of ${totalSteps}`;

    stepPanels.forEach((panel, index) => {
        panel.classList.toggle("active", index === currentStep);
    });

    if (stepImageA && stepImageB && stepImages[currentStep]) {
        stepImageA.src = stepImages[currentStep][0];
        stepImageB.src = stepImages[currentStep][1];
    }

    if (backBtn) {
        backBtn.disabled = currentStep === 0;
        backBtn.style.opacity = currentStep === 0 ? "0.45" : "1";
    }
}

if (yesBtn && noBtn && card && planCard) {
    yesBtn.addEventListener("click", () => {
        tryStartMusic();

        if (yesSound) {
            yesSound.currentTime = 0;
            yesSound.play().catch(() => {});
        }

        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
            card.style.display = "none";
            planCard.classList.add("show");
        }, 500);

        showToast("Yeayy, thankss prettyy 💖");
    });

    noBtn.addEventListener("click", () => {
        tryStartMusic();

        if (noSound) {
            noSound.currentTime = 0;
            noSound.play().catch(() => {});
        }
        showToast("Umm, kayaknya jawabanya salah deh 😙");
    });
}

if (optionButtons.length > 0) {
    optionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tryStartMusic();

            const message = button.dataset.toast || "Nice choice!";
            const isCorrect = button.dataset.choice === "correct";
            const soundToPlay = isCorrect ? yesSound : noSound;

            if (soundToPlay) {
                soundToPlay.currentTime = 0;
                soundToPlay.play().catch(() => {});
            }

            if (isCorrect) {
                showToast(message);
                if (currentStep < stepPanels.length - 1) {
                    setTimeout(() => {
                        currentStep += 1;
                        updateWizard();
                    }, 300);
                } else {
                    setTimeout(() => {
                        if (overlay && resultText) {
                            overlay.classList.add("show");
                            resultText.textContent = "You picked the perfect combo for your date 💕";
                        }
                    }, 300);
                }
            } else {
                showToast(message);
            }
        });
    });
}

if (backBtn) {
    backBtn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep -= 1;
            updateWizard();
        }
    });
}

if (resultBtn && overlay && resultPage && planCard) {
    resultBtn.addEventListener("click", () => {
        overlay.classList.remove("show");
        planCard.style.display = "none";
        resultPage.classList.add("show");
        showToast("Enjoy your date plan! ✨");
    });
}

if (pauseBtn && muteBtn && music) {
    pauseBtn.addEventListener("click", () => {
        const icon = pauseBtn.querySelector("i");
        if (music.paused) {
            tryStartMusic();
            icon.className = "fa-solid fa-pause";
        } else {
            music.pause();
            icon.className = "fa-solid fa-play";
        }
    });

    muteBtn.addEventListener("click", () => {
        const icon = muteBtn.querySelector("i");
        music.muted = !music.muted;

        if (music.muted) {
            icon.className = "fa-solid fa-volume-xmark";
        } else {
            icon.className = "fa-solid fa-volume-high";
        }
    });
}

window.addEventListener("pointerdown", tryStartMusic, { once: true });
window.addEventListener("touchstart", tryStartMusic, { once: true });
window.addEventListener("click", tryStartMusic, { once: true });

updateWizard();
startRaining();

