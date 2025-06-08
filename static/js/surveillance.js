const surveillanceFeed = document.getElementById("surveillance-feed");
const surveillanceImage = surveillanceFeed.querySelector("img");
const camLabel = surveillanceFeed.querySelector(".cam-label");

const surveillanceCams = [
  { src: "/static/img/cam1.gif", label: "CAM1 — ENTRANCE", duration: 10000 },
  { src: "/static/img/cam2.gif", label: "CAM2 — SERVER ROOM", duration: 5000 },
  { src: "/static/img/cam3.gif", label: "CAM3 — GENERATOR", duration: 5000 },
  { src: "/static/img/cam4.gif", label: "CAM4 — DRONE CAM", duration: 5000 },
  { src: "/static/img/cam5.gif", label: "CAM5 — TUNNEL NODE", duration: 8000 },
  { src: "/static/img/cam6.gif", label: "CAM6 — TUNNEL NODE", duration: 5000 }
];

let cameraTimer = null;
let currentIndex = -1;

function switchToRandomCamera() {
  if (!window.surveillanceEnabled) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * surveillanceCams.length);
  } while (newIndex === currentIndex);

  currentIndex = newIndex;
  const selectedCam = surveillanceCams[currentIndex];

  surveillanceImage.src = selectedCam.src;
  camLabel.textContent = selectedCam.label;

  cameraTimer = setTimeout(() => {
    switchToRandomCamera();
  }, selectedCam.duration);
}

function startSurveillanceLoop() {
  window.surveillanceEnabled = true;
  clearTimeout(cameraTimer);
  switchToRandomCamera();
}

function stopSurveillanceLoop() {
  window.surveillanceEnabled = false;
  clearTimeout(cameraTimer);
}

function overrideSurveillanceGif(gifUrl, labelText = "CAMX — OVERRIDE", duration = 5000) {
  stopSurveillanceLoop();

  surveillanceImage.src = gifUrl;
  camLabel.textContent = labelText;

  setTimeout(() => {
    if (window.surveillanceEnabled) {
      startSurveillanceLoop();
    }
  }, duration);
}

// Export do global scope
window.overrideSurveillanceGif = overrideSurveillanceGif;
window.startSurveillanceLoop = startSurveillanceLoop;
window.stopSurveillanceLoop = stopSurveillanceLoop;
