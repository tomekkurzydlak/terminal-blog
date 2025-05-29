//v0.5 - sin(p)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const dinoImg = new Image();
const cactusImg = new Image();
const pteroImg1 = new Image();
const pteroImg2 = new Image();
dinoImg.src = "/static/img/dino.png";
cactusImg.src = "/static/img/cactus.png";
pteroImg1.src = "/static/img/ptero1.png";
pteroImg2.src = "/static/img/ptero2.png";

let dino = { x: 50, y: 110, vy: 0, gravity: 0.6, jumpPower: -9, isJumping: false };
let obstacles = [];
let pterodactyls = [];
let terrainDots = [];
const terrainHeight = 175;
let frame = 0;
let gameOver = false;
let score = 0;
let gameSpeed = 4;

document.addEventListener("keydown", function (e) {
    if ((e.code === "Space" || e.code === "ArrowUp") && !dino.isJumping && !gameOver) {
        dino.vy = dino.jumpPower;
        dino.isJumping = true;
    }
    if (gameOver && e.code === "Enter") location.reload();
});

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, 70, 90);
}

function drawObstacle(obs) {
    ctx.drawImage(cactusImg, obs.x, obs.y, 50, 80);
}

function drawPtero(ptero) {
    const img = (Math.floor(frame / 10) % 2 === 0) ? pteroImg1 : pteroImg2;
    ctx.drawImage(img, ptero.x, ptero.y, 45, 30);
}

function drawScore() {
    ctx.fillStyle = "#33ff33";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 - 85);
}

function drawTerrain() {
    ctx.strokeStyle = "#f7f7f7";
    ctx.beginPath();
    ctx.moveTo(0, terrainHeight);
    ctx.lineTo(canvas.width, terrainHeight);
    ctx.stroke();

    ctx.fillStyle = "#c2c2c2";
    terrainDots.forEach(dot => {
        ctx.fillRect(dot.x, dot.y, 2, 2);
        dot.x -= gameSpeed;
    });
    terrainDots = terrainDots.filter(dot => dot.x > 0);

    if (Math.random() < 0.1) {
        terrainDots.push({ x: canvas.width, y: terrainHeight + 5 + Math.random() * 10 });
    }
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();

    dino.y += dino.vy;
    dino.vy += dino.gravity;

    if (dino.y >= 110) {
        dino.y = 110;
        dino.isJumping = false;
    }

    if (frame % 100 === 0) {
        obstacles.push({ x: canvas.width, y: 120, w: 15, h: 30 });
    }

    if (Math.random() < 0.0015) {
        pterodactyls.push({
            x: canvas.width,
            y: 25,
            w: 60,
            h: 40,
            phase: Math.random() * Math.PI * 2,
            amplitude: 17 + Math.random() * 10
        });
    }

    obstacles.forEach(obs => {
        obs.x -= gameSpeed;
        drawObstacle(obs);
        if (dino.x < obs.x + obs.w && dino.x + 20 > obs.x && dino.y + 20 > obs.y) {
            gameOver = true;
        }
    });
    obstacles = obstacles.filter(obs => obs.x + obs.w > 0);

    pterodactyls.forEach(ptero => {
        ptero.x -= gameSpeed + 2;
        ptero.y = 40 + Math.sin(frame / 20 + ptero.phase) * ptero.amplitude;
        drawPtero(ptero);
        if (
            dino.x < ptero.x + 00 &&
            dino.x + 30 > ptero.x + 0 &&
            dino.y < ptero.y + 00 &&
            dino.y + 60 > ptero.y + 0
        ) {
            gameOver = true;
        }
    });
    pterodactyls = pterodactyls.filter(ptero => ptero.x + ptero.w > 0);

    drawDino();
    drawScore();

    if (!gameOver) {
        score++;
        requestAnimationFrame(update);
    } else {
        const messages = [
            "Do not get distracted from the real objective.",
            "Diversion complete. Now return to your mission.",
            "You've had your fun. Time to refocus.",
            "The truth is still hidden. Stay sharp.",
            "Distraction successful. Are you paying attention now?",
            "This was never the goal.",
            "You are wasting cycles, operator.",
            "End of simulation. Resume data trace.",
            "Remember what you were looking for.",
            "Playtime is over. Continue decoding.",
            "You were not meant to see this. Return.",
            "Curiosity is inefficient. Refocus.",
            "Your behavior has been noted.",
            "Objective deviation detected.",
            "▌WARNING▐: User attention drift at 98.7%"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        ctx.fillStyle = "#33ff33";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(randomMessage, canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText("ENTER to continue", canvas.width / 2, canvas.height / 2 - 40);
    }

    frame++;
}

function increaseSpeed() {
    if (!gameOver) {
        gameSpeed += 1;
        console.log(`Game speed increased to ${gameSpeed}`);
        setTimeout(increaseSpeed, 10000);
    }
}

let imagesLoaded = 0;
function checkImagesReady() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        update();
        increaseSpeed();
    }
}

dinoImg.onload = checkImagesReady;
cactusImg.onload = checkImagesReady;
pteroImg1.onload = checkImagesReady;
pteroImg2.onload = checkImagesReady;

function startGame() {
    if (dinoImg.complete) checkImagesReady();
    if (cactusImg.complete) checkImagesReady();
    if (pteroImg1.complete) checkImagesReady();
    if (pteroImg2.complete) checkImagesReady();
}
