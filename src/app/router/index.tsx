import { createBrowserRouter } from 'react-router';
import { PokeDexPage, PokeMemoryGamePage } from '#pages';
import { MainLayout } from '#layouts';
import { ROUTES } from '#constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.POKE_DEX,
        element: <PokeDexPage />,
      },
      {
        path: ROUTES.POKE_MEMORY_GAME,
        element: <PokeMemoryGamePage />,
      },
    ],
  },
]);
