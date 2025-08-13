const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ringContainer = document.getElementById("ring-container");
const video = document.getElementById("video");
const cameraSelect = document.getElementById("camera-select");

const letterStates = {}; // 0 = default, 1 = red, 2 = green

// Create letter elements in a circle
const radius = 250; // distance from center
letters.forEach((letter, i) => {
  const angle = (i / letters.length) * (2 * Math.PI);
  const x = Math.cos(angle) * radius + ringContainer.clientWidth / 2 - 25;
  const y = Math.sin(angle) * radius + ringContainer.clientHeight / 2 - 25;

  const el = document.createElement("div");
  el.className = "letter";
  el.textContent = letter;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  ringContainer.appendChild(el);
  letterStates[letter] = 0;
});

// Handle key presses
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (letters.includes(key)) {
    letterStates[key] = (letterStates[key] + 1) % 3; // cycle 0→1→2→0

    const el = [...document.getElementsByClassName("letter")].find(
      (l) => l.textContent === key
    );
    el.classList.remove("red", "green");
    if (letterStates[key] === 1) el.classList.add("red");
    else if (letterStates[key] === 2) el.classList.add("green");
  }
});

// Camera handling
async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((d) => d.kind === "videoinput");

  cameraSelect.innerHTML = "";
  videoDevices.forEach((device, idx) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label || `Camera ${idx + 1}`;
    cameraSelect.appendChild(option);
  });
}

async function startCamera(deviceId) {
  if (window.stream) {
    window.stream.getTracks().forEach((track) => track.stop());
  }
  const constraints = {
    video: { deviceId: deviceId ? { exact: deviceId } : undefined }
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  window.stream = stream;
  video.srcObject = stream;
}

cameraSelect.addEventListener("change", () => {
  startCamera(cameraSelect.value);
});

// Initialize
(async () => {
  await getCameras();
  if (cameraSelect.options.length > 0) {
    startCamera(cameraSelect.value);
  }
})();
