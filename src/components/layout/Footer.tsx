
import { Link } from 'react-router-dom';
import { Brain, Github, Mail, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">MindLock</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Focus deeply on problems, eliminate distractions, and master your subjects with deliberate practice.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter size={18} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github size={18} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Mail">
                <Mail size={18} />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-3">
              {['Question Management', 'Distraction-Free Mode', 'Time Tracking', 'Performance Analysis', 'Study Planning'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'API', 'Community', 'Support', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {['About', 'Team', 'Careers', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} MindLock. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
