// Simple Mario-like placeholder logic
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let x = 10, y = 90, velocity = 2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 20, 20);
    x += velocity;
    if (x > canvas.width - 20 || x < 0) velocity = -velocity;
    requestAnimationFrame(draw);
}
if (canvas && ctx) draw();
