import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/toaster';
import { useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={`flex-1 ${isLandingPage ? '' : 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'}`}>
        {children}
      </main>
      {isLandingPage && <Footer />}
      <div className="fixed top-4 right-4 z-[9999]">
        <Toaster />
      </div>
    </div>
  );
};
