import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
if (adsenseClient) {
  const meta = document.createElement('meta');
  meta.name = 'google-adsense-account';
  meta.content = adsenseClient;
  document.head.appendChild(meta);

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://pagead2.googlesyndication.com';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
