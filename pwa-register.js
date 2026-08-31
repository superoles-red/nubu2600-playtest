(() => {
  if (!('serviceWorker' in navigator)) return;
  const scriptUrl = document.currentScript?.src || window.location.href;
  const workerUrl = new URL('service-worker.js', scriptUrl);
  const registrationPromise = navigator.serviceWorker.register(workerUrl, { updateViaCache: 'none' });
  let fullCacheRequested = false;
  registrationPromise.catch(error => {
    console.warn('NuBu2600 offline mode is unavailable:', error);
  });

  function backgroundWorkPaused() {
    return new URLSearchParams(window.location.search).get('editorPlay') === '1'
      || document.documentElement.dataset.backgroundWorkPaused === 'true';
  }

  function postFullCacheRequest(registration) {
    if (backgroundWorkPaused()) return;
    const workers = new Set([registration?.active, registration?.waiting, registration?.installing].filter(Boolean));
    for (const worker of workers) worker.postMessage({ type: 'nubu:complete-offline-cache' });
  }

  function watchInstallingWorker(registration, worker) {
    if (!worker) return;
    const postWhenReady = () => {
      if (fullCacheRequested && (worker.state === 'installed' || worker.state === 'activated')) {
        postFullCacheRequest(registration);
      }
    };
    worker.addEventListener('statechange', postWhenReady);
    postWhenReady();
  }

  registrationPromise.then(registration => {
    watchInstallingWorker(registration, registration.installing);
    registration.addEventListener('updatefound', () => watchInstallingWorker(registration, registration.installing));
  }).catch(() => {});

  function campaignSeedStatus() {
    const ownStatus = document.documentElement.dataset.campaignSeedStatus;
    if (ownStatus) return ownStatus;
    const editorFrame = document.getElementById('editorFrame');
    try { return editorFrame?.contentDocument?.documentElement?.dataset?.campaignSeedStatus || ''; }
    catch (error) { return ''; }
  }

  function requestFullOfflineCache() {
    fullCacheRequested = true;
    if (backgroundWorkPaused()) return;
    navigator.serviceWorker.ready.then(registration => {
      postFullCacheRequest(registration);
    }).catch(() => {});
  }

  const startedAt = Date.now();
  const monitor = setInterval(() => {
    if (backgroundWorkPaused()) return;
    const status = campaignSeedStatus();
    if (status === 'complete' || status === 'error') {
      clearInterval(monitor);
      setTimeout(requestFullOfflineCache, 15000);
    } else if (Date.now() - startedAt >= 60000) {
      clearInterval(monitor);
      requestFullOfflineCache();
    }
  }, 1000);
  window.addEventListener('nubu:background-work-state', () => {
    if (fullCacheRequested && !backgroundWorkPaused()) requestFullOfflineCache();
  });
})();
