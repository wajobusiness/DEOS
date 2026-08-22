import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PlatformSettingsProvider } from './context/PlatformSettingsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PlatformSettingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PlatformSettingsProvider>
  </React.StrictMode>
);

