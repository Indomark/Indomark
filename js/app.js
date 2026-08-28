document.addEventListener('DOMContentLoaded', () => {
  // Remove stale service workers/caches created by older deployments.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});
  }

  if ('caches' in window) {
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .catch(() => {});
  }

  const loadingBar = document.querySelector('.loading-bar');
  let progress = 12;
  let direction = 1;
  const tick = () => {
    progress += direction * 2;
    if (progress >= 92) direction = -1;
    if (progress <= 12) direction = 1;
    if (loadingBar) loadingBar.style.width = `${progress}%`;
  };

  tick();
  const timer = window.setInterval(tick, 70);
  window.setTimeout(() => {
    window.clearInterval(timer);
    window.location.href = 'signup.html?v=13';
  }, 2200);
});
