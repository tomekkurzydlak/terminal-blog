
let currentUser = localStorage.getItem("terminalUsername") || "guest";

function setName(newName) {
    currentUser = newName;
    localStorage.setItem("terminalUsername", newName);
    printToTerminal(`Hello, ${newName}. Your identity has been updated.`);
    showPrompt();
}

function getUser() {
    return currentUser;
}
