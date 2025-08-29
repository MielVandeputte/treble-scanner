import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { ScanCredentialsProvider } from './contexts/scan-credentials-provider.tsx';
import { ScanHistoryProvider } from './contexts/scan-history-provider.tsx';
import { CredentialsGuard } from './guards/credentials-guard.tsx';
import { PortraitGuard } from './guards/portrait-guard.tsx';
import { Login } from './pages/login.tsx';
import { ManualScanner } from './pages/manual-scanner.tsx';
import { ScanHistory } from './pages/scan-history.tsx';
import { Scanner } from './pages/scanner/scanner.tsx';

import './globals.css';

export const LOGIN_PATH = '/login';
export const SCANNER_PATH = '/';
export const MANUAL_SCANNER_PATH = '/manual-scanner';
export const SCAN_HISTORY_PATH = '/scan-history';

const router = createBrowserRouter([
  {
    path: LOGIN_PATH,
    element: (
      <CredentialsGuard assertNotPresent>
        <Login />
      </CredentialsGuard>
    ),
  },
  {
    path: SCANNER_PATH,
    element: (
      <CredentialsGuard assertPresent>
        <Scanner />
      </CredentialsGuard>
    ),
  },
  {
    path: MANUAL_SCANNER_PATH,
    element: (
      <CredentialsGuard assertPresent>
        <ManualScanner />
      </CredentialsGuard>
    ),
  },
  {
    path: SCAN_HISTORY_PATH,
    element: (
      <CredentialsGuard assertPresent>
        <ScanHistory />
      </CredentialsGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to={SCANNER_PATH} replace />,
  },
]);

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <ScanCredentialsProvider>
      <ScanHistoryProvider>
        <PortraitGuard>
          <RouterProvider router={router} />
        </PortraitGuard>
      </ScanHistoryProvider>
    </ScanCredentialsProvider>
  </StrictMode>,
);
