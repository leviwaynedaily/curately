export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    console.log('Attempting to unregister service worker...');
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        const result = await registration.unregister();
        console.log('Service worker unregistered:', result);
      }
      
      console.log('All service workers have been unregistered');
      window.location.reload(); // Reload to ensure clean state
    } catch (error) {
      console.error('Error unregistering service worker:', error);
    }
  } else {
    console.log('Service workers are not supported in this browser');
  }
};