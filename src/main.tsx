import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PlatformSettingsProvider } from './context/PlatformSettingsContext';
import { WalletProvider } from './context/WalletContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PlatformSettingsProvider>
        <AuthProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </AuthProvider>
      </PlatformSettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

