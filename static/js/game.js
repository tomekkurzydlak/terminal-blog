const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const dinoImg = new Image();
const cactusImg = new Image();
dinoImg.src = "/static/img/dino.png";
cactusImg.src = "/static/img/cactus.png";

let dino = { x: 50, y: 110, vy: 0, gravity: 0.6, jumpPower: -10, isJumping: false };
let obstacles = [];
let frame = 0;
let gameOver = false;
let score = 0;

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

function drawScore() {
    ctx.fillStyle = "#33ff33";
    ctx.font = "14px monospace";
    ctx.fillText("Score: " + score, 40, 65);
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dino.y += dino.vy;
    dino.vy += dino.gravity;

    if (dino.y >= 110) {
        dino.y = 110;
        dino.isJumping = false;
    }

    if (frame % 100 === 0) {
        let height = 30;
        obstacles.push({ x: canvas.width, y: 120, w: 15, h: height });
    }

    obstacles.forEach(obs => {
        obs.x -= 4;
        drawObstacle(obs);

        if (
            dino.x < obs.x + obs.w &&
            dino.x + 20 > obs.x &&
            dino.y + 20 > obs.y
        ) {
            gameOver = true;
        }
    });

    obstacles = obstacles.filter(obs => obs.x + obs.w > 0);

    drawDino();
    drawScore();

    if (!gameOver) {
        score++;
        requestAnimationFrame(update);
    } else {
        ctx.fillStyle = "#33ff33";
        ctx.font = "14px monospace";
        ctx.fillText("GAME OVER - press Enter to restart", 140, 75);
    }

    frame++;
}

// Start game when images are ready
dinoImg.onload = () => cactusImg.onload = update;
