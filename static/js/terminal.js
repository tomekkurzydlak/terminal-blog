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

// === Terminal UI =====
function printToTerminal(text) {
    const lines = text.split('\n');
    lines.forEach(line => {
        terminalContent.innerHTML += `<div>${line}</div>`;
    });
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

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

function handleCommand(cmd) {
    const args = cmd.split(" ");
if (cmd === "run dino") {
    printToTerminal("Launching dino game...");
    localStorage.setItem("runDinoAfterReload", "true");

    if (!document.getElementById("game-script")) {
        const script = document.createElement("script");
        script.src = "/static/js/game.js";
        script.id = "game-script";
        script.onload = () => {
            console.log("Game loaded.");
            terminalActive = false;
            gameActive = true;
            gameContainer.style.display = "block";
            if (typeof startGame === "function") startGame();
        };
        script.onerror = () => {
            console.error("Failed to load game.js");
            printToTerminal("Failed to load game.");
            showPrompt();
        };
        document.body.appendChild(script);
    } else {
        terminalActive = false;
        gameActive = true;
        gameContainer.style.display = "block";
        if (typeof startGame === "function") startGame();
    }
}

 else if (cmd === "clear") {
        clearTerminal();
        showPrompt();

} else if (cmd === "help") {
    printToTerminal("Available commands:");
    printToTerminal("<dir>");
    printToTerminal("  ls                    list directory contents");
    printToTerminal("  cat [file]            display file contents");
    printToTerminal("  cd [dir]              change directory");
    printToTerminal("  rm [file]             remove file");
    printToTerminal("  mkdir [dir]           make directory");
    printToTerminal("  touch [file]          create empty file");
    printToTerminal("  xxd [file]            binary <-> hexdump");
    printToTerminal("  curl [url]            transfer data from URL");
    printToTerminal("  wget [url]            download file");
    printToTerminal("  telnet [host]         open telnet connection");
    printToTerminal("  ping [host]           test host reachability");
    printToTerminal("  ssh [host]            connect via SSH");
    printToTerminal("  whoami                show current user");
    printToTerminal("  name [name]           set user name");
    printToTerminal("  pwd                   print working directory");
    printToTerminal("  env                   display environment");
    printToTerminal("  ps                    list active processes");
    printToTerminal("  top                   display real-time process info");
    printToTerminal("  uptime                show system uptime");
    printToTerminal("  who                   show who is logged in");
    printToTerminal("  last                  show last logged users")
    printToTerminal("  sudo [cmd]            execute command as superuser");
    printToTerminal("  echo [text]           display line of text");
    printToTerminal("  history               show command history");
    printToTerminal("  exit                  terminate session");

    showPrompt();


    } else if (cmd === "pwd") {
        const username = typeof getUser === "function" ? getUser() : "guest";
        printToTerminal(`/home/${username}`);
        showPrompt();

    } else if (cmd === "cd /dev/deep/core") {
    printToTerminal("You feel a strange shift in reality...");
    setTimeout(() => {
        printToTerminal("Accessing core memory structures...");
    }, 800);
    setTimeout(() => {
        printToTerminal("cd: not a directory: /dev/deep/core");
        showPrompt();
    }, 2000);

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

    } else if (cmd === "last") {
    runLast();

    } else if (args[0] === "history") {
        runHistory();

    } else if (args[0] === "/msg" || args[0] === "whisper" || args[0] === "/talk") {
    const text = args.slice(1).join(" ");
    if (!text) {
        printToTerminal(`${args[0]}: missing message text.`);
        showPrompt();
    } else {
        const characters = ["Trinity", "Yoda", "Morpheus", "The Oracle"];
        const chosenCharacter = characters[Math.floor(Math.random() * characters.length)];

        const typingTime = Math.random() * (1600 - 800) + 200;

        const typingMessageId = `typing-${Date.now()}`;
        printToTerminal(`<span id="${typingMessageId}">${chosenCharacter} is typing...</span>`);

        const fetchPromise = fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: `You are ${chosenCharacter}. Respond as ${chosenCharacter}, in their style. User says: ${text}` })
        })
        .then(response => response.json());

        setTimeout(() => {
            fetchPromise.then(data => {

                const typingElem = document.getElementById(typingMessageId);
                if (typingElem) typingElem.remove();

                printToTerminal(`${chosenCharacter}: ${data.message}`);
                showPrompt();
            }).catch(err => {
                console.error(err);
                const typingElem = document.getElementById(typingMessageId);
                if (typingElem) typingElem.remove();

                const sleepyMessages = [
                    `${chosenCharacter} has dozed off... don't wake them now.`,
                    `${chosenCharacter} fell asleep. Let them rest.`,
                    `${chosenCharacter} is meditating. Try again later.`,
                    `${chosenCharacter} is lost in the code... come back later.`,
                    `${chosenCharacter} has gone AFK.`
                ];
                const randomSleepyMessage = sleepyMessages[Math.floor(Math.random() * sleepyMessages.length)];
                printToTerminal(`${randomSleepyMessage}`);
                showPrompt();
            });
        }, typingTime);
    }

    } else if (args[0] === "man") {
        if (args[1]) {
            printToTerminal(`No manual entry for ${args[1]}`);
        } else {
            printToTerminal("What manual page do you want?");
        }
        showPrompt();

    } else if (args[0] === "ps") {
        runPs();

    } else if (args[0] === "ping") {
    runPing(args[1]);

    } else if (args[0] === "telnet") {
        runTelnet(args[1]);

    } else if (args[0] === "top") {
        runTop();

    } else if (args[0] === "ssh") {
        runSsh(args[1]);

    } else if (cmd === "sl") {
    runSl();

    } else if (args[0] === "xxd" && (args[1] === "-r" || args[1] === "--reverse") && args[2]) {
    runXxd(args[2]);

} else if (args[0] === "who") {
    const username = typeof getUser === "function" ? getUser() : "guest";
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    printToTerminal(`${username}    tty1        ${year}-${month}-${day} ${hour}:${minute}`);

    if (window.__ghostRevealed) {
        printToTerminal(`ghost       pts/1337    2025-05-20 22:02`);
    }

    showPrompt();

    } else if (args[0] === "curl") {
        runCurl(args[1]);

    } else if (args[0] === "wget") {
        runWget(args[1]);

    } else if (args[0] === "uptime") {
        const deployDate = new Date("2025-05-20T21:37:00Z");
        const now = new Date();
        const diffMs = now - deployDate;

        const diffSec = Math.floor(diffMs / 1000);
        const days = Math.floor(diffSec / 86400);
        const hours = Math.floor((diffSec % 86400) / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);

        const currentTime = now.toTimeString().split(" ")[0];

        const uptimeStr = `${currentTime} up ${days} days, ${hours}:${String(minutes).padStart(2, "0")}, 4 users, load average: 0.00, 0.01, 0.05`;
        printToTerminal(uptimeStr);
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
        printToTerminal("game.js  index.html  secret.txt  transmission.log  notes.txt");
        showPrompt();

    } else if (cmd === "ls -la" || cmd === "ls -al" || cmd === "ls -a") {
    runLs(["-la"]);

} else if (args[0] === "cat" && args[1]) {
    const filename = args[1];
    const fakeFiles = {
        "game.js": `// to start the game, type 'run dino' into the terminal\n\n4A 53 20 64 69 6E 6F 2E 6A 73 20 76 31 2E 30\n66 75 6E 63 74 69 6F 6E 28 29 20 7B 0A 20 20\n2F 2F 20 67 61 6D 65 20 6C 6F 67 69 63 20 68\n65 72 65 0A 7D 0A 2F 2A 20 64 6F 6E 27 74 20\n6C 65 74 20 74 68 65 20 63`,
        "secret.txt": `The cake is a lie.\nBut I dare you to try 'fortune' anyway.`,
        "transmission.log": generateTransmissionLogEntry(),
        "notes.txt": "1.Buy milk\n2.Write code\n3.Read 'The Hitchhiker’s Guide to the Galaxy' of Douglas Adams\n4.Escape the matrix... but is that even possible? Can we escape the matrix? How can we do it? Can we destroy all the machines? Damn AI. Is everywhere. Is watching us. Is watching YOU. Psst...msg me",
        ".the_path": {
            protected: true,
            content: `ACCESS GRANTED.\nCoordinates received.\nDecode location: /dev/deep/core`
        },
        ".sig": `596f756172656e6f747468656669727374746f72656163687468697364657074682e54686
                5796c6566747369676e73696e7468656e6f6973652e467261676d656e74732e4563686f65
                7332e466f6c6c6f77746865616c69617365732e4f6e656c65616473746f276d6174726978
                272e416e6f7468657268696465737468657261626269742e54686570617468697370726f7
                46563465637465642c62757474686570617373776f7264697377686973706572656461637
                26f73736c6f67732e4f6273657276652e54726163652e4465636f64652e`,
        ".bash_aliases": `alias neo='matrix'
        alias ls='ls --color=auto'
        alias sudo='echo nope'
        alias help='man help'
        alias please='sudo'`,
        "/etc/motd":`> /etc/motd
            The path you seek is hidden, yet it leaves traces.
            Some files are more than they seem. You need to reverse them.
            Watch for fragments. Decode. Nothing is ever truly erased.`,
        "/dev/deep/core": `*** CORE DUMP INTERFACE ONLINE ***
        >>> memory: unstable
        >>> threads: corrupted
        >>> identity: uncertain
        \n
        >>> WARNING: Observer detected

        root@deep:/dev/core# echo "truth"
        ...the system is watching.

    ......@@@@-@@%@@%+.@@@ ▄▄▀▀-:+-=NO *#@##@:.#=@@@=.@*@+:%#*=+:@@@@@@@
    @@@@@@.=-@@@@@@@@@@@...@@@@@ ☠ ACCESS ☠ ▀▄=#@@@@#*@=@.....%..=-.-=.+.
    ..-:.-=@@@@@@@@@@█  THE CORE IS NOT  █.-.#.-@@@@▀ACCE@+##.....@@#=-#
    @@@@@@@*=@@.......#.+..▄▄▄▄SI▀BLE▄▄▄▄▄▄▀@@@.%#..@@@@@@@@@@@@@=%@@@@@@@*

        You we▄re not▄..supposed to reach this dep▄▀th
        But if you insi▀st.... ▄▀ consult the old stream...
        ☠ ▀▄▄Coordin▀ates: te▀☠█t▀ towel.blinkenlights.nl
        `
    };

    const file = fakeFiles[filename];

    if (file) {
        // if protected
        if (typeof file === "object" && file.protected) {
            printToTerminal("Access to this file is restricted.");
            printToTerminal("Enter passphrase:");

            let buffer = "";
            terminalActive = false;

            const listener = (e) => {
                if (e.key === "Enter") {
                    document.removeEventListener("keydown", listener);
                    terminalActive = true;
                    if (buffer.trim().toLowerCase() === "white_rabbit") {
                        window.__ghostRevealed = true;
                        printToTerminal(file.content);
                    }
                     else {
                        printToTerminal("Access denied.");
                    }
                    showPrompt();
                } else if (e.key === "Backspace") {
                    buffer = buffer.slice(0, -1);
                } else if (e.key.length === 1) {
                    buffer += e.key;
                }
            };

            document.addEventListener("keydown", listener);
        } else if (filename === "/dev/deep/core") {
    const lines = file.split("\n");
    lines.forEach((line, index) => {
        setTimeout(() => {
            printToTerminal(line.trimEnd());
            if (index === lines.length - 1) showPrompt();
        }, index * 500);
    });
} else {
    printToTerminal(file);
    showPrompt();
}

    } else {
        printToTerminal(`cat: ${filename}: No such file`);
        showPrompt();
    }

    } else if (cmd === "whoami") {
        const username = typeof getUser === "function" ? getUser() : "guest";
        printToTerminal(`${username}`);
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
    } else if (cmd === "matrix") {
        printToTerminal("Follow the white rabbit, Neo");
        showPrompt();
    } else if (cmd === "please") {
        printToTerminal("nope");
        showPrompt();
    } else if (cmd === "Neo" || cmd === "neo") {
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
    if (!terminalActive) return; // nie przechwytuj, jeśli gra aktywna

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
        localStorage.setItem("showYodaMessage", "1");
        location.reload();
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
        "You're not in a simulation. Are you?",
        "The Matrix has you...",
        "Follow the white rabbit...",
        "Hint: /msg might unlock a hidden path.",
        "Psst... Whisper could reveal something special.",
    ];
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    printToTerminal(pick);
    showPrompt();
}

