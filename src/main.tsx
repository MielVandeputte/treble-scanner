import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from './pages/login-page.tsx';
import { ScannerPage } from './pages/scanner-page.tsx';
import { MenuPage } from './pages/menu-page.tsx';
import { ManualScannerPage } from './pages/manual-scanner-page.tsx';
import { ContextProvider } from './context-provider.tsx';

const router = createBrowserRouter([
    { path: '/', element: <LoginPage /> },
    { path: '/scanner', element: <ScannerPage /> },
    { path: '/menu', element: <MenuPage /> },
    { path: '/manual-scanner', element: <ManualScannerPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </React.StrictMode>
);
