import { Header } from './components/header';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div>
      <Header />
      <main className="max-h-[calc(100dvh-64px)] overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
