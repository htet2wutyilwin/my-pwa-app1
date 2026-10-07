const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

const searchInput = document.querySelector('#glossary-search');
const glossaryItems = [...document.querySelectorAll('#glossary-list > div')];
const noResults = document.querySelector('#no-results');

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  glossaryItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const visible = text.includes(query);
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (noResults) noResults.hidden = visibleCount !== 0;
});

document.querySelector('#year').textContent = new Date().getFullYear();

let deferredInstallPrompt;
const installButton = document.querySelector('#install-button');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  if (installButton) installButton.hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}
