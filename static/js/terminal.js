const terminalDiv = document.getElementById("terminal");
const terminalContent = document.getElementById("terminal-content");
const gameContainer = document.getElementById("game-container");

let terminalActive = true;
let gameActive = false;
let commandBuffer = "";

// === Terminal UI ===

function printToTerminal(text) {
    terminalContent.innerHTML += `<div>${text}</div>`;
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function showPrompt() {
    terminalContent.innerHTML += `<div class="prompt">$ <span class="command-input">${commandBuffer}</span></div>`;
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function clearTerminal() {
    terminalContent.innerHTML = "";
}

function updateCurrentLine() {
    const lines = terminalContent.querySelectorAll("div");
    if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        if (lastLine.classList.contains("prompt")) {
            const span = lastLine.querySelector(".command-input");
            if (span) {
                span.textContent = commandBuffer;
            }
        }
    }
}

function handleCommand(cmd) {
    if (cmd === "run dino") {
        printToTerminal("Launching dino game...");
        localStorage.setItem("runDinoAfterReload", "true");

        setTimeout(() => {
            terminalActive = false;
            gameActive = true;
            gameContainer.style.display = "block";

            // Dołącz game.js tylko raz
            if (!document.getElementById("game-script")) {
                const script = document.createElement("script");
                script.src = "/static/js/game.js"; // 🔁 Dostosuj jeśli inna ścieżka
                script.id = "game-script";
                script.onload = () => {
                    console.log("✅ Game loaded.");
                };
                script.onerror = () => {
                    console.error("❌ Failed to load game.js");
                    printToTerminal("Failed to load game.");
                };
                document.body.appendChild(script);
            } else {
                printToTerminal("Game already loaded.");
            }
        }, 500);
    } else if (cmd === "clear") {
        clearTerminal();
        showPrompt();
    } else if (cmd === "help") {
        printToTerminal("Available commands:");
        printToTerminal("- run dino: Start the dino game");
        printToTerminal("- clear: Clear terminal");
        printToTerminal("- help: Show this help message");
        showPrompt();
    } else if (cmd === "") {
        showPrompt();
    } else {
        printToTerminal(`Command not found: ${cmd}`);
        showPrompt();
    }
    commandBuffer = "";
}

document.addEventListener("keydown", function(e) {
    if (terminalActive) {
        if (e.key === "Enter") {
            const cmd = commandBuffer.trim();
            printToTerminal(`$ ${cmd}`);
            handleCommand(cmd);
        } else if (e.key === "Backspace") {
            commandBuffer = commandBuffer.slice(0, -1);
            updateCurrentLine();
        } else if (e.key.length === 1) {
            commandBuffer += e.key;
            updateCurrentLine();
        }
    }
});

// === Init ===
printToTerminal("Welcome to the terminal. Type `help` for available commands.");
showPrompt();

//window.addEventListener("DOMContentLoaded", () => {
//    if (localStorage.getItem("runDinoAfterReload") === "true") {
//        localStorage.removeItem("runDinoAfterReload");
//        handleCommand("run dino");
//    }
//});

//if (localStorage.getItem("runDinoAfterReload") === "true") {
//    localStorage.removeItem("runDinoAfterReload");
//    setTimeout(() => handleCommand("run dino"), 0);
//}


