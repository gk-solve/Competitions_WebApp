import { NavLink, Outlet } from 'react-router-dom';

// Site header/nav/footer shared across all pages, plus the routed page content.
export default function App() {
    return (
        <>
            <header>
                <h1>Compétitions Sportives</h1>

                <nav>
                    <NavLink to="/">Accueil</NavLink>
                    <NavLink to="/competitions">Compétitions</NavLink>
                    <NavLink to="/competitors">Compétiteurs</NavLink>
                    <NavLink to="/results">Résultats</NavLink>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>Base de données sportive - Version 1.0</footer>
        </>
    );
}
