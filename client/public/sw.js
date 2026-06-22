const CACHE_NAME = "prepol-reset-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip API calls
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === "error") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background sync for notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "daily-reminder") {
    event.waitUntil(
      self.registration.showNotification("El Vigilante dice:", {
        body: "Ya pues, son 2 minutos. ¿Vas a dejar que el alcalde haga lo que quiera?",
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%233b82f6' width='192' height='192'/><text x='50%' y='50%' font-size='120' font-weight='bold' text-anchor='middle' dominant-baseline='central' fill='%23fbbf24'>🐕</text></svg>",
        badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><text x='50%' y='50%' font-size='60' text-anchor='middle' dominant-baseline='central'>🐕</text></svg>",
        tag: "prepol-reminder",
        requireInteraction: false,
      })
    );
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Tienes una notificación en PREPOL RESET",
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%233b82f6' width='192' height='192'/><text x='50%' y='50%' font-size='120' font-weight='bold' text-anchor='middle' dominant-baseline='central' fill='%23fbbf24'>🐕</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><text x='50%' y='50%' font-size='60' text-anchor='middle' dominant-baseline='central'>🐕</text></svg>",
    tag: "prepol-notification",
  };

  event.waitUntil(self.registration.showNotification(data.title || "PREPOL RESET", options));
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
