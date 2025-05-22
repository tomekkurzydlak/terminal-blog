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

    printToTerminal("\n");
    printToTerminal("System & Files:");
    printToTerminal("  ls                    list directory contents");
    printToTerminal("  cat <file>            display file contents");
    printToTerminal("  cd <dir>              change directory");
    printToTerminal("  rm <file>             remove file");
    printToTerminal("  mkdir <dir>           make directory");
    printToTerminal("  touch <file>          create empty file");

    printToTerminal("\n");
    printToTerminal("Networking:");
    printToTerminal("  curl <url>            transfer data from URL");
    printToTerminal("  wget <url>            download file");
    printToTerminal("  telnet <host>         open telnet connection");
    printToTerminal("  ping <host>           test host reachability");
    printToTerminal("  ssh <host>            connect via SSH");

    printToTerminal("\n");
    printToTerminal("Identity & Environment:");
    printToTerminal("  whoami                show current user");
    printToTerminal("  name <name>           set user name");
    printToTerminal("  pwd                   print working directory");
    printToTerminal("  env                   display environment");

    printToTerminal("\n");
    printToTerminal("Processes & System:");
    printToTerminal("  ps                    list active processes");
    printToTerminal("  top                   display real-time process info");
    printToTerminal("  uptime                show system uptime");
    printToTerminal("  who                   show who is logged in");

    printToTerminal("\n");
    printToTerminal("Misc:");
    printToTerminal("  sudo <cmd>            execute command as superuser");
    printToTerminal("  echo <text>           display line of text");
    printToTerminal("  history               show command history");
    printToTerminal("  exit                  terminate session");

    showPrompt();


    } else if (cmd === "pwd") {
        printToTerminal("/home/guest");
        showPrompt();

    } else if (cmd === "cd /dev/deep/core") {
    printToTerminal("You feel a strange shift in reality...");
    setTimeout(() => {
        printToTerminal("Accessing core memory structures...");
    }, 800);
    setTimeout(() => {
        printToTerminal("Core protected. Read only.");
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
        "notes.txt": "1.Buy milk\n2.Write code\n3.Escape the matrix... but is that even possible? Can we escape the matrix? How can we do it? Can we destroy all the machines? Damn AI. Is everywhere. Is watching us. Is watching YOU",
        ".the_path": {
            protected: true,
            content: `ACCESS GRANTED.\nCoordinates received.\nDecode location: /dev/deep/core`
        },
        ".bash_aliases": `alias neo='matrix'
        alias ls='ls --color=auto'
        alias sudo='echo nope'
        alias help='man help'
        alias please='sudo'`,
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
        ☠ ▀▄▄Coordin▀ates: te▀lnet towel.blinkenlights.nl
        `
    };

    const file = fakeFiles[filename];

    if (file) {
        // Jeśli to obiekt chroniony
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
                        printToTerminal(file.content);
                    } else {
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
        printToTerminal("Follow the white_rabbit, Neo");
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
        printToTerminal("-rw-------  1 guest guest    42 May 20 22:00 .the_path");
        printToTerminal("-rw-------  1 guest guest    57 May 20 22:00 .bash_aliases");
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
................|_|..O..|_|........\_._/...#
..................||..O..||.........|.|.|
..................||__*__||.........|.|.|
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
............|<><>|....At.last.......................****
............/_/\_\...The.machines..................*/.().\*
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


