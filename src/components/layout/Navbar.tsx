
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Brain, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Questions', path: '/questions' },
    { name: 'Study', path: '/study' },
    { name: 'Progress', path: '/progress' },
    { name: 'About', path: '/about' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked or route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'py-3 glass-morphism border-b' 
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <div className="relative w-8 h-8">
            <Brain className="absolute text-primary w-8 h-8" />
            <Lock className="absolute text-primary w-8 h-8 opacity-70 transform translate-x-1 translate-y-1" />
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            MindLock
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-primary',
                {
                  'text-primary': location.pathname === link.path,
                  'text-foreground/70': location.pathname !== link.path,
                  'animate-slide-down': true,
                  'animation-delay-[100ms]': index === 0,
                  'animation-delay-[150ms]': index === 1,
                  'animation-delay-[200ms]': index === 2,
                  'animation-delay-[250ms]': index === 3,
                  'animation-delay-[300ms]': index === 4,
                }
              )}
              style={{ 
                animationDelay: `${100 + (index * 50)}ms`,
                animationFillMode: 'both' 
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="pl-2 animate-fade-in" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
            <Button variant="default" size="sm" className="shadow-md hover:shadow-lg transition-all">
              Get Started
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="glass-morphism border-t md:hidden animate-fade-in">
          <nav className="container mx-auto py-4 px-6 flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-3 rounded-md text-base font-medium transition-all duration-200 animate-slide-up',
                  location.pathname === link.path ? 'text-primary bg-background/50' : 'text-foreground/70'
                )}
                style={{ 
                  animationDelay: `${100 + (index * 50)}ms`,
                  animationFillMode: 'both' 
                }}
              >
                {link.name}
              </Link>
            ))}
            <Button 
              variant="default" 
              size="default" 
              className="shadow-md mt-2 animate-slide-up"
              style={{ animationDelay: '350ms', animationFillMode: 'both' }}
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
