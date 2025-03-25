import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Book,
  Home,
  BookOpen,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StudyModal from "@/components/StudyModal";

const Navbar = () => {
  const location = useLocation();
  const [examModeOpen, setExamModeOpen] = useState(false);

  const routes = [
    { path: "/", label: "Home", icon: Home },
    { path: "/questions", label: "Questions", icon: Book },
    { path: "/admin", label: "Admin Panel", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Navigate to home"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-wide">MindLock</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {routes.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant={isActive(path) ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="flex items-center gap-2 px-4 transition-all hover:bg-primary/10"
            >
              <Link to={path} aria-current={isActive(path) ? "page" : undefined}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExamModeOpen(true)}
            className="flex items-center gap-2 px-4 hover:bg-primary/10"
            aria-label="Start exam mode"
          >
            <Clock className="h-4 w-4" />
            Exam Mode
          </Button>
        </nav>
      </div>



      {/* Exam Mode Modal */}
      <StudyModal isOpen={examModeOpen} onClose={() => setExamModeOpen(false)} />
    </header>
  );
};

export default Navbar;