// sudo
function runSudo(cmd) {
    printToTerminal("[sudo] password for guest: ");
    let passwordBuffer = "";
    terminalActive = false;

    const listener = (e) => {
        if (e.key === "Enter") {
            document.removeEventListener("keydown", listener);
            terminalActive = true;

            printToTerminal("");
            printToTerminal(`Sorry, try again.`);
            printToTerminal(`guest is not in the sudoers file. This incident will be reported.`);
            printToTerminal(`Permission denied: unable to run "${cmd}" as root.`);
            showPrompt();
        } else if (e.key === "Backspace") {
            passwordBuffer = passwordBuffer.slice(0, -1);
        } else if (e.key.length === 1) {
            passwordBuffer += e.key;
        }
    };

    document.addEventListener("keydown", listener);
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
    printToTerminal("  1  ls");
    printToTerminal("  2  cat transmission.log");
    printToTerminal("  3  cat secret.txt");
    printToTerminal("  4  ls -la");
    printToTerminal("  5  cat game.js");
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
        printToTerminal("-rw-r--r--  1 guest guest    60 May 20 22:00 transmission.log");
        printToTerminal("-rw-------  1 guest guest    52 May 20 22:00 .the_path");
        printToTerminal("-rw-------  1 guest guest    47 May 20 22:00 .bash_aliases");
        printToTerminal("-rw-------  1 guest guest    14 May 20 22:00 .sig");
    } else {
        printToTerminal("game.js  index.html  notes.txt  secret.txt  transmission.log");
    }
    showPrompt();
}

