import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Competitions from './pages/Competitions.jsx';
import Competitors from './pages/Competitors.jsx';
import Results from './pages/Results.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'competitions', element: <Competitions /> },
            { path: 'competitors', element: <Competitors /> },
            { path: 'results', element: <Results /> },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
