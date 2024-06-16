import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ContextProvider } from './context-provider.tsx';
import { Login } from './(pages)/page.tsx';
import { Menu } from './(pages)/menu.tsx';
import { ManualScanner } from './(pages)/manual-scanner.tsx';
import './globals.css';
import { Scanner } from './(pages)/scanner/page.tsx';

const router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/scanner', element: <Scanner /> },
    { path: '/menu', element: <Menu /> },
    { path: '/manual-scanner', element: <ManualScanner /> },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </StrictMode>
);
