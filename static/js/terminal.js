const terminalDiv = document.getElementById("terminal");
const terminalContent = document.getElementById("terminal-content");

const preloadNameScript = document.createElement("script");
preloadNameScript.src = "/static/js/name.js";
preloadNameScript.id = "name-script";
document.body.appendChild(preloadNameScript);

const gameContainer = document.getElementById("game-container");




let terminalActive = true;
let gameActive = false;
let commandBuffer = "";

// === Terminal UI ===

//function printToTerminal(text) {
//    terminalContent.innerHTML += `<div>${text}</div>`;
//    terminalContent.scrollTop = terminalContent.scrollHeight;
//}

function printToTerminal(text) {
    const lines = text.split('\n');
    lines.forEach(line => {
        terminalContent.innerHTML += `<div>${line}</div>`;
    });
    terminalContent.scrollTop = terminalContent.scrollHeight;
}


//function showPrompt() {
//    const username = typeof getUser === "function" ? getUser() : "guest";
//    const path = "/home/" + username;
//    terminalContent.innerHTML += `<div class="prompt">${username}@fake-os:${path} $ <span class="command-input">${commandBuffer}</span></div>`;
//    terminalContent.scrollTop = terminalContent.scrollHeight;
//}
function showPrompt() {
    const username = typeof getUser === "function" ? getUser() : "guest";
    const path = typeof getCurrentDirectory === "function" ? getCurrentDirectory() : "/home";
    terminalContent.innerHTML += `<div class="prompt">${username}@SP367SRE-OS:${path} $ <span class="command-input">${commandBuffer}</span></div>`;
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
        printToTerminal("- rm -rf /");
        showPrompt();
    } else if (cmd === "pwd") {
        printToTerminal("/home/guest");
        showPrompt();
    } else if (args[0] === "cd") {
        if (!args[1]) {
            printToTerminal("cd: missing operand");
        } else if (args[1] === "..") {
            printToTerminal("cd: ..: Permission denied");
        } else {
            printToTerminal(`cd: ${args[1]}: No such file or directory`);
        }
        showPrompt();
    } else if (cmd === "rm -rf /") {
        showCrashScreen();
    } else if (args[0] === "rm") {
        if (!args[1]) {
            printToTerminal("rm: missing operand");
        } else {
            printToTerminal(`rm: cannot remove '${args[1]}': Permission denied`);
        }
        showPrompt();

    } else if (args[0] === "mkdir") {
        if (!args[1]) {
            printToTerminal("mkdir: missing operand");
        } else {
            printToTerminal(`mkdir: cannot create directory '${args[1]}': Permission denied`);
        }
        showPrompt();

    } else if (args[0] === "touch") {
        if (!args[1]) {
            printToTerminal("touch: missing file operand");
        } else {
            printToTerminal(`touch: cannot touch '${args[1]}': Permission denied`);
        }
        showPrompt();

    } else if (args[0] === "echo") {
        runEcho(args.slice(1));

    } else if (args[0] === "exit") {
        runExit();

    } else if (args[0] === "history") {
        runHistory();

    } else if (args[0] === "man") {
        if (args[1]) {
            printToTerminal(`No manual entry for ${args[1]}`);
        } else {
            printToTerminal("What manual page do you want?");
        }
        showPrompt();

    } else if (args[0] === "ps") {
        runPs();

    } else if (args[0] === "telnet") {
        runTelnet(args[1]);

    } else if (args[0] === "top") {
        runTop();

    } else if (args[0] === "who") {
        const username = typeof getUser === "function" ? getUser() : "guest";
        printToTerminal(`${username}    tty1    2025-05-20 22:00`);
        showPrompt();

    } else if (args[0] === "curl") {
        runCurl(args[1]);

    } else if (args[0] === "wget") {
        runWget(args[1]);

    } else if (args[0] === "uptime") {
        printToTerminal("22:00:00 up 42 days, 4 users, load average: 0.00, 0.01, 0.05");
        showPrompt();

    } else if (args[0] === "env") {
        const username = typeof getUser === "function" ? getUser() : "guest";
        printToTerminal(`USER=${username}`);
        printToTerminal("SHELL=/bin/bash");
        printToTerminal("TERM=xterm-256color");
        printToTerminal("HOME=/home/" + username);
        printToTerminal("LANG=en_US.UTF-8");
        showPrompt();



    } else if (cmd === "ls") {
        printToTerminal("game.js  index.html  secret.txt  unicorn.log  notes.txt");
        showPrompt();

    } else if (cmd === "ls -la" || cmd === "ls -al") {
    runLs(["-la"]);

    } else if (args[0] === "cat" && args[1]) {
        const filename = args[1];
        const fakeFiles = {
            "game.js": "// dino game code...",
            "secret.txt": "The cake is a lie.",
            "unicorn.log": "🦄 Unicorn spotted at 03:14AM near the moon.",
            "notes.txt": "1.Buy milk\n2.Write code\n3.Escape the matrix"
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

    } else if (args[0] === "name" && args[1]) {
    if (!document.getElementById("name-script")) {
        const script = document.createElement("script");
        script.src = "/static/js/name.js";
        script.id = "name-script";
        script.onload = () => setName(args[1]);
        document.body.appendChild(script);
    } else {
        setName(args[1]);
    }

//    }   else if (args[0] === "cd") {
//    printToTerminal(`Command not found: ${cmd}`)
//        showPrompt();

    } else if (cmd === "date") {
        printToTerminal(new Date().toString());
        showPrompt();

    } else if (["fortune", "cookie", "fortune cookie"].includes(cmd)) {
        runFortune();
    } else if (["sudo", "su", "sudo su"].includes(cmd)) {
        runSudo();
    }   else if (cmd === "") {
        showPrompt();
    } else if (cmd === "matrix" || cmd === "neo") {
    if (!document.getElementById("matrix-script")) {
        const script = document.createElement("script");
        script.src = "/static/js/matrix.js";
        script.id = "matrix-script";
        script.onload = () => runMatrixEffect();
        document.body.appendChild(script);
    } else {
        runMatrixEffect();
    }

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

// fortune
function runFortune() {
    const fortunes = [
        "You will find a bug in your last commit.",
        "Beware of infinite loops.",
        "The cake is still a lie.",
        "Try turning it off and on again.",
        "rm -rf is not the answer. Usually.",
        "Your code works... until someone uses it.",
        "There's always one more semicolon.",
        "Your next push will break the CI pipeline.",
        "In a world of 1s and 0s... be the tilde ~",
        "Your shell prompt will always return 0 today.",
        "sudo make me a sandwich — Error: permission denied.",
        "Your terminal is haunted. Type 'sl' to summon the ghost train.",
        "fortune: segmentation fault (core dumped)",
        "The command you seek is inside you.",
        "What is the sound of one thread blocking?",
        "The only constant in the terminal is change.",
        "All errors are transient — except when they're not.",
        "To err is human. To debug, divine.",
        "Push yourself, not just your code.",
        "Your logic is flawless — today.",
        "Even the blue screen is just a fresh start.",
        "The next idea will strike while you're in the shower.",
        "Breathe. Compile. Run. Repeat.",
        "You've discovered a secret cookie. 🍪",
        "Don't feed the gremlins after midnight.",
        "42 is still the answer.",
        "You're not in a simulation. Or are you?",
        "The Matrix has you..."
    ];
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    printToTerminal(pick);
    showPrompt();
}

// sudo
function runSudo(cmd) {
    printToTerminal("[sudo] password for guest: *********");
    setTimeout(() => {
        printToTerminal(`Permission denied: unable to run \\"${cmd}\\" as root.`);
        showPrompt();
    }, 1000);
}

function runEcho(args) {
    if (args.length === 0) {
        printToTerminal("");
    } else {
        printToTerminal(args.join(" "));
    }
    showPrompt();
}

function runExit() {
    printToTerminal("You can't leave. The Matrix has you.");
    showPrompt();
}

function runHistory() {
    printToTerminal("history: not available in simulation mode");
    showPrompt();
}

function runPs() {
    printToTerminal("  PID TTY          TIME CMD");
    printToTerminal(" 1337 pts/0    00:00:01 dino.js");
    printToTerminal(" 1984 pts/0    00:00:03 matrix.js");
    printToTerminal(" 2025 pts/0    00:00:00 terminal");
    showPrompt();
}

function runTop() {
    printToTerminal("top - 22:00:00 up 42 days,  4 users,  load average: 0.00, 0.01, 0.05");
    printToTerminal("Tasks: 3 total, 1 running, 2 sleeping");
    printToTerminal("PID  USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND");
    printToTerminal("1337 guest     20   0   123m   12m   4m   R   0.3  0.1   0:01.01 dino.js");
    printToTerminal("1984 guest     20   0   98m    8m    3m   S   0.0  0.1   0:03.25 matrix.js");
    printToTerminal("2025 guest     20   0   105m   10m   5m   S   0.1  0.1   0:00.00 terminal");
    showPrompt();
}

function runLs(args = []) {
    if (Math.random() < 0.01) {
        printToTerminal("ls: cannot open directory '.': Input/output error");
        showPrompt();
        return;
    }

    if (args.includes("-la") || args.includes("-al")) {
        printToTerminal("total 24");
        printToTerminal("drwxr-xr-x  1 guest guest  4096 May 20 22:00 .");
        printToTerminal("drwxr-xr-x  1 root  root   4096 May 20 21:59 ..");
        printToTerminal("-rw-r--r--  1 guest guest   120 May 20 22:00 game.js");
        printToTerminal("-rw-r--r--  1 guest guest   310 May 20 22:00 index.html");
        printToTerminal("-rw-r--r--  1 guest guest   100 May 20 22:00 notes.txt");
        printToTerminal("-rw-r--r--  1 guest guest    80 May 20 22:00 secret.txt");
        printToTerminal("-rw-r--r--  1 guest guest    60 May 20 22:00 unicorn.log");
        printToTerminal("-rw-------  1 guest guest    42 May 20 22:00 .hidden_config");
    } else {
        printToTerminal("game.js  index.html  notes.txt  secret.txt  unicorn.log");
    }
    showPrompt();
}

function runCurl(url) {
    if (!url) {
        printToTerminal("curl: no URL specified!");
    } else if (Math.random() < 0.3) {
        printToTerminal(`curl: (7) Failed to connect to ${url} port 80: Connection refused`);
    } else {
        printToTerminal(`<!DOCTYPE html><html><body><h1>Fake response from ${url}</h1></body></html>`);
    }
    showPrompt();
}

function runWget(url) {
    if (!url) {
        printToTerminal("wget: missing URL");
        showPrompt();
        return;
    }

    if (Math.random() < 0.3) {
        printToTerminal(`wget: unable to resolve host address '${url}'`);
        showPrompt();
        return;
    }

    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").substring(0, 19);
    const filename = url.split('/').pop() || 'index.html';

    printToTerminal(`--${timestamp}--  http://${url}`);
    setTimeout(() => {
        printToTerminal(`Resolving ${url}... connected.`);
        setTimeout(() => {
            printToTerminal(`HTTP request sent, awaiting response... 200 OK`);
            setTimeout(() => {
                printToTerminal(`Length: 1337 [text/html]`);
                setTimeout(() => {
                    printToTerminal(`Zapis do: '${filename}'

${filename}          100%[==================>] 1.30K  --.-KB/s    in 0s`);
                    printToTerminal(`
${timestamp} (1.2 MB/s) - '${filename}' not saved: No space left on device`);
                    showPrompt();
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}


function runTelnet(host) {
    if (!host) {
        printToTerminal("telnet: missing address");
        showPrompt();
        return;
    }
    if (host === "towel.blinkenlights.nl") {
        printToTerminal("Trying towel.blinkenlights.nl... Connected.");
        setTimeout(() => {
            printToTerminal("Escape character is '^]'.");
            setTimeout(() => {
                printToTerminal("Welcome to ASCII Star Wars Episode IV...");
                printToTerminal(String.raw`
      .-"""-.
     / .===. \
     \/ 6 6 \/
     ( \___/ )
 ___ooo__V__ooo___
|                 |
|   R2-D2 ONLINE  |
|_________________|
     ||   ||
     ||___||
    [_______]

     ||   ||      /\_/\
     ||   ||     ( o.o )  ← C-3PO
     ||   ||      > ^ <

  "They've shut down the main reactor.
    We'll be destroyed for sure."
                `);
                setTimeout(() => {
                    printToTerminal(String.raw`
                      _.-._
                    ({  o o })
                   /  \_Y_/  \
                  (    (_)    )
                   \  '\_/'  /
                    \_______/
                     /   \
                    |     ||
                    ||___|||
                    ||   |||
                    VV   VV

"Help me, Obi-Wan Kenobi. You're my only hope."
                    `);
                    setTimeout(() => {
                        printToTerminal(String.raw`
    *         .              .        .           .       .
       .       .      .     *        .         .      .        *
     .         .      .     .         .  .        *         .
   .       *       .       .    .        .    *         *        .

      A long time ago in a terminal far,
                     far away...
                        `);
                        setTimeout(() => {
                            printToTerminal("(stream terminated — premium required to continue)");
                            showPrompt();
                        }, 2500);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    } else {
        printToTerminal(`Trying ${host}...`);
        setTimeout(() => {
            printToTerminal(`telnet: Unable to connect to remote host: Connection timed out`);
            showPrompt();
        }, 1000);
    }
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


