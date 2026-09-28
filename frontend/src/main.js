const statusEl = document.getElementById('status');

// Uses a relative path on purpose: in production Nginx serves this page and
// reverse-proxies /api/* to the gateway from the same origin, so no absolute
// URL or CORS handling is needed here. In local dev, vite.config.js proxies
// this same path to the gateway running on localhost:8080.
fetch('/api/health')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    statusEl.textContent = `Backend reachable: ${JSON.stringify(data)}`;
  })
  .catch((error) => {
    statusEl.textContent = `Could not reach backend: ${error.message}`;
  });
