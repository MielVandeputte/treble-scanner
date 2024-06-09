import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ContextProvider } from './context-provider.tsx';
import { LoginPage } from './(pages)/login-page.tsx';
import { Page } from './(pages)/scanner/page.tsx';
import { MenuPage } from './(pages)/menu-page.tsx';
import { ManualScannerPage } from './(pages)/manual-scanner-page.tsx';
import './globals.css';

const router = createBrowserRouter([
    { path: '/', element: <LoginPage /> },
    { path: '/scanner', element: <Page /> },
    { path: '/menu', element: <MenuPage /> },
    { path: '/manual-scanner', element: <ManualScannerPage /> },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </StrictMode>
);
