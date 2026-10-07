const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const connectionStatus = document.querySelector("#connectionStatus");
const liveStatus = document.querySelector("#liveStatus");
const installButtons = [
  document.querySelector("#installBtn"),
  document.querySelector("#heroInstallBtn"),
  document.querySelector("#ctaInstallBtn")
];

let deferredPrompt = null;

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("pulse-theme", theme);
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

const savedTheme = localStorage.getItem("pulse-theme");
const preferredTheme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
applyTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function updateConnectionUI() {
  const online = navigator.onLine;
  liveStatus.textContent = online ? "Online" : "Offline";
  connectionStatus.hidden = online;
  connectionStatus.textContent = online ? "" : "You’re offline. Cached content is still available.";
}

window.addEventListener("online", updateConnectionUI);
window.addEventListener("offline", updateConnectionUI);
updateConnectionUI();

function setInstallButtonsVisible(visible) {
  installButtons.forEach((button) => {
    if (button) button.hidden = !visible;
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  setInstallButtonsVisible(true);
});

async function promptInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  setInstallButtonsVisible(false);
}

installButtons.forEach((button) => button?.addEventListener("click", promptInstall));

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  setInstallButtonsVisible(false);
});

document.querySelector("#year").textContent = new Date().getFullYear();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
