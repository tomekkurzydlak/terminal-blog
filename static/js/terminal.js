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

//function handleCommand(cmd) {
//    if (cmd === "run dino") {
//        printToTerminal("Launching dino game...");
//        localStorage.setItem("runDinoAfterReload", "true");
//
//        setTimeout(() => {
//            terminalActive = false;
//            gameActive = true;
//            gameContainer.style.display = "block";
//
//            // Dołącz game.js tylko raz
//            if (!document.getElementById("game-script")) {
//                const script = document.createElement("script");
//                script.src = "/static/js/game.js"; // 🔁 Dostosuj jeśli inna ścieżka
//                script.id = "game-script";
//                script.onload = () => {
//                    console.log("✅ Game loaded.");
//                };
//                script.onerror = () => {
//                    console.error("❌ Failed to load game.js");
//                    printToTerminal("Failed to load game.");
//                };
//                document.body.appendChild(script);
//            } else {
//                printToTerminal("Game already loaded.");
//            }
//        }, 500);
//    } else if (cmd === "clear") {
//        clearTerminal();
//        showPrompt();
//    } else if (cmd === "help") {
//        printToTerminal("Available commands:");
//        printToTerminal("- run dino: Start the dino game");
//        printToTerminal("- clear: Clear terminal");
//        printToTerminal("- help: Show this help message");
//        showPrompt();
//    } else if (cmd === "") {
//        showPrompt();
//    } else {
//        printToTerminal(`Command not found: ${cmd}`);
//        showPrompt();
//    }
//    commandBuffer = "";
//}

function handleCommand(cmd) {
    const args = cmd.split(" ");
    if (cmd === "run dino") {
        printToTerminal("Launching dino game...");
        localStorage.setItem("runDinoAfterReload", "true");

        setTimeout(() => {
            terminalActive = false;
            gameActive = true;
            gameContainer.style.display = "block";

            if (!document.getElementById("game-script")) {
                const script = document.createElement("script");
                script.src = "/static/js/game.js";
                script.id = "game-script";
                script.onload = () => console.log("✅ Game loaded.");
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
        printToTerminal("- pwd: Show current directory");
        printToTerminal("- ls: List files");
        printToTerminal("- cat <filename>: Display file contents");
        printToTerminal("- whoami: Show current user");
        printToTerminal("- date: Show current date");
        printToTerminal("- rm -rf /: 🤫 (not recommended)");
        showPrompt();
    } else if (cmd === "pwd") {
        printToTerminal("/home/guest");
        showPrompt();
    } else if (cmd === "ls") {
        printToTerminal("game.js  index.html  secret.txt  unicorn.log");
        showPrompt();
    } else if (args[0] === "cat" && args[1]) {
        const filename = args[1];
        const fakeFiles = {
            "game.js": "// dino game code...",
            "secret.txt": "The cake is a lie.",
            "unicorn.log": "🦄 Unicorn spotted at 03:14AM near the moon.",
        };
        if (fakeFiles[filename]) {
            printToTerminal(fakeFiles[filename]);
        } else {
            printToTerminal(`cat: ${filename}: No such file`);
        }
        showPrompt();
    } else if (cmd === "whoami") {
        printToTerminal("guest");
        showPrompt();
    } else if (cmd === "date") {
        printToTerminal(new Date().toString());
        showPrompt();
    } else if (cmd === "rm -rf /") {
        showCrashScreen();
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
//crash
function showCrashScreen() {
    document.body.innerHTML = `
        <div id="crash-screen" style="
            position:fixed;
            top:0; left:0; width:100vw; height:100vh;
            background:#0000AA;
            color:#FFFFFF;
            font-family:monospace;
            font-size:18px;
            padding:40px;
            box-sizing:border-box;
            z-index:9999;
        ">
            <pre>
A fatal exception 0x000000DEAD has occurred at 0xDEADBEEF in GUEST.EXE.
The system has been shut down to prevent damage to your computer.

Press any key to continue _</pre>
        </div>
    `;

    document.addEventListener("keydown", () => {
        location.reload(); // reload to "recover"
    });
}


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


