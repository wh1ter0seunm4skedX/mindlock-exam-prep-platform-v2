
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  
  // Check if we're in study mode to hide navbar and footer
  const isStudyPage = location.pathname.startsWith('/study/');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isStudyPage && <Navbar />}
      <main className={`flex-grow ${!isStudyPage ? 'pt-24' : ''}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-muted"></div>
        <div className="h-4 w-24 rounded bg-muted"></div>
      </div>
    </div>
  );
};

export default Layout;
