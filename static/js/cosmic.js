const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let ship = { x: canvas.width / 2 - 10, y: canvas.height - 40, w: 20, h: 20 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let frame = 0;

function drawShip() {
    ctx.fillStyle = "#33ff33";
    ctx.fillText("^", ship.x + 5, ship.y + 15);
}

function drawBullet(bullet) {
    ctx.fillText("|", bullet.x + 5, bullet.y);
}

function drawEnemy(enemy) {
    ctx.fillText("*", enemy.x + 5, enemy.y + 10);
}

function drawScore() {
    ctx.font = "14px monospace";
    ctx.fillStyle = "#33ff33";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 20);
}

function updateShooter() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // enemies
    if (frame % 60 === 0) {
        enemies.push({ x: Math.random() * (canvas.width - 20), y: 0 });
    }

    enemies.forEach(enemy => {
        enemy.y += 2;
        drawEnemy(enemy);

        if (
            enemy.x < ship.x + ship.w &&
            enemy.x + 15 > ship.x &&
            enemy.y + 15 > ship.y
        ) {
            gameOver = true;
        }
    });

    bullets.forEach(b => {
        b.y -= 5;
        drawBullet(b);
    });

    // collision
    bullets.forEach((b, i) => {
        enemies.forEach((e, j) => {
            if (
                b.x < e.x + 15 &&
                b.x + 2 > e.x &&
                b.y < e.y + 15 &&
                b.y + 2 > e.y
            ) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 1;
            }
        });
    });

    bullets = bullets.filter(b => b.y > 0);
    enemies = enemies.filter(e => e.y < canvas.height);

    drawShip();
    drawScore();

    if (!gameOver) {
        frame++;
        requestAnimationFrame(updateShooter);
    } else {
        ctx.fillText("GAME OVER — press Enter to exit", canvas.width / 2, canvas.height / 2);
    }
}

document.addEventListener("keydown", function (e) {
    if (!gameActive) return;

    if (e.code === "ArrowLeft" && ship.x > 0) ship.x -= 10;
    if (e.code === "ArrowRight" && ship.x + ship.w < canvas.width) ship.x += 10;
    if (e.code === "Space") bullets.push({ x: ship.x + 8, y: ship.y });

    if (gameOver && e.code === "Enter") location.reload();
});

function startShooter() {
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    score = 0;
    gameOver = false;
    frame = 0;
    ship.x = canvas.width / 2 - 10;
    bullets = [];
    enemies = [];
    updateShooter();
}


// to embedd this game put this code in terminal.js:
//if (cmd === "phewphew") {
//    printToTerminal("Launching game...");
////    localStorage.setItem("runDinoAfterReload", "true");
//
//    if (!document.getElementById("game-script")) {
//        const script = document.createElement("script");
//        script.src = "/static/js/cosmic.js";
//        script.id = "game-script";
//        script.onload = () => {
//            console.log("Game loaded.");
//            terminalActive = false;
//            gameActive = true;
//            gameContainer.style.display = "block";
//            if (typeof startShooter === "function") startShooter();
//        };
//        script.onerror = () => {
//            console.error("Failed to load game.js");
//            printToTerminal("Failed to load game.");
//            showPrompt();
//        };
//        document.body.appendChild(script);
//    } else {
//        terminalActive = false;
//        gameActive = true;
//        gameContainer.style.display = "block";
//        if (typeof startGame === "function") startGame();
//    }
//}