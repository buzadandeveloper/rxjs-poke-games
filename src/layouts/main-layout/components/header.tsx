import { NavLink } from 'react-router';
import { ROUTES } from '#constants';
import { cn } from '#lib';

export const Header = () => {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 shadow-sm">
      <div className="flex-1">
        <span className="text-xl font-bold">Poké Games</span>
      </div>
      <nav className="flex gap-2">
        {routes.map((route, index) => (
          <NavLink
            to={route.path}
            key={index}
            className={({ isActive }) =>
              cn('btn btn-primary btn-outline', { 'btn-active': isActive })
            }
            viewTransition
          >
            {route.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

const routes = [
  {
    path: ROUTES.POKE_DEX,
    name: 'Dex',
  },
  {
    path: ROUTES.POKE_MEMORY_GAME,
    name: 'Memory game',
  },
];
