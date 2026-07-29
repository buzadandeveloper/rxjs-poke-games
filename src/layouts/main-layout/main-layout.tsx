import { Header } from './components';
import { Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div>
      <Header />
      <main className="h-[calc(100dvh-64px)] overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
