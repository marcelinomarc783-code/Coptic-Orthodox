const CACHE_NAME = 'daily-bible-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// ✅ تسجيل التذكير في Service Worker
self.addEventListener('message', (event) => {
    console.log('SW received message:', event.data);
    
    if (event.data && event.data.type === 'SET_REMINDER') {
        const targetTime = event.data.time;
        const [hours, minutes] = targetTime.split(':');
        
        const now = new Date();
        const target = new Date();
        target.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        let delay = target - now;
        if (delay < 0) delay += 24 * 60 * 60 * 1000;
        
        console.log(`Reminder set for ${targetTime}, delay: ${delay}ms`);
        
        setTimeout(() => {
            console.log('Sending notification from SW!');
            self.registration.showNotification("📖 آية اليوم", {
                body: "وقت قراءة كلمة الله",
                icon: "https://cdn-icons-png.flaticon.com/512/2903/2903510.png",
                vibrate: [200, 100, 200],
                requireInteraction: true
            });
        }, delay);
    }
});

// إشعارات الـ Push
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || '📖 آية اليوم', {
      body: data.body || 'وقت قراءة كلمة الله',
      icon: 'https://cdn-icons-png.flaticon.com/512/2903/2903510.png',
      vibrate: [200, 100, 200]
    })
  );
});