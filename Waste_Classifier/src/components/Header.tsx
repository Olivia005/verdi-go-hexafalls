
import React from 'react';
import { RecycleIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 bg-eco-primary/10 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RecycleIcon className="h-8 w-8 text-eco-primary animate-pulse-slow" />
          <h1 className="text-2xl font-bold text-eco-primary">Wasteless</h1>
        </div>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <a href="#" className="text-foreground hover:text-eco-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="text-foreground hover:text-eco-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#classify" className="text-foreground hover:text-eco-primary transition-colors">
                Classify
              </a>
            </li>
            <li>
              <a href="#guide" className="text-foreground hover:text-eco-primary transition-colors">
                Recycling Guide
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
