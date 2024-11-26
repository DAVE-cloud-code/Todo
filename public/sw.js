self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received');
  
    let data = {};
    try {
      data = event.data.json(); // Parse the push event data as JSON
    } catch (error) {
      console.warn('[Service Worker] Push data is not valid JSON, using default data.');
      data = { title: 'Default Title', body: 'Default notification body' };
    }
  
    const title = data.title || 'Default Notification';
    const options = {
      body: data.body || 'You have a new notification!',
      icon: '/vite.svg', // Replace with your actual icon path
      badge: '/vite.svg',       // Replace with your actual badge path
    };
  
    console.log('[Service Worker] Showing Notification:', { title, options });
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  