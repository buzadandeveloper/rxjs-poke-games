import { createBrowserRouter } from 'react-router';
import { PokeDexPage } from '#pages';
import { MainLayout } from '#layouts';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <PokeDexPage />,
      },
    ],
  },
]);