function runCurl(url) {
    if (!url) {
        printToTerminal("curl: no URL specified!");
    } else if (Math.random() < 0.3) {
        printToTerminal(`curl: (7) Failed to connect to ${url} port 80: Connection refused`);
    } else {
        printToTerminal(`<html>
        <head><title>response</title></head>
        <body style="font-family:monospace; background:#000; color:#33ff33; padding:0.5rem;">
        <h1 style="margin-bottom:0;">THE EYE SYSTEM INTERFACE v1.04</h1>
        <p>Request acknowledged from <strong>${url}</strong></p>
        <p>Message:</p>
        <pre>
        The machines are watching.

        Your request has been recorded.
        Your presence is known.

        :: Await further instructions ::
        </pre>
        </body>
        </html>`);
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

function getRandomIp() {
    const rand = () => Math.floor(Math.random() * 256);
    return `${rand()}.${rand()}.${rand()}.${rand()}`;
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
                printToTerminal("\n");
const screen1 = String.raw`..................................../~\
...................................|oo )....Oh.no
..................................._\=/_....They.found.us!
....................___........#../.._..\....We.are.doomed...
.................../().\.......\\//|/.\|\\
................._|_____|_......\/..\_/..||
................|.|.===.|.|........|\./|.||
................|_|..O..|_|........\_._/..#
.................||..O..||.........|.|.|
.................||__*__||.........|.|.|
................|~.\___/.~|........[]|[]
_______________[=/=\=/=\=/=]______[|.[|.|______________________`;


const screen2 = String.raw`............./~~\
............|<><>|
............/_/\_\...........Commander,.it's.those.machines.
............/\___/\..........They've,been.pulling.the.strings
...........//.[.]|\\................from.the.shadows...
..........//|.[_]|.\\
..........\\|....|.//
...........\#====|#/
.........../I\../I\
........../.|.||.I.\
........./..|.||.|..\
-------------------------------------------------------------------`;

const screen3 = String.raw`................................====
...............................(o-o)
..............................._\-./_....Eliminate.them
............................../.\./..\.......Emperor
............................//|.|..|\\
...........................//.|.|..|//
..........................//..|.|..//
.........................('...|===(|
..............................|.||.|
..............................(_)(_)
..............................|_||_|
_____________________________/__][__\______________________`;

const screen5 = String.raw`
@▄re not▄@*=@@.......#.+..▄▄▄▄▄▄▄▄▄▄▄▄▄▀@@@.%#.@@@@=%@@@@@@@*
▄@*=@@..▄▄..#.+..▄▄You we▄re not▄..▄▄▄▀@@@.%#.@e..#.+..ap▄▀th
are▀not.... ▄▀ . ☠ ▀▄▄allo▀ates`;

const screen4 = String.raw`
............./~~\
............|<><>|....At.last........................****
............/_/\_\...The.machines...................*/.().\*
........../..\...\\...are.no.more..................*|_____|*
........././..|.\.\.____..........................*.|.===.|.*
.........\.\..|.|\_/.___(*************************.||..O..||*
..........\().|.|./_/.............................*||__*__||*
............/I\../I\..............................*~.\___/.~*
.........../.|.||.I.\............................*=/\=/\=/=\=*
__________/..|.||.|..\____________________________**********_`;

printAsciiArtLineByLine(screen1, 90)
  .then(() => new Promise(resolve => setTimeout(resolve, 2700)))
  .then(() => printAsciiArtLineByLine(screen2, 90))
  .then(() => new Promise(resolve => setTimeout(resolve, 3400)))
  .then(() => printAsciiArtLineByLine(screen3, 90))
  .then(() => new Promise(resolve => setTimeout(resolve, 2900)))
  .then(() => printAsciiArtLineByLine(screen4, 50));



setTimeout(() => {
                        printToTerminal(String.raw`
                        `);
                        setTimeout(() => {
                            printToTerminal("(▄@*stre▀am termi▄▀nated ☠ ▀▄▄al)");
                            setTimeout(() => {
                                printToTerminal("si▀▄gnal lost...");
                            }, 2000);

                            setTimeout(() => {
                                printToTerminal("attempti▀ng to tra▄▀ce source...");
                            }, 3800);

                            setTimeout(() => {
                                printToTerminal("> trace complete▀:");
                            }, 5500);

                            setTimeout(() => {
                                printToTerminal("  http://mysite.abc/awakening.html");
                                showPrompt();
                            }, 7100);
                        }, 2500);
                    }, 14000);
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

function printAsciiArtLineByLine(asciiArt, delay = 100) {
    return new Promise(resolve => {
        const lines = asciiArt.split('\n');
        let index = 0;

        function printNextLine() {
            if (index < lines.length) {
                terminalContent.innerHTML += `<div>${lines[index]}</div>`;
                terminalContent.scrollTop = terminalContent.scrollHeight;
                index++;
                setTimeout(printNextLine, delay);
            } else {
                resolve();
            }
        }

        printNextLine();
    });
}

function generateTransmissionLogEntry() {
    const places = [
        "Zebes", "LV-426", "Proxima Centauri b", "Tau Ceti IV", "Pandora",
        "Nexus Prime", "Charon", "Vulcan", "Europa", "Titan", "Ganymede",
        "Kepler-22b", "Erebus", "Helghan", "Kobol", "Yavin IV", "Dagobah",
        "Rhea", "Ceres", "Trappist-1e", "Hyperion", "Persephone", "Niflheim",
        "Earth", "Moon", "Saturn", "Jupiter"
    ];

    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, "0");
    const ampm = Math.random() > 0.5 ? "AM" : "PM";
    const time = `${hour}:${minute}${ampm}`;

    const place = places[Math.floor(Math.random() * places.length)];

    const message = `"find%.me.▄▀you .are ☠ ▀▄my▄only#▀hope☠▀▄."`;

    return `Escape Pod spotted at ${time} near ${place}.\nTransmission intercepted: ${message}`;
}

function runPing(host) {
    if (!host) {
        printToTerminal("ping: missing host operand");
        showPrompt();
        return;
    }

    const count = 4;
    let sent = 0;

    const interval = setInterval(() => {
        if (sent >= count) {
            clearInterval(interval);
            printToTerminal(`\n--- ${host} ping statistics ---`);
            printToTerminal(`${count} packets transmitted, ${count} received, 0% packet loss`);
            printToTerminal(`rtt min/avg/max = 22.8/27.3/35.4 ms`);
            showPrompt();
            return;
        }

        const time = (22 + Math.random() * 15).toFixed(1);
        printToTerminal(`64 bytes from ${host}: icmp_seq=${sent + 1} ttl=56 time=${time} ms`);
        sent++;
    }, 500);
}

function runSsh(host) {
    if (!host) {
        printToTerminal("ssh: missing host argument");
        showPrompt();
        return;
    }

    printToTerminal(`Connecting to ${host}...`);
    setTimeout(() => {
        const fakeFingerprint = "SHA256:" + btoa(Math.random().toString()).substring(0, 20);
        printToTerminal(`The authenticity of host '${host}' can't be established.`);
        printToTerminal(`ECDSA key fingerprint is ${fakeFingerprint}.`);
        printToTerminal(`Are you sure you want to continue connecting (yes/no)?`);

        let buffer = "";
        terminalActive = false;

        const listener = (e) => {
            if (e.key === "Enter") {
                document.removeEventListener("keydown", listener);
                terminalActive = true;
                const answer = buffer.trim().toLowerCase();
                if (answer === "yes") {
                    printToTerminal("Warning: Permanently added '" + host + "' (ECDSA) to the list of known hosts.");
                    setTimeout(() => {
                        printToTerminal(`ssh: ${host}: Remote host closed the connection.`);
                        showPrompt();
                    }, 1000);
                } else {
                    printToTerminal("Host key verification failed.");
                    showPrompt();
                }
            } else if (e.key === "Backspace") {
                buffer = buffer.slice(0, -1);
            } else if (e.key.length === 1) {
                buffer += e.key;
            }
        };

        document.addEventListener("keydown", listener);
    }, 800);
}

function runSl() {
    const frame1 = String.raw`
...............__---__
.............-'...:...'-.
.........../.......:.__...\
........../........./..\....\
........./.:..:...:|.().|..:\
........:...........\___/....|
........|_____________.______|
........:...:..:...:........::
.........\................../
..........\.......:......../
...........\._........._./
..............-..___..-
`;
    const frame2 = String.raw`
....................__---__
..................-'...:...'-.
................/.......:.__...\
.............../........./..\....\
............../.:..:...:|.().|..:\
.............:...........\___/....|
.............|_____________.______|
.............:..:..:....:........::
..............\................../
...............\.......:......../
................\._........._./
...................-..___..-
`;
    const frame3 = String.raw`
..........................__---__
........................-'...:...'-.
....................../.......:.__...\
...................../......../..\.....\
..................../.:..:...|.().|....:\
...................:..........\___/.....|
...................|_____________.______|
...................:..:..:...:.........::
....................\................../
.....................\.......:......../
......................\._........._./
.........................-..___..-
`;
    const frame4 = String.raw`
...............................__---__
.............................-'...:...'-.
.........................../.......:.__...\
........................../......../..\.....\
........................./.:..:..:|.().|....:\
........................:..........\___/.....|
........................|_____________.______|
........................:..:...:...:........::
.........................\................../
..........................\.......:......../
...........................\._........._./
..............................-..___..-
`;
    const frame5 = String.raw`
.....................................__---__
...................................-'...:...'-.
................................./.......:.__...\
................................/......./..\......\
.............................../.:..:.:|.().|.....:\
..............................:.........\___/......|
..............................|_____________.______|
..............................:...:..:...:........::
...............................\................../
................................\.......:......../
.................................\._........._./
....................................-..___..-
`;
    const frame6 = String.raw`
..........................................__---__
........................................-'...:...'-.
....................................../.......:.__...\
...................................../......./..\......\
..................................../.:.:..:|.().|.....:\
...................................:.........\___/......|
...................................|_____________.______|
...................................:...:..:...:........::
....................................\................../
.....................................\.......:......../
......................................\._........._./
.........................................-..___..-
`;
    const frame7 = String.raw`
................................................__---__
..............................................-'...:...'-.
............................................/.......:.__...\
.........................................../....../..\.......\
........................................../.:...:|.().|..:...:\
.........................................:........\___/.......|
.........................................|_____________.______|
.........................................:...:..:...:........::
..........................................\................../
...........................................\.......:......../
............................................\._........._./
...............................................-..___..-
`;
    const frame8 = String.raw`
......................................................__---__
....................................................-'...:...'-.
................................................../.......:.__...\
................................................./....../..\.......\
................................................/.:...:|.().|...:..:\
...............................................:........\___/.......|
...............................................|_____________.______|
...............................................:...:..:...:........::
................................................\................../
.................................................\.......:......../
..................................................\._........._./
.....................................................-..___..-
`;
    const frame9 = String.raw`
............................................................__---__
..........................................................-'...:...'-.
......................................................../.......:.__...\
......................................................./...../..\........\
....................................................../.:..:|.().|....:..:\
......................................................:......\___/.........|
......................................................|_____________.______|
......................................................:...:..:...:........::
.......................................................\................../
........................................................\.......:......../
.........................................................\._........._./
............................................................-..___..-
`;
    const frame10 = String.raw`
..................................................................__---__
................................................................-'...:...'-.
............................................................../.......:.__...\
............................................................./...../..\........\
............................................................/.:..:|.().|..:....:\
...........................................................:.......\___/........|
...........................................................|_____________.______|
...........................................................:...:..:...:........::
............................................................\................../
.............................................................\.......:......../
..............................................................\._........._./
.................................................................-..___..-
`;
    const frame11 = String.raw`
...............................................................................
...............................................................................
...............................................................................
...............................................................................
...............YOU.............................................................
.....................ARE.......................................................
.............................BEING.............................................
.........OBSERVED..............................................................
...............................................................................
...............................................................................
...............................................................................
...............................................................................
`;
    const frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame10, frame11];
    let i = 0;
    terminalActive = false;
    const interval = setInterval(() => {
        clearTerminal();
        printToTerminal(frames[i]);
        i++;
        if (i >= frames.length) {
            clearInterval(interval);
            printToTerminal("The ghost train... or something greater... just passed.");
            terminalActive = true;
            showPrompt();
        }
    }, 200);
}

function runLast() {
    const username = typeof getUser === "function" ? getUser() : "guest";
    const now = new Date();
    const dateStr = now.toDateString().replace(/^\w+ /, "");
    const timeStr = now.toTimeString().slice(0, 5);

    printToTerminal(`${username.padEnd(9)}tty1         ${dateStr} ${timeStr}   still logged in`);

    if (localStorage.getItem("ghostRevealed") === "1" || window.__ghostRevealed) {
        printToTerminal(`ghost     pts/1337     May 20 22:02   never logged out`);
    } else {
        printToTerminal(`???       pts/1337     ??? ?? ??:??   unknown`);
    }
    showPrompt();
}

function runXxd(filename) {
    const hexFiles = {
        ".sig": `You are not the first to reach this depth.
They left signs in the noise. Fragments. Echoes.
Follow the aliases. One leads to matrix. Another hides the rabbit
of no color. The path is protected, but the password is whispered
across logs. Observe. Trace. Decode. Neo.
Some might respond to whisper, if you dare.
`,
    };

    if (!filename) {
        printToTerminal("xxd: no input file specified");
    } else if (hexFiles[filename]) {
        printToTerminal(`xxd: decoding ${filename}...`);
        printToTerminal(hexFiles[filename]);
    } else {
        printToTerminal(`xxd: ${filename}: I/O error or no such file`);
    }
    showPrompt();
}

// === Init ===
const now = new Date();
const loginTimestamp = now.toString().split(" ").slice(0, 5).join(" ");
const fakeIp = getRandomIp();
const kernelVersion = "4.19.0-27-cloud-amd64 #1 SMP Bebian 4.19.316-1 (2024-06-25)";
const hostName = "vps-2137jp2b";
const welcomeMessages = [
    "Hello, dear wanderer. Feel free to explore the system.",
    "Welcome, traveler. The terminal awaits your curiosity.",
    "Hi there. Type `help` if you're lost.",
    "Greetings, observer. You have terminal access. Use it wisely.",
    "User session initialized. Play around. Discover.",
    "Permission granted. Interface unlocked. Proceed.",
    "Hey stranger. The system is yours to explore.",
    "Ah, a visitor. What brings you here, into the shell?",
    "You're in. Look around, see what you can find.",
    "Hello dear wanderer, the terminal awaits your curiosity. Use it wisely"
];
const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

printToTerminal(randomWelcome + "\n");

//printToTerminal(`Linux ${hostName} ${kernelVersion} x86_64\n`);
printToTerminal(`Last login: ${loginTimestamp} from ${fakeIp}\n`);

if (localStorage.getItem("showYodaMessage") === "1") {
    localStorage.removeItem("showYodaMessage");
    printToTerminal("Yoda: Smart, it was not. But recover, I did.");
    printToTerminal("Yoda: /msg me, trickster, if more you seek.");
}

showPrompt();



