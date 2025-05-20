let currentPath = "/home";

const fileSystem = {
    "/": {
        type: "dir",
        children: {
            "home": {
                type: "dir",
                children: {
                    "guest": {
                        type: "dir",
                        children: {
                            "notes.txt": { type: "file", content: "Buy milk\nWrite code\nEscape the matrix" },
                            "projects": { type: "dir", children: {} },
                            "secret": { type: "dir", access: "denied" }
                        }
                    }
                }
            }
        }
    }
};

function getCurrentDirectory() {
    return currentPath;
}

function runCd(arg) {
    if (!arg) {
        printToTerminal("cd: missing operand");
        showPrompt();
        return;
    }

    const segments = currentPath.split("/").filter(Boolean);
    let targetPath;

    if (arg === "..") {
        if (segments.length > 0) {
            segments.pop();
            targetPath = "/" + segments.join("/");
        } else {
            targetPath = "/";
        }
    } else if (arg === "/") {
        targetPath = "/";
    } else if (arg.startsWith("/")) {
        targetPath = arg;
    } else {
        targetPath = currentPath + (currentPath === "/" ? "" : "/") + arg;
    }

    const result = resolvePath(targetPath);
    if (!result) {
        printToTerminal(`cd: ${arg}: No such file or directory`);
    } else if (result.type !== "dir") {
        printToTerminal(`cd: ${arg}: Not a directory`);
    } else if (result.access === "denied") {
        printToTerminal(`cd: ${arg}: Permission denied`);
    } else {
        currentPath = normalizePath(targetPath);
    }
    showPrompt();
}

function runLs() {
    const node = resolvePath(currentPath);
    if (!node || node.type !== "dir") {
        printToTerminal("ls: cannot access directory");
        showPrompt();
        return;
    }

    const output = Object.entries(node.children || {}).map(([name, value]) => {
        if (value.type === "dir") return `<span style='color: cyan;'>${name}/</span>`;
        return name;
    }).join("  ");

    printToTerminal(output);
    showPrompt();
}

function resolvePath(path) {
    const parts = path.split("/").filter(Boolean);
    let current = fileSystem["/"];
    for (const part of parts) {
        if (current.children && current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }
    return current;
}

function normalizePath(path) {
    const stack = [];
    const parts = path.split("/");
    for (const part of parts) {
        if (part === "..") {
            stack.pop();
        } else if (part && part !== ".") {
            stack.push(part);
        }
    }
    return "/" + stack.join("/");
}
