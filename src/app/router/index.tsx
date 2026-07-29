import { createBrowserRouter } from 'react-router';
import { HomePage, PokeDexPage, PokeMemoryGamePage } from '#pages';
import { MainLayout } from '#layouts';
import { ROUTES } from '#constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.POKE_DEX,
        element: <PokeDexPage />,
      },
      {
        path: ROUTES.POKE_MEMORY_GAME,
        element: <PokeMemoryGamePage />,
      },
      {
        path: '*',
        element: <HomePage />,
      },
    ],
  },
]);
