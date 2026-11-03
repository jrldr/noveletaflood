import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle ServiceWorker permission denial in sandboxed preview iframes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (
      msg.includes('ServiceWorker') ||
      msg.includes('Service Worker') ||
      msg.includes('denied permission')
    ) {
      event.preventDefault();
      console.warn('ServiceWorker registration not permitted in this sandbox/iframe environment; offline caching bypassed.');
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);

