function runMatrixEffect() {
    const matrixCanvas = document.createElement("canvas");
    matrixCanvas.style.position = "fixed";
    matrixCanvas.style.top = 0;
    matrixCanvas.style.left = 0;
    matrixCanvas.style.width = "100%";
    matrixCanvas.style.height = "100%";
    matrixCanvas.style.zIndex = 9998;
    matrixCanvas.style.background = "black";
    document.body.appendChild(matrixCanvas);

    const ctx = matrixCanvas.getContext("2d");
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = "abcdefghijklmnopqRstuvWxyz0123456789@#$%^&*()*&^%";
    const columns = matrixCanvas.width / 20;
    const drops = Array.from({ length: columns }).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = "#0F0";
        ctx.font = "16px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const interval = setInterval(drawMatrix, 50);

    setTimeout(() => {
        clearInterval(interval);
        document.body.removeChild(matrixCanvas);
    }, 4000);

    setTimeout(() => {
    printToTerminal("follow the white_rabbit");
    showPrompt();
}, 4100);
}


//function runMatrixEffect() {
//    const matrixCanvas = document.createElement("canvas");
//    matrixCanvas.style.position = "fixed";
//    matrixCanvas.style.top = 0;
//    matrixCanvas.style.left = 0;
//    matrixCanvas.style.width = "100%";
//    matrixCanvas.style.height = "100%";
//    matrixCanvas.style.zIndex = 9998;
//    matrixCanvas.style.background = "black";
//    document.body.appendChild(matrixCanvas);
//
//    const ctx = matrixCanvas.getContext("2d");
//    matrixCanvas.width = window.innerWidth;
//    matrixCanvas.height = window.innerHeight;
//
//    // Użyjemy mniejszej liczby znaków, bardziej w stylu retro
//    const chars = "10";
//
//    // Większy rozmiar pikseli dla efektu 8-bit
//    const pixelSize = 12;
//    const columns = Math.floor(matrixCanvas.width / pixelSize);
//    const rows = Math.floor(matrixCanvas.height / pixelSize);
//
//    // Paleta kolorów retro - zielone odcienie jak stare monitory
//    const colors = [
//        "#003300",
//        "#006600",
//        "#009900",
//        "#00CC00",
//        "#00FF00"
//    ];
//
//    // Inicjalizacja macierzy do przechowywania znaków i ich jasności
//    const matrix = Array(columns).fill().map(() => Array(rows).fill(null).map(() => ({
//        char: chars[Math.floor(Math.random() * chars.length)],
//        brightness: 0,
//        active: false
//    })));
//
//    // Aktywne "krople" (typowe dla efektu matrix)
//    const drops = Array(columns).fill().map(() => ({
//        active: false,
//        position: 0,
//        speed: 1 + Math.floor(Math.random() * 3)
//    }));
//
//    function drawRetroMatrix() {
//        // Lekkie przyciemnienie ekranu zamiast pełnego czyszczenia
//        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
//        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
//
//        // Losowo uruchamiaj nowe krople
//        if (Math.random() > 0.9) {
//            const col = Math.floor(Math.random() * columns);
//            if (!drops[col].active) {
//                drops[col].active = true;
//                drops[col].position = 0;
//                drops[col].speed = 1 + Math.floor(Math.random() * 3);
//            }
//        }
//
//        // Aktualizacja i rysowanie aktywnych kropli
//        for (let i = 0; i < columns; i++) {
//            if (drops[i].active) {
//                const pos = drops[i].position;
//
//                // Zaznacz aktualną pozycję kropli
//                if (pos < rows) {
//                    matrix[i][pos].char = chars[Math.floor(Math.random() * chars.length)];
//                    matrix[i][pos].brightness = 4; // Najjaśniejszy
//                    matrix[i][pos].active = true;
//                }
//
//                // Oświetl ślad za kroplą
//                for (let j = 1; j <= 3; j++) {
//                    if (pos - j >= 0 && pos - j < rows) {
//                        matrix[i][pos - j].brightness = Math.max(0, 4 - j);
//                    }
//                }
//
//                // Przesuń kroplę
//                drops[i].position += drops[i].speed;
//
//                // Jeśli kropla doszła do dołu ekranu, dezaktywuj ją
//                if (pos >= rows + 3) {
//                    drops[i].active = false;
//                }
//            }
//        }
//
//        // Narysuj całą macierz
//        for (let x = 0; x < columns; x++) {
//            for (let y = 0; y < rows; y++) {
//                const cell = matrix[x][y]; // POPRAWIONO: Zmieniono i na x
//
//                // Stopniowo przyciemniaj wszystkie komórki
//                if (cell.brightness > 0) {
//                    if (Math.random() > 0.8) {
//                        cell.brightness = Math.max(0, cell.brightness - 1);
//                    }
//
//                    // Narysuj piksel (kwadrat)
//                    ctx.fillStyle = colors[cell.brightness];
//                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
//
//                    // Dla niektórych pikseli dodaj efekt 8-bitowego znaku
//                    if (cell.active && Math.random() > 0.5) {
//                        ctx.fillStyle = colors[4]; // Najjaśniejszy kolor
//                        ctx.font = `${pixelSize}px monospace`;
//                        ctx.fillText(
//                            cell.char,
//                            x * pixelSize + pixelSize/4,
//                            y * pixelSize + pixelSize/1.2
//                        );
//                    }
//                }
//            }
//        }
//    }
//
//    // Więcej kropel na początek dla lepszego efektu
//    for (let i = 0; i < columns / 3; i++) {
//        const col = Math.floor(Math.random() * columns);
//        drops[col].active = true;
//        drops[col].position = Math.floor(Math.random() * rows / 2);
//    }
//
//    const interval = setInterval(drawRetroMatrix, 100); // Wolniejsze odświeżanie dla efektu retro
//
//    // Zatrzymaj efekt po 7 sekundach
//    setTimeout(() => {
//        clearInterval(interval);
//        document.body.removeChild(matrixCanvas);
//    }, 7000);
//}

// Funkcja do uruchamiania efektu
function startMatrixEffect() {
    runMatrixEffect();
}

// Uruchom efekt automatycznie
startMatrixEffect();