
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Book, Home, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import StudyModal from '@/components/StudyModal';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const routes = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/questions', label: 'Questions', icon: Book },
    { path: '/study', label: 'Study', icon: Book },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md z-40 border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">MindLock</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <nav className="flex items-center gap-1">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;
                
                return (
                  <Button
                    key={route.path}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    asChild
                  >
                    <Link to={route.path} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-[57px] bg-background z-50 animate-fade-in">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-2">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = location.pathname === route.path;
              
              return (
                <Button
                  key={route.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-lg py-6"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to={route.path} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
